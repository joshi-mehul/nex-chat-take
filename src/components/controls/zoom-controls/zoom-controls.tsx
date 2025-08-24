import { useFlowStore } from "@store/flowStore";


export const ZoomControls = () => {
  const viewport = useFlowStore(s => s.viewport);
const zoomIn = useFlowStore(s => s.zoomIn);
const zoomOut = useFlowStore(s => s.zoomOut);
const resetView = useFlowStore(s => s.resetView);
  return (
    <div className="absolute top-4 right-4 flex flex-col bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
      <button className="px-2 py-1 hover:bg-gray-50" onClick={zoomIn} aria-label="Zoom in">+</button>
      <div className="px-2 py-1 text-xs text-gray-600" aria-live="polite">{Math.round(viewport.zoom * 100)}%</div>
      <button className="px-2 py-1 hover:bg-gray-50" onClick={zoomOut} aria-label="Zoom out">-</button>
      <button className="px-2 py-1 hover:bg-gray-50" onClick={resetView} aria-label="Reset view">Reset</button>
    </div>
  );
}
