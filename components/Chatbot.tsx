
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chatbot', handleOpenChat);

        return () => {
            window.removeEventListener('open-chatbot', handleOpenChat);
        };
    }, []);

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([{ sender: 'bot', text: 'Chào bạn! Tôi là Thơ, trợ lý ảo của Anh Thơ Spa. Tôi có thể giúp gì cho bạn?'}]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage = async () => {
        if (userInput.trim() === '') return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const botResponse = await getChatbotResponse(userInput);
        
        setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };
    
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-colors"
                aria-label="Open Chat"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.002-3.001A7.96 7.96 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.415 12.585a6.002 6.002 0 008.17 8.17l-4.085-1.362a1 1 0 01-.527-.527L4.415 12.585z" clipRule="evenodd" /></svg>
            </button>
        );
    }
    
    return (
        <div className="fixed bottom-6 right-6 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300">
            <header className="bg-brand-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="font-bold">Anh Thơ Spa Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-xl font-bold">&times;</button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto bg-brand-light">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-3 flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`p-2 rounded-lg max-w-xs ${msg.sender === 'bot' ? 'bg-gray-200 text-gray-800' : 'bg-brand-dark text-white'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="mb-3 flex justify-start">
                        <div className="p-2 rounded-lg bg-gray-200 text-gray-800">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t flex">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi..."
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button onClick={handleSendMessage} className="bg-brand-primary text-white p-2 rounded-r-md hover:bg-brand-dark">&rarr;</button>
            </div>
        </div>
    );
};

export default Chatbot;