import type { Message } from "@store/conversationStore";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import type { FC } from "react";

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};

const messageBubbleControlsContainerClasses =
  "flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400";
const messageBubbleControlsButtonsClasses =
  "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors";

export type MessageBubbleControlsProps = {
  message: Message;
};
export const MessageBubbleControls: FC<MessageBubbleControlsProps> = ({
  message,
}) => {
  return (
    <div className={messageBubbleControlsContainerClasses}>
      <span>{formatTime(new Date(message.timestamp))}</span>

      {message.type === "ai" && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => copyToClipboard(message.content)}
            className={messageBubbleControlsButtonsClasses}
            title="Copy message"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            className={messageBubbleControlsButtonsClasses}
            title="Like message"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            className={messageBubbleControlsButtonsClasses}
            title="Dislike message"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
