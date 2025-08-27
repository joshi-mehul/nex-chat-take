import { AlertCircle } from "lucide-react";
import type { FC } from "react";

export type MessageListErrorProps = {
  error: string;
};

const messageListErrorContainerClasses = "max-w-4xl mx-auto p-4";
const messageListErrorIconClasses = "w-5 h-5 text-red-500 flex-shrink-0";
const messageListErrorBackgroundClasses =
  "flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg";
const messageListErrorTextClasses = "text-red-700 dark:text-red-400";

export const MessageListError: FC<MessageListErrorProps> = ({ error }) => {
  return (
    <div className={messageListErrorContainerClasses}>
      <div className={messageListErrorBackgroundClasses}>
        <AlertCircle className={messageListErrorIconClasses} />
        <span className={messageListErrorTextClasses}>{error}</span>
      </div>
    </div>
  );
};
