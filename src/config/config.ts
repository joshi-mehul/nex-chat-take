export const appConfig = {
  appName: "Diagram",
  ariaAppLabel: "Diagram editor",
  initialViewport: {
    zoom: 1,
    offset: { x: 0, y: 0 }
  },
  // Demo seed graph
  seed: {
    nodes: [
      {
        id: "n1",
        kind: "source",
        label: "Source: S3",
        position: { x: 100, y: 100 },
        size: { width: 180, height: 70 },
        status: "success",
        meta: { bucket: "my-bucket" }
      },
      {
        id: "n2",
        kind: "transform",
        label: "Transform: ETL",
        position: { x: 380, y: 180 },
        size: { width: 200, height: 80 },
        status: "running",
        meta: { schedule: "0 * * * *" }
      },
      {
        id: "n3",
        kind: "destination",
        label: "Destination: Warehouse",
        position: { x: 720, y: 120 },
        size: { width: 220, height: 80 },
        status: "idle",
        meta: { cluster: "analytics" }
      }
    ],
    edges: [
      { id: "e1", fromNodeId: "n1", toNodeId: "n2", label: "ingest" },
      { id: "e2", fromNodeId: "n2", toNodeId: "n3", label: "load" }
    ]
  }
} as const;
