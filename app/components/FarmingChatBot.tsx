"use client";
import React, { useState } from "react";
import { FiMessageCircle, FiSend, FiMic, FiUser, FiCpu } from "react-icons/fi";
import VoiceAssistant from "./VoiceAssistant";

const FarmingChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{id: number, text: string, isUser: boolean, timestamp: Date}[]>([
    {
      id: 1,
      text: "Hello! I'm Krishak AI, your farming assistant. Ask me anything about crops, soil, weather, or farming techniques. You can type or use voice input!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Send to Gemini AI via our internal API route
      const prompt = `You are Krishak AI, a helpful farming assistant in India. The farmer asked: "${text}". 
      Please provide practical, actionable advice about farming, crops, soil management, weather, pests, or agriculture in India. 
      Keep your response conversational, helpful, and under 150 words. Use simple language that farmers can understand.`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I couldn't process your request. Please try again.";
      
      // Add AI response
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResponse = (response: string) => {
    // Voice assistant already adds its own messages, so we don't need to duplicate
    console.log("Voice response:", response);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-xl">
        <div className="flex items-center">
          <FiMessageCircle className="text-2xl mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Krishak AI Chat</h3>
            <p className="text-green-100 text-sm">Your farming assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.isUser ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                {message.isUser ? (
                  <FiUser className="text-white text-sm" />
                ) : (
                  <FiCpu className="text-white text-sm" />
                )}
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <FiCpu className="text-white text-sm" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Assistant */}
      <div className="p-4 border-t border-gray-200">
        <VoiceAssistant onResponse={handleVoiceResponse} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about farming, crops, soil, weather..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FiSend className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmingChatBot;
