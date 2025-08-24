// components/ChatApp.tsx
import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { useChat } from '@hooks/useChat';

import { ThemeSettings } from '@components/theme-settings/theme-settings';
import MessageList from '@components/message-list/message-list';
import MessageInput from '@components/message-input/message-input';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const ChatApp: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Chat Assistant</h1>
            <p className="text-sm opacity-90">Powered by AI Technology</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSettings />
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-all duration-200"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
            error={error}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <MessageInput 
            onSendMessage={sendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
