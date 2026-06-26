import type {
  CairnGraph,
  CairnGraphEdge,
  CairnGraphEdgeType,
  CairnGraphNode,
  CairnStoneChainManifest,
  CairnStoneManifestEdge,
  CairnStoneManifestNode,
  GroundingStatus
} from "./types.js";

export function buildCairnGraphFromChainManifest(manifest: CairnStoneChainManifest): CairnGraph {
  if (!manifest.ok) {
    throw new Error("Cannot build CairnGraph from a failed CairnStone manifest.");
  }

  if (!manifest.chain) {
    throw new Error("Cannot build CairnGraph without a chain name.");
  }

  const nodes: CairnGraphNode[] = [];
  const edges: CairnGraphEdge[] = [];
  const unresolved: Array<{ id: string; reason: string }> = [];
  const chainNodeId = nodeId("chain", manifest.chain);

  nodes.push({
    id: chainNodeId,
    kind: "chain",
    label: manifest.chain,
    title: manifest.chain,
    grounding: "grounded",
    evidence: { chain: manifest.chain },
    metadata: {
      stone_count: manifest.stone_count ?? manifest.nodes?.length ?? 0,
      edge_count: manifest.edge_count ?? manifest.edges?.length ?? 0,
      graph_complete: Boolean(manifest.graph_complete),
      head_hash: manifest.head_hash,
      head_updated_at: manifest.head_updated_at
    }
  });

  const stoneNodes = manifest.nodes ?? [];
  const stoneIdsByHash = new Map<string, string>();

  for (const stone of stoneNodes) {
    const stoneNode = stoneToNode(manifest.chain, stone);
    nodes.push(stoneNode);
    stoneIdsByHash.set(stone.hash, stoneNode.id);

    edges.push({
      id: edgeId("contains", chainNodeId, stoneNode.id),
      from: chainNodeId,
      to: stoneNode.id,
      edge_type: stone.is_head ? "head_of" : "contains",
      label: stone.is_head ? "HEAD" : "contains",
      confidence: 1,
      grounding: "grounded",
      evidence: { chain: manifest.chain, stone_hash: stone.hash }
    });
  }

  for (const sourceEdge of manifest.edges ?? []) {
    const from = stoneIdsByHash.get(sourceEdge.from_hash);
    const to = stoneIdsByHash.get(sourceEdge.to_hash);

    if (!from || !to) {
      unresolved.push({
        id: sourceEdge.id,
        reason: `Graph edge references unresolved stone hash: ${sourceEdge.from_hash} -> ${sourceEdge.to_hash}`
      });
      continue;
    }

    edges.push(manifestEdgeToGraphEdge(sourceEdge, from, to));
  }

  if (manifest.head_hash && !stoneIdsByHash.has(manifest.head_hash)) {
    unresolved.push({
      id: manifest.head_hash,
      reason: "Manifest declares a HEAD hash that is not present in manifest.nodes."
    });
  }

  return {
    graph_id: `cairngraph:${manifest.chain}:${shortHash(manifest.head_hash ?? "no-head")}`,
    source: {
      chain: manifest.chain,
      head_hash: manifest.head_hash,
      graph_complete: manifest.graph_complete,
      adapter: "cairnstone-chain-manifest"
    },
    nodes,
    edges,
    unresolved,
    created_at: new Date().toISOString()
  };
}

function stoneToNode(chain: string, stone: CairnStoneManifestNode): CairnGraphNode {
  const parsed = parseLod5(stone.lod5 ?? "");
  const grounding: GroundingStatus = stone.hash ? "grounded" : "unresolved";

  return {
    id: nodeId("stone", stone.hash),
    kind: stone.is_head ? "head" : "stone",
    label: stone.is_head ? `${stone.title} [HEAD]` : stone.title,
    title: stone.title,
    grounding,
    evidence: {
      chain,
      stone_hash: stone.hash,
      short_hash: stone.short_hash
    },
    metadata: {
      author: stone.author,
      created_at: stone.created_at,
      is_head: Boolean(stone.is_head),
      lod5: stone.lod5,
      line_count: parsed.line_count,
      ref_count: parsed.ref_count,
      compression_ratio: parsed.compression_ratio,
      flag_count: parsed.flag_count
    }
  };
}

function manifestEdgeToGraphEdge(source: CairnStoneManifestEdge, from: string, to: string): CairnGraphEdge {
  const edgeType = normalizeEdgeType(source.edge_type);

  return {
    id: source.id || edgeId(edgeType, from, to),
    from,
    to,
    edge_type: edgeType,
    label: source.note || source.edge_type,
    confidence: 1,
    grounding: "grounded",
    evidence: {
      edge_id: source.id,
      stone_hash: source.from_hash
    },
    metadata: {
      from_hash: source.from_hash,
      to_hash: source.to_hash,
      note: source.note,
      created_at: source.created_at,
      source_edge_type: source.edge_type
    }
  };
}

function normalizeEdgeType(value: string): CairnGraphEdgeType {
  const allowed = new Set<CairnGraphEdgeType>([
    "contains",
    "head_of",
    "supersedes",
    "patches",
    "documents",
    "reviews",
    "references",
    "expands_to",
    "verifies",
    "fails",
    "passes",
    "depends_on",
    "imports",
    "calls",
    "deploys",
    "tests",
    "generated",
    "attached_to",
    "inferred"
  ]);

  return allowed.has(value as CairnGraphEdgeType) ? (value as CairnGraphEdgeType) : "references";
}

function parseLod5(value: string): {
  line_count?: number;
  ref_count?: number;
  compression_ratio?: number;
  flag_count?: number;
} {
  return {
    line_count: numberMatch(value, /(\d+) lines/),
    ref_count: numberMatch(value, /(\d+) refs?/),
    compression_ratio: numberMatch(value, /([0-9]+(?:\.[0-9]+)?)x ratio/),
    flag_count: numberMatch(value, /(\d+) flags?/)
  };
}

function numberMatch(value: string, pattern: RegExp): number | undefined {
  const match = value.match(pattern);
  if (!match) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function nodeId(kind: string, value: string): string {
  return `${kind}_${stableId(value)}`;
}

function edgeId(kind: string, from: string, to: string): string {
  return `${kind}_${stableId(from)}_${stableId(to)}`;
}

function stableId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "node";
}

function shortHash(value: string): string {
  return value.slice(0, 12) || "none";
}
