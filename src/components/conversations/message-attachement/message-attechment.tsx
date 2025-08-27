import { Paperclip } from "lucide-react";

const messageAttachmentClasses =
  "p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors";
export const MessageAttachment = () => {
  return (
    <button className={messageAttachmentClasses} title="Attach file">
      <Paperclip className="w-5 h-5" />
    </button>
  );
};
