import {
  useCallback,
  useEffect,
  useRef,
  type FC,
  type KeyboardEvent,
} from "react";

export type MessageInputArea = {
  onSubmit: () => void;
  input: string;
  setInput: (input: string) => void;
  isSending: boolean;
  disabled: boolean;
};

const messageInputAreaContainerClasses = "flex-1 relative";
const messageInputAreaInputClasses = `w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
              rounded-2xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
              scrollbar-thin`;
const messageInputAreaCharCoutnerClasses =
  "absolute bottom-1 right-14 text-xs text-gray-400 dark:text-gray-500";

export const MessageInputArea: FC<MessageInputArea> = ({
  onSubmit,
  input,
  setInput,
  isSending,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit],
  );
  return (
    <div className={messageInputAreaContainerClasses}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your task(s)... (Press Enter to send, Shift+Enter for new line)"
        disabled={disabled || isSending}
        rows={1}
        className={messageInputAreaInputClasses}
        style={{ minHeight: "48px", maxHeight: "120px" }}
      />

      {/* Character count */}
      {input.length > 0 && (
        <div className={messageInputAreaCharCoutnerClasses}>{input.length}</div>
      )}
    </div>
  );
};
