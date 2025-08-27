import { AppConversations } from "@components/page/app-conversations/app-conversations";
import { AppFlow } from "@components/page/app-flow/app-flow";
import { AppHeader } from "@components/page/app-header/app-header";
import { PageContainer } from "@components/page/page-container/page-container";
import React from "react";

const mainPageContainerClasses = "h-screen flex flex-col";
const mainPageSplitViewClasses = "flex flex-1 overflow-hidden";
export const MainPage: React.FC = () => {
  return (
    <PageContainer>
      <div className={mainPageContainerClasses}>
        <AppHeader />
        <div className={mainPageSplitViewClasses}>
          <AppConversations />
          <AppFlow />
        </div>
      </div>
    </PageContainer>
  );
};
