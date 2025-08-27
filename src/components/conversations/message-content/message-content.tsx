import type { FC } from "react";
import { MessageBubbleControls } from "../message-bubble-controls/message-bubble-controls";
import type { Message } from "@store/conversationStore";

export type MessageContentProps = {
  message: Message;
};

const getMessageContentContainerClasses = (type: string) => {
  return `flex flex-col ${type === "user" ? "items-end" : "items-start"} max-w-xs sm:max-w-md lg:max-w-2xl`;
};

const getMessageContentClasses = (type: string) => {
  return `px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg
                  ${
                    type === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  }
                `;
};

const messageContentClasses =
  "text-sm sm:text-base leading-relaxed whitespace-pre-wrap";

export const MessageContent: FC<MessageContentProps> = ({ message }) => {
  return (
    <div className={getMessageContentContainerClasses(message.type)}>
      <div className={getMessageContentClasses(message.type)}>
        <div className={messageContentClasses}>{message.content}</div>
      </div>
      <MessageBubbleControls message={message} />
    </div>
  );
};
