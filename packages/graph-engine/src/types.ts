export type CairnGraphNodeKind =
  | "chain"
  | "head"
  | "stone"
  | "ref"
  | "raw_source"
  | "file"
  | "commit"
  | "receipt"
  | "workflow"
  | "test"
  | "deployment"
  | "diagram"
  | "agent"
  | "byte_bundle"
  | "verification"
  | "inferred";

export type CairnGraphEdgeType =
  | "contains"
  | "head_of"
  | "supersedes"
  | "patches"
  | "documents"
  | "reviews"
  | "references"
  | "expands_to"
  | "verifies"
  | "fails"
  | "passes"
  | "depends_on"
  | "imports"
  | "calls"
  | "deploys"
  | "tests"
  | "generated"
  | "attached_to"
  | "inferred";

export type GroundingStatus = "grounded" | "mixed" | "inferred" | "unresolved";

export type CairnGraphEvidence = {
  chain?: string;
  stone_hash?: string;
  short_hash?: string;
  ref_id?: string;
  raw_key?: string;
  path?: string;
  line_start?: number;
  line_end?: number;
  edge_id?: string;
  receipt_id?: string;
  repo?: string;
  commit?: string;
  source_url?: string;
  inferred_reason?: string;
};

export type CairnGraphNode = {
  id: string;
  kind: CairnGraphNodeKind;
  label: string;
  title?: string;
  grounding: GroundingStatus;
  evidence: CairnGraphEvidence;
  metadata?: Record<string, unknown>;
};

export type CairnGraphEdge = {
  id: string;
  from: string;
  to: string;
  edge_type: CairnGraphEdgeType;
  label?: string;
  confidence: number;
  grounding: GroundingStatus;
  evidence: CairnGraphEvidence;
  metadata?: Record<string, unknown>;
};

export type CairnGraph = {
  graph_id: string;
  source: {
    chain: string;
    head_hash?: string;
    graph_complete?: boolean;
    adapter: string;
  };
  nodes: CairnGraphNode[];
  edges: CairnGraphEdge[];
  unresolved: Array<{ id: string; reason: string }>;
  created_at: string;
};

export type CairnStoneCompressedRef = {
  ref_id: string;
  stone_hash?: string;
  path: string;
  line_start: number;
  line_end: number;
  keywords?: string[];
  preview?: string;
  raw_key?: string;
  flags?: Array<{ type: string; count: number }>;
};

export type CairnStoneManifestNode = {
  hash: string;
  short_hash?: string;
  title: string;
  author?: string;
  created_at?: string;
  is_head?: boolean;
  lod5?: string;
  refs?: CairnStoneCompressedRef[];
  layers?: {
    lod2?: {
      compressed_index?: CairnStoneCompressedRef[];
    };
  };
  metadata?: Record<string, unknown>;
};

export type CairnStoneManifestEdge = {
  id: string;
  from_hash: string;
  to_hash: string;
  edge_type: string;
  note?: string;
  created_at?: string;
};

export type CairnStoneChainManifest = {
  ok: boolean;
  chain: string;
  head_hash?: string;
  head_updated_at?: string;
  stone_count?: number;
  edge_count?: number;
  graph_complete?: boolean;
  nodes?: CairnStoneManifestNode[];
  edges?: CairnStoneManifestEdge[];
};
