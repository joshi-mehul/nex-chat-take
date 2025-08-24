import { STATUS_LABELS } from "@constants/constants";
import type { FlowNode } from "@types/flow";


export const nodeAriaLabel = (node: FlowNode) => {
  const statusText = node.status ? `, status ${STATUS_LABELS[node.status] ?? node.status}` : "";
  return `${node.label} (${node.kind}) at ${Math.round(node.position.x)}, ${Math.round(node.position.y)}${statusText}`;
};

export const edgeAriaLabel = (fromLabel: string, toLabel: string, edgeLabel?: string) => {
  return `Edge from ${fromLabel} to ${toLabel}${edgeLabel ? ` labeled ${edgeLabel}` : ""}`;
};
