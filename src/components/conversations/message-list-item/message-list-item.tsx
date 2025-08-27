import { memo } from "react";
import { MessageBubbleUserType } from "../message-bubble-user-type/message-bubble-user-type";
import { MessageContent } from "../message-content/message-content";
import type { Message } from "@store/conversationStore";

const getMessageListItemContainerClasses = (type: string) => {
  return `flex gap-4 max-w-4xl mx-auto p-4 animate-fade-in ${
    type === "user" ? "justify-end" : "justify-start"
  }`;
};

export const MessageListItem = memo(({ message }: { message: Message }) => {
  return (
    <div className={getMessageListItemContainerClasses(message.type)}>
      {message.type === "ai" && <MessageBubbleUserType type={message.type} />}
      <MessageContent message={message} />
      {message.type === "user" && <MessageBubbleUserType type={message.type} />}
    </div>
  );
});

MessageListItem.displayName = "MessageItem";
