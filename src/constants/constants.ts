export const NODE_DEFAULT_SIZE = { width: 160, height: 60 };

export const NODE_KINDS = {
  source: "source",
  transform: "transform",
  destination: "destination",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  running: "Running",
  success: "Success",
  error: "Error",
};

export const RENDER = {
  gridSize: 24,
  background: "#ffffff",
  gridMajorEvery: 4,
  edgeColor: "#64748b", // slate-500
  edgeHighlight: "#0ea5e9", // sky-500
  selectionColor: "rgba(59,130,246,0.35)", // blue-500 at 35%
};

export const KEYBOARD = {
  delete: ["Delete", "Backspace"],
  multiSelect: ["Shift"],
  pan: ["Space"],
  zoomIn: ["=", "+"],
  zoomOut: ["-", "_"],
  resetView: ["0"],
};

export const ZOOM = {
  min: 0.25,
  max: 3,
  step: 0.1,
};
