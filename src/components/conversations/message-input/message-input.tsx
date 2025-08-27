import React, { memo, useCallback, useState } from "react";
import { MessageAttachment } from "../message-attachement/message-attechment";
import { MessageInputArea } from "../message-input-area/message-input-area";
import { MessageVoiceInput } from "../message-voice-input/message-voice-input";
import { MessageSendButton } from "../message-send-button/message-send-button";

const messageInputContainerClass = "p-4";
const messageInputTextAreaClass = "flex items-center gap-3 max-w-4xl mx-auto";
const messageInputAIMessageTitleClass = "lex justify-center mt-2";
const messageInputAIMessageSubTitleClass =
  "text-xs text-gray-400 dark:text-gray-500 text-center";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = memo(
  ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = useCallback(async () => {
      if (input.trim() && !disabled && !isSending) {
        setIsSending(true);
        try {
          await onSendMessage(input);
          setInput("");
        } finally {
          setIsSending(false);
        }
      }
    }, [input, disabled, isSending, onSendMessage]);

    const isDisabled = disabled || isSending || !input.trim();

    return (
      <div className={messageInputContainerClass}>
        <div className={messageInputTextAreaClass}>
          <MessageAttachment />
          <MessageInputArea
            disabled={disabled}
            onSubmit={handleSubmit}
            input={input}
            isSending={isSending}
            setInput={setInput}
          />
          <MessageVoiceInput />
          <MessageSendButton onSubmit={handleSubmit} disabled={isDisabled} />
        </div>
        <div className={messageInputAIMessageTitleClass}>
          <p className={messageInputAIMessageSubTitleClass}>
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    );
  },
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
