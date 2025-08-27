import { Mic } from "lucide-react";

export const MessageVoiceInput = () => {
  return (
    <button
      className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      title="Voice input"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
};
