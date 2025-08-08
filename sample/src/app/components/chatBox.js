import Message from "./messages";
import { useEffect, useRef } from "react";

export default function ChatBox ({ messages, isLoading }) {
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ 
            behavior: "smooth",
            block: "end"
        });
    };

    // Scroll to bottom when messages change or when loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Also scroll to bottom on initial render
    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div 
            ref={chatContainerRef}
            className="flex-grow-1 p-3 overflow-auto" 
            style={{
                backgroundColor: '#0a0a0a',
                height: '1px', // This forces flex-grow-1 to work properly
                scrollBehavior: 'smooth'
            }}
        >
            {messages.map((msg) => (
                <Message key={msg.id} text={msg.text} sender={msg.sender} image={msg.image} />
            ))}
            {isLoading && (
                <div className="mb-3 d-flex justify-content-start">
                    <div 
                        style={{
                            maxWidth: '85%',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#888',
                            padding: '8px 0'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status" style={{width: '16px', height: '16px'}}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            AI is thinking...
                        </div>
                    </div>
                </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
        </div>
    );
}