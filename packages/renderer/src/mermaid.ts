import type { CairnGraph, CairnGraphEdge, CairnGraphNode } from "../../graph-engine/src/types.js";

export type MermaidRenderOptions = {
  title?: string;
  includeMetadata?: boolean;
  maxLabelLength?: number;
};

export function renderMermaidFlowchart(graph: CairnGraph, options: MermaidRenderOptions = {}): string {
  const title = options.title ?? `CairnGraph: ${graph.source.chain}`;
  const maxLabelLength = options.maxLabelLength ?? 72;
  const lines = ["flowchart TD", `  %% ${sanitize(title)}`];

  for (const node of graph.nodes) {
    lines.push(renderNode(node, maxLabelLength));
  }

  for (const edge of graph.edges) {
    lines.push(renderEdge(edge, maxLabelLength));
  }

  if (options.includeMetadata) {
    lines.push(`  %% graph_id: ${sanitize(graph.graph_id)}`);
    lines.push(`  %% head_hash: ${sanitize(graph.source.head_hash ?? "none")}`);
    lines.push(`  %% unresolved: ${graph.unresolved.length}`);
  }

  return lines.join("\n");
}

function renderNode(node: CairnGraphNode, maxLabelLength: number): string {
  const shape = node.kind === "chain" ? ["([", "])"] : node.kind === "head" ? ["[[", "]] "] : ["[\"", "\"]"];
  const label = truncate(node.label, maxLabelLength);

  if (node.kind === "chain") {
    return `  ${node.id}(["${sanitize(label)}"])`;
  }

  if (node.kind === "head") {
    return `  ${node.id}[["${sanitize(label)}"]]`;
  }

  void shape;
  return `  ${node.id}["${sanitize(label)}"]`;
}

function renderEdge(edge: CairnGraphEdge, maxLabelLength: number): string {
  const label = truncate(edge.label || edge.edge_type, Math.min(maxLabelLength, 48));
  return `  ${edge.from} -->|"${sanitize(label)}"| ${edge.to}`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function sanitize(value: string): string {
  return value.replace(/\n/g, " ").replace(/:/g, " -").replace(/"/g, "'");
}
