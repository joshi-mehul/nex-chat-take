// components/MessageList.tsx
import React, { memo } from "react";
import {
  User,
  Bot,
  AlertCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import type { Message } from "@components/chat-app/chat-app";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const MessageItem = memo(({ message }: { message: Message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div
      className={`flex gap-4 max-w-4xl mx-auto p-4 animate-fade-in ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "assistant" && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-xs sm:max-w-md lg:max-w-2xl`}
      >
        <div
          className={`
          px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg
          ${
            message.role === "user"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
          }
        `}
        >
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(message.timestamp)}</span>

          {message.role === "assistant" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(message.content)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Like message"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Dislike message"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {message.role === "user" && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = "MessageItem";

const MessageList: React.FC<MessageListProps> = memo(
  ({ messages, isLoading, error }) => {
    return (
      <div className="min-h-full">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Bot className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Nexla AI</h3>
            <p className="text-center max-w-md">
              Start a conversation with Nexla assistant. Ask questions, get
              help, or share a problem!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md">
                <div className="flex items-center gap-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-4">
                AI is typing...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

MessageList.displayName = "MessageList";

export default MessageList;
