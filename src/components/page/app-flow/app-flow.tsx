import { ColorLegend } from "@components/flow";
import { CanvasStage } from "@components/flow/canvas";
import { KeyboardShortcutsHelp, ZoomControls } from "@components/flow/controls";
import { PropertiesPanel, Toolbar } from "@components/flow/panels";
import Announcer from "@components/flow/panels/announcer/announcer";
import { usePipelineStore } from "@store/pipelineStore";

const appFlowMainContainer =
  "flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900";
const appFlowSubContainer = "flex-1 flex overflow-hidden h-full";
const appFlowCanvasRegion = "flex-1 flex flex-col focus:outline-none";
const appFlowHeader =
  "flex items-center justify-between px-3 py-2 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm";
const appFlowCanvasContainer = "h-full relative bg-gray-25 dark:bg-gray-950";

export const AppFlow = () => {
  const { currentPipelineId } = usePipelineStore();

  return currentPipelineId ? (
    <div className={appFlowMainContainer}>
      <Toolbar />
      <div className={appFlowSubContainer}>
        <main className={appFlowCanvasRegion} aria-label="Canvas region">
          <div className={appFlowHeader}>
            <ColorLegend />
            <KeyboardShortcutsHelp />
          </div>
          <div className={appFlowCanvasContainer}>
            <CanvasStage />
            <ZoomControls />
          </div>
        </main>
        <PropertiesPanel />
      </div>
      <Announcer />
    </div>
  ) : null;
};
