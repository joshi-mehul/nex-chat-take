import type { FC, ReactNode } from "react";

const pageContainerClasses =
  "min-h-screen bg-gradient-to-br bg-gray-100 dark:bg-black transition-colors duration-200";

export const PageContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={pageContainerClasses}>{children}</div>;
};
