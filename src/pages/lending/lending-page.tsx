import { HeroSection } from "@components/page/hero-section/hero-section";
import { LandingPageChat } from "@components/page/lending-page-chat/lending-page-chat";
import { LendingPageFooter } from "@components/page/lending-page-footer/lending-page-footer";
import { PageContainer } from "@components/page/page-container/page-container";
import { PredefinedPrompts } from "@components/page/predefined-prompts/predefined-prompts";
import { type FC } from "react";

const landingPageContainerClasses = "container mx-auto px-4 py-12";

export const LandingPage: FC = () => {
  return (
    <PageContainer>
      <div className={landingPageContainerClasses}>
        <HeroSection />
        <LandingPageChat />
        <PredefinedPrompts />
        <LendingPageFooter />
      </div>
    </PageContainer>
  );
};
