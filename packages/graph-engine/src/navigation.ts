import type { CairnGraph, CairnGraphEdge, CairnGraphNode } from "./types.js";

export type GroundingNavigationOptions = {
  includeRawSourceNodes?: boolean;
  includeSourceUrlNodes?: boolean;
};

export function addGroundingNavigation(
  graph: CairnGraph,
  options: GroundingNavigationOptions = {}
): CairnGraph {
  const includeRawSourceNodes = options.includeRawSourceNodes ?? true;
  const includeSourceUrlNodes = options.includeSourceUrlNodes ?? true;
  const nodes = [...graph.nodes];
  const edges = [...graph.edges];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeIds = new Set(edges.map((edge) => edge.id));

  for (const node of graph.nodes) {
    if (node.kind !== "ref") continue;

    if (includeRawSourceNodes && node.evidence.raw_key) {
      const rawNode = rawSourceNode(node);
      addNodeOnce(nodes, nodeIds, rawNode);
      addEdgeOnce(edges, edgeIds, {
        id: edgeId("expands_to_raw", node.id, rawNode.id),
        from: node.id,
        to: rawNode.id,
        edge_type: "expands_to",
        label: "raw key",
        confidence: 1,
        grounding: "grounded",
        evidence: {
          chain: node.evidence.chain,
          stone_hash: node.evidence.stone_hash,
          ref_id: node.evidence.ref_id,
          raw_key: node.evidence.raw_key
        }
      });
    }

    if (includeSourceUrlNodes && node.evidence.source_url) {
      const fileNode = sourceUrlNode(node);
      addNodeOnce(nodes, nodeIds, fileNode);
      addEdgeOnce(edges, edgeIds, {
        id: edgeId("expands_to_source", node.id, fileNode.id),
        from: node.id,
        to: fileNode.id,
        edge_type: "expands_to",
        label: "source lines",
        confidence: 1,
        grounding: "grounded",
        evidence: {
          chain: node.evidence.chain,
          stone_hash: node.evidence.stone_hash,
          ref_id: node.evidence.ref_id,
          source_url: node.evidence.source_url,
          path: node.evidence.path,
          line_start: node.evidence.line_start,
          line_end: node.evidence.line_end
        }
      });
    }
  }

  return {
    ...graph,
    nodes,
    edges
  };
}

export function navigationTargetsForNode(graph: CairnGraph, nodeId: string): CairnGraphNode[] {
  const targets = new Map(graph.nodes.map((node) => [node.id, node]));
  return graph.edges
    .filter((edge) => edge.from === nodeId && edge.edge_type === "expands_to")
    .map((edge) => targets.get(edge.to))
    .filter((node): node is CairnGraphNode => Boolean(node));
}

function rawSourceNode(refNode: CairnGraphNode): CairnGraphNode {
  const rawKey = refNode.evidence.raw_key ?? "raw";
  return {
    id: nodeId("raw_source", rawKey),
    kind: "raw_source",
    label: rawKey,
    title: `Raw source for ${refNode.evidence.ref_id ?? refNode.id}`,
    grounding: "grounded",
    evidence: {
      chain: refNode.evidence.chain,
      stone_hash: refNode.evidence.stone_hash,
      ref_id: refNode.evidence.ref_id,
      raw_key: rawKey,
      path: refNode.evidence.path,
      line_start: refNode.evidence.line_start,
      line_end: refNode.evidence.line_end
    }
  };
}

function sourceUrlNode(refNode: CairnGraphNode): CairnGraphNode {
  const sourceUrl = refNode.evidence.source_url ?? "source";
  const path = refNode.evidence.path ?? "source";
  const lineStart = refNode.evidence.line_start;
  const lineEnd = refNode.evidence.line_end;
  const label = lineStart && lineEnd ? `${path}:${lineStart}-${lineEnd}` : path;

  return {
    id: nodeId("file", sourceUrl),
    kind: "file",
    label,
    title: sourceUrl,
    grounding: "grounded",
    evidence: {
      chain: refNode.evidence.chain,
      stone_hash: refNode.evidence.stone_hash,
      ref_id: refNode.evidence.ref_id,
      source_url: sourceUrl,
      path,
      line_start: lineStart,
      line_end: lineEnd
    }
  };
}

function addNodeOnce(nodes: CairnGraphNode[], nodeIds: Set<string>, node: CairnGraphNode): void {
  if (nodeIds.has(node.id)) return;
  nodes.push(node);
  nodeIds.add(node.id);
}

function addEdgeOnce(edges: CairnGraphEdge[], edgeIds: Set<string>, edge: CairnGraphEdge): void {
  if (edgeIds.has(edge.id)) return;
  edges.push(edge);
  edgeIds.add(edge.id);
}

function nodeId(kind: string, value: string): string {
  return `${kind}_${stableId(value)}`;
}

function edgeId(kind: string, from: string, to: string): string {
  return `${kind}_${stableId(from)}_${stableId(to)}`;
}

function stableId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 96) || "node";
}
