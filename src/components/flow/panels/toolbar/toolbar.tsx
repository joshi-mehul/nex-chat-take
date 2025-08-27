import type { NODE_KINDS } from "@constants/constants";
import { useFlowStore } from "@store/flowStore";

export const Toolbar = () => {
  const zoomIn = useFlowStore((s) => s.zoomIn);
  const zoomOut = useFlowStore((s) => s.zoomOut);
  const resetView = useFlowStore((s) => s.resetView);
  const addNode = useFlowStore((s) => s.addNode);

  const handleAdd = (kind: keyof typeof NODE_KINDS) => {
    addNode({
      kind,
      label: `${kind[0].toUpperCase()}${kind.slice(1)} node`,
      position: { x: 100, y: 100 },
    });
  };

  return (
    <div
      role="toolbar"
      aria-label="Canvas toolbar"
      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
    >
      <button
        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
        onClick={() => handleAdd("source")}
      >
        + Source
      </button>
      <button
        className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white transition-colors"
        onClick={() => handleAdd("transform")}
      >
        + Transform
      </button>
      <button
        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-colors"
        onClick={() => handleAdd("destination")}
      >
        + Destination
      </button>

      <div
        className="mx-3 h-6 w-px bg-gray-300 dark:bg-gray-600"
        aria-hidden="true"
      />

      <button
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        onClick={zoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        onClick={zoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        onClick={resetView}
        aria-label="Reset view"
      >
        Reset
      </button>
    </div>
  );
};
