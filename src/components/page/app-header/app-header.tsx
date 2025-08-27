import { ThemeToggle } from "@components/page/app-header/theme-toggle";

const appHeaderContainerClasses =
  "flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg";
const appHeaderLeftContainerClasses = "flex items-center gap-3";
const appHeaderLogoImageClasses = "p-2 bg-white bg-opacity-20 rounded-lg";
const appHeaderTitleClasses = "text-xl font-bold";
const appHeaderSubTitleClasses = "text-sm opacity-90";
const appHeaderRightContainerClasses = "flex items-center gap-2";

export const AppHeader = () => {
  return (
    <div className={appHeaderContainerClasses}>
      <div className={appHeaderLeftContainerClasses}>
        <div className={appHeaderLogoImageClasses}>
          <img src="https://nexla.com/n3x_ctx/uploads/2024/06/Layer_1.svg" />
        </div>
        <div>
          <h1 className={appHeaderTitleClasses}>Nexla Assistant</h1>
          <p className={appHeaderSubTitleClasses}>Powered by Nexla AI</p>
        </div>
      </div>
      <div className={appHeaderRightContainerClasses}>
        <ThemeToggle />
      </div>
    </div>
  );
};
