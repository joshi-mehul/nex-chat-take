import { Bot } from "lucide-react";

const messageListEmptyContainerClasses =
  "flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400";
const messageListEmptyBotIconClasses =
  "p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4";
const messageListEmptyTitleClasses = "text-lg font-semibold mb-2";
const messageListEmptySubTitleClasses = "text-center max-w-md";
export const MessageListEmpty = () => {
  return (
    <div className={messageListEmptyContainerClasses}>
      <div className={messageListEmptyBotIconClasses}>
        <Bot className="w-12 h-12" />
      </div>
      <h3 className={messageListEmptyTitleClasses}>Welcome to Nexla AI</h3>
      <p className={messageListEmptySubTitleClasses}>
        Start a conversation with Nexla assistant. Ask questions, get help, or
        share a problem!
      </p>
    </div>
  );
};
