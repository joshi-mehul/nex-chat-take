
import { CanvasStage } from "@components/canvas";
import ChatApp from "@components/chat-app/chat-app";
import { ColorLegend } from "@components/common";
import { KeyboardShortcutsHelp, ZoomControls } from "@components/controls";
import { PropertiesPanel, Toolbar }  from "@components/panels";
import Announcer from "@components/panels/announcer/announcer";
import { ThemeProvider } from "@theme/theme-provider/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <ChatApp />
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 flex flex-col focus:outline-none" aria-label="Canvas region">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
              <ColorLegend />
              <KeyboardShortcutsHelp />
            </div>
            <div className="relative flex-1">
              <CanvasStage />
              <ZoomControls />
            </div>
          </main>
          <PropertiesPanel />
        </div>
        <Announcer />
      </div>
    </ThemeProvider>
  );
}

export default App;
