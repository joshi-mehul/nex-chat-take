import { Send } from "lucide-react";
import type { FC } from "react";

export type MessageSendButtonProps = {
  onSubmit: () => void;
  disabled: boolean;
};

const getMessageSendButtonClasses = (disabled: boolean) => {
  return `
            p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl
            ${
              disabled
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95"
            }
          `;
};

const getSendIconClasses = (disabled: boolean) => {
  return `w-5 h-5 ${disabled ? "text-gray-500" : "text-white"}`;
};

export const MessageSendButton: FC<MessageSendButtonProps> = ({
  onSubmit,
  disabled,
}) => {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={getMessageSendButtonClasses(disabled)}
      title="Send message"
    >
      <Send className={getSendIconClasses(disabled)} />
    </button>
  );
};
