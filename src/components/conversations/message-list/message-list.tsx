// components/MessageList.tsx
import React, { memo } from "react";
import { MessageListItem } from "../message-list-item/message-list-item";
import { MessageListLoading } from "../message-list-loading/message-list-loading";
import { MessageListError } from "../message-list-error/message-list-error";
import { MessageListEmpty } from "../message-list-empty/message-list-empty";
import type { Message } from "@store/conversationStore";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const messageListContainerClasses = "min-h-full";

const MessageList: React.FC<MessageListProps> = memo(
  ({ messages, isLoading, error }) => {
    const isMessageListEmpty = messages.length === 0 && !isLoading;
    return (
      <div className={messageListContainerClasses}>
        {isMessageListEmpty && <MessageListEmpty />}

        {messages.map((message) => (
          <MessageListItem key={message.id} message={message} />
        ))}

        {isLoading && <MessageListLoading />}

        {error && <MessageListError error={error} />}
      </div>
    );
  },
);

MessageList.displayName = "MessageList";

export default MessageList;
