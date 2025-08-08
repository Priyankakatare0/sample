"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatInput ({ onSend, disabled }) {
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);

    // Auto-focus the input when component mounts or when not disabled
    useEffect(() => {
        if (!disabled && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!input.trim() || disabled) return;
        onSend(input);
        setInput("");
        
        // Focus back on input after sending
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-3 bg-dark border-top">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <textarea 
                        ref={textareaRef}
                        className="form-control"
                        placeholder={disabled ? "AI is thinking..." : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={disabled}
                        rows={1}
                        style={{
                            resize: 'none',
                            borderRadius: '20px 0 0 20px',
                            border: '1px solid #444'
                        }}
                    />
                    <button 
                        className="btn btn-primary"
                        type="submit"
                        disabled={!input.trim() || disabled}
                        style={{
                            borderRadius: '0 20px 20px 0',
                            paddingLeft: '20px',
                            paddingRight: '20px'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}