import { Bot } from "lucide-react";

export const MessageListLoading = () => {
  return (
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
          Nexla AI is typing...
        </span>
      </div>
    </div>
  );
};
