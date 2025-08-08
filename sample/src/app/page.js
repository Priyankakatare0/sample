"use client";
import { useState } from "react";
import ChatInput from "./components/chatInput";
import ChatBox from "./components/chatBox";

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Call Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.ok && (data.reply || data.image)) {
        // Add bot response (text or image)
        setMessages((prev) => [
          ...prev,
          data.reply ? {
            id: Date.now() + 1,
            text: data.reply,
            sender: "bot"
          } : null,
          data.image ? {
            id: Date.now() + 2,
            image: data.image,
            sender: "bot"
          } : null
        ].filter(Boolean));
      } else {
        // Handle specific error messages
        const errorMessage = data.error || "Sorry, I encountered an error. Please try again.";
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          text: errorMessage,
          sender: "bot"
        }]);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-black">
      <div className="d-flex align-items-center justify-content-between py-3 px-3" style={{ background: '#222', color: '#fff', fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '1px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <span>AI Chatbot Assistant</span>
      
      </div>
      <ChatBox messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
