import MessageInput from "@components/conversations/message-input/message-input";
import { useConversationStore } from "@store/conversationStore";
import { useServicesStore } from "@store/servicesStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPageChatContainerClasses = "max-w-4xl mx-auto";
export const LandingPageChat = () => {
  const { createConversation, isLoading } = useConversationStore();
  const { loadServices } = useServicesStore();

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const navigate = useNavigate();

  const handleSubmit = async (inputPrompt: string) => {
    if (!inputPrompt.trim() || isLoading) return;

    try {
      const conversationId = await createConversation(inputPrompt);
      navigate(`/application/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div className={LandingPageChatContainerClasses}>
      <MessageInput
        onSendMessage={async (message) => {
          await handleSubmit(message);
        }}
        disabled={isLoading}
      />
    </div>
  );
};
