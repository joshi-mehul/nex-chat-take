import { usePipelineStore } from "@store/pipelineStore";

export const ZoomControls = () => {
  const { viewport, zoomIn, zoomOut, resetView } = usePipelineStore();

  return (
    <div className="absolute top-4 right-4 flex flex-col bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20 overflow-hidden">
      <button
        className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={zoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <div
        className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-750"
        aria-live="polite"
      >
        {Math.round(viewport.zoom * 100)}%
      </div>
      <button
        className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={zoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={resetView}
        aria-label="Reset view"
      >
        Reset
      </button>
    </div>
  );
};
