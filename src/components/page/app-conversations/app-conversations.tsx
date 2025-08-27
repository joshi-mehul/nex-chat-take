import { Prompt } from "@components/conversations/prompt/prompt-app";
import { usePipelineStore } from "@store/pipelineStore";

const getAppConversationsContainerClasses = (isFullWidth: boolean) =>
  `h-full w-full ${isFullWidth ? "max-w-[40%]" : "max-w-[100%]"} min-w-[350px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col`;
export const AppConversations = () => {
  const { currentPipelineId } = usePipelineStore();
  return (
    <div className={getAppConversationsContainerClasses(!!currentPipelineId)}>
      <Prompt />
    </div>
  );
};
