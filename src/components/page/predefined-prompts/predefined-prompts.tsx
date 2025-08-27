import { PromptCard } from "@components/conversations/prompt-card/prompt-card";
import { useConversationStore } from "@store/conversationStore";
import { usePrompts } from "@store/usePrededinedPrompts";
import { useNavigate } from "react-router-dom";

const predefinedPromptsContainerClasses =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto";
export const PredefinedPrompts = () => {
  const prompts = usePrompts();
  const { createConversation, isLoading } = useConversationStore();

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
    <div className={predefinedPromptsContainerClasses}>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onSelect={handleSubmit} />
      ))}
    </div>
  );
};
