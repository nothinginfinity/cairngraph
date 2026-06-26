import type { CairnGraph, CairnGraphEdge, CairnGraphNode } from "../../graph-engine/src/types.js";

export type BlastRadiusDirection = "outgoing" | "incoming" | "both";

export type BlastRadiusOptions = {
  rootNodeId?: string;
  rootStoneHash?: string;
  rootRefId?: string;
  depth?: number;
  direction?: BlastRadiusDirection;
};

export type BlastRadiusResult = {
  ok: boolean;
  root_node_id?: string;
  depth: number;
  direction: BlastRadiusDirection;
  nodes: CairnGraphNode[];
  edges: CairnGraphEdge[];
  impacted_node_count: number;
  impacted_edge_count: number;
  risk_score: number;
  unresolved: Array<{ id: string; reason: string }>;
  error?: string;
};

export function computeBlastRadius(graph: CairnGraph, options: BlastRadiusOptions = {}): BlastRadiusResult {
  const depth = Math.max(0, options.depth ?? 2);
  const direction = options.direction ?? "both";
  const root = resolveRootNode(graph, options);

  if (!root) {
    return {
      ok: false,
      depth,
      direction,
      nodes: [],
      edges: [],
      impacted_node_count: 0,
      impacted_edge_count: 0,
      risk_score: 0,
      unresolved: [{ id: options.rootNodeId ?? options.rootStoneHash ?? options.rootRefId ?? "missing-root", reason: "root node was not found" }],
      error: "root node was not found"
    };
  }

  const visited = new Set<string>([root.id]);
  const edgeIds = new Set<string>();
  const frontier: Array<{ node_id: string; distance: number }> = [{ node_id: root.id, distance: 0 }];

  while (frontier.length > 0) {
    const current = frontier.shift();
    if (!current || current.distance >= depth) continue;

    for (const edge of graph.edges.filter((item) => touches(item, current.node_id, direction))) {
      edgeIds.add(edge.id);
      for (const nextId of nextIds(edge, current.node_id, direction)) {
        if (visited.has(nextId)) continue;
        visited.add(nextId);
        frontier.push({ node_id: nextId, distance: current.distance + 1 });
      }
    }
  }

  const nodes = graph.nodes.filter((node) => visited.has(node.id));
  const edges = graph.edges.filter((edge) => edgeIds.has(edge.id));

  return {
    ok: true,
    root_node_id: root.id,
    depth,
    direction,
    nodes,
    edges,
    impacted_node_count: Math.max(0, nodes.length - 1),
    impacted_edge_count: edges.length,
    risk_score: Math.min(100, nodes.length * 2 + edges.length + nodes.filter((node) => node.grounding !== "grounded").length * 3),
    unresolved: []
  };
}

export function blastRadiusSubgraph(graph: CairnGraph, result: BlastRadiusResult): CairnGraph {
  return {
    ...graph,
    graph_id: `${graph.graph_id}:blast-radius:${result.root_node_id ?? "missing"}`,
    nodes: result.nodes,
    edges: result.edges,
    unresolved: [...graph.unresolved, ...result.unresolved]
  };
}

function resolveRootNode(graph: CairnGraph, options: BlastRadiusOptions): CairnGraphNode | undefined {
  if (options.rootNodeId) return graph.nodes.find((node) => node.id === options.rootNodeId);
  if (options.rootStoneHash) return graph.nodes.find((node) => node.evidence.stone_hash === options.rootStoneHash && (node.kind === "stone" || node.kind === "head"));
  if (options.rootRefId) return graph.nodes.find((node) => node.evidence.ref_id === options.rootRefId && node.kind === "ref");
  return graph.nodes.find((node) => node.kind === "head") ?? graph.nodes[0];
}

function touches(edge: CairnGraphEdge, nodeId: string, direction: BlastRadiusDirection): boolean {
  if (direction === "outgoing") return edge.from === nodeId;
  if (direction === "incoming") return edge.to === nodeId;
  return edge.from === nodeId || edge.to === nodeId;
}

function nextIds(edge: CairnGraphEdge, nodeId: string, direction: BlastRadiusDirection): string[] {
  if (direction === "outgoing") return edge.from === nodeId ? [edge.to] : [];
  if (direction === "incoming") return edge.to === nodeId ? [edge.from] : [];
  if (edge.from === nodeId) return [edge.to];
  if (edge.to === nodeId) return [edge.from];
  return [];
}
