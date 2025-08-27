import { Bot, User } from "lucide-react";
import type { FC } from "react";

export type MessageBubbleUserTypeProps = {
  type: "user" | "ai";
};

const messageBubbleUserTypeContainerClasses =
  "flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg";

export const MessageBubbleUserType: FC<MessageBubbleUserTypeProps> = ({
  type,
}) => {
  return (
    <div className={messageBubbleUserTypeContainerClasses}>
      {type === "user" ? (
        <User className="w-5 h-5 text-white" />
      ) : (
        <Bot className="w-5 h-5 text-white" />
      )}
    </div>
  );
};
