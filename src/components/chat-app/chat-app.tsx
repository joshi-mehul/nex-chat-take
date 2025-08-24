// components/ChatApp.tsx
import React, { useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import { useChat } from "@hooks/useChat";

import { ThemeSettings } from "@components/theme-settings/theme-settings";
import MessageList from "@components/message-list/message-list";
import MessageInput from "@components/message-input/message-input";

const ChatApp: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl bg-white dark:bg-gray-800">

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
          <MessageInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
