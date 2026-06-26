import type { CairnGraph, CairnGraphNodeKind, GroundingStatus } from "./types.js";

export type GroundingReport = {
  graph_id: string;
  chain: string;
  head_hash?: string;
  node_count: number;
  edge_count: number;
  unresolved_count: number;
  nodes_by_kind: Record<string, number>;
  nodes_by_grounding: Record<GroundingStatus, number>;
  evidence_gaps: Array<{ node_id: string; kind: CairnGraphNodeKind; reason: string }>;
  complete: boolean;
};

export function groundingReport(graph: CairnGraph): GroundingReport {
  const nodesByKind: Record<string, number> = {};
  const nodesByGrounding: Record<GroundingStatus, number> = {
    grounded: 0,
    mixed: 0,
    inferred: 0,
    unresolved: 0
  };
  const evidenceGaps: Array<{ node_id: string; kind: CairnGraphNodeKind; reason: string }> = [];

  for (const node of graph.nodes) {
    nodesByKind[node.kind] = (nodesByKind[node.kind] ?? 0) + 1;
    nodesByGrounding[node.grounding] += 1;

    if (node.kind === "ref") {
      if (!node.evidence.ref_id) evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "ref node missing ref_id" });
      if (!node.evidence.raw_key) evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "ref node missing raw_key" });
      if (!node.evidence.path) evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "ref node missing path" });
      if (typeof node.evidence.line_start !== "number" || typeof node.evidence.line_end !== "number") {
        evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "ref node missing line window" });
      }
    }

    if ((node.kind === "stone" || node.kind === "head") && !node.evidence.stone_hash) {
      evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "stone node missing stone_hash" });
    }

    if (node.kind === "raw_source" && !node.evidence.raw_key) {
      evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "raw source node missing raw_key" });
    }

    if (node.kind === "file" && !node.evidence.source_url) {
      evidenceGaps.push({ node_id: node.id, kind: node.kind, reason: "file node missing source_url" });
    }
  }

  const unresolvedCount = graph.unresolved.length + evidenceGaps.length + nodesByGrounding.unresolved;

  return {
    graph_id: graph.graph_id,
    chain: graph.source.chain,
    head_hash: graph.source.head_hash,
    node_count: graph.nodes.length,
    edge_count: graph.edges.length,
    unresolved_count: unresolvedCount,
    nodes_by_kind: nodesByKind,
    nodes_by_grounding: nodesByGrounding,
    evidence_gaps: evidenceGaps,
    complete: unresolvedCount === 0
  };
}
