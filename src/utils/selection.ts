
import type { FlowNode, Vector2 } from "@types/flow";
import { pointInMarquee } from "./geometry";

export const nodesInMarquee = (nodes: FlowNode[], start: Vector2, end: Vector2): string[] => {
  return nodes
    .filter(n => pointInMarquee(n.position, start, end))
    .map(n => n.id);
};
