import { buildCairnGraphFromChainManifest } from "../../graph-engine/src/from-chain-manifest.js";
import type {
  CairnGraph,
  CairnStoneChainManifest,
  CairnStoneCompressedRef,
  CairnStoneManifestNode
} from "../../graph-engine/src/types.js";

export type CairnStoneV5StonePayload = {
  ok?: boolean;
  stone?: {
    border?: {
      hash?: string;
      title?: string;
      author?: string;
      created?: string;
      repo?: string | null;
      commit?: string | null;
      path?: string;
      chain?: string;
    };
    layers?: {
      lod5?: string;
      lod4?: string;
      lod2?: {
        compressed_index?: CairnStoneCompressedRef[];
      };
    };
    metadata?: Record<string, unknown>;
    related?: string[];
  };
};

export type BuildGraphFromV5Input = {
  manifest: CairnStoneChainManifest;
  stones?: CairnStoneV5StonePayload[];
};

export function buildCairnGraphFromV5(input: BuildGraphFromV5Input): CairnGraph {
  const manifest = mergeV5StonePayloadsIntoManifest(input.manifest, input.stones ?? []);
  return buildCairnGraphFromChainManifest(manifest);
}

export function mergeV5StonePayloadsIntoManifest(
  manifest: CairnStoneChainManifest,
  stones: CairnStoneV5StonePayload[]
): CairnStoneChainManifest {
  const stonePayloadsByHash = new Map<string, CairnStoneV5StonePayload>();

  for (const payload of stones) {
    const hash = payload.stone?.border?.hash;
    if (hash) stonePayloadsByHash.set(hash, payload);
  }

  const mergedNodes = (manifest.nodes ?? []).map((node) => {
    const payload = stonePayloadsByHash.get(node.hash);
    return payload ? mergeNodeWithV5Payload(node, payload) : node;
  });

  for (const [hash, payload] of stonePayloadsByHash) {
    if (mergedNodes.some((node) => node.hash === hash)) continue;
    const node = nodeFromV5Payload(payload, manifest.chain, manifest.head_hash);
    if (node) mergedNodes.push(node);
  }

  return {
    ...manifest,
    nodes: mergedNodes,
    stone_count: manifest.stone_count ?? mergedNodes.length
  };
}

function mergeNodeWithV5Payload(
  node: CairnStoneManifestNode,
  payload: CairnStoneV5StonePayload
): CairnStoneManifestNode {
  const fromPayload = nodeFromV5Payload(payload, node.metadata?.chain as string | undefined, undefined);
  if (!fromPayload) return node;

  return {
    ...node,
    title: node.title || fromPayload.title,
    author: node.author || fromPayload.author,
    created_at: node.created_at || fromPayload.created_at,
    lod5: fromPayload.lod5 || node.lod5,
    refs: fromPayload.refs ?? node.refs,
    layers: fromPayload.layers ?? node.layers,
    metadata: {
      ...(node.metadata ?? {}),
      ...(fromPayload.metadata ?? {})
    }
  };
}

function nodeFromV5Payload(
  payload: CairnStoneV5StonePayload,
  fallbackChain?: string,
  headHash?: string
): CairnStoneManifestNode | undefined {
  const border = payload.stone?.border;
  const hash = border?.hash;
  if (!hash) return undefined;

  const metadata = normalizeV5Metadata(payload);

  return {
    hash,
    short_hash: hash.slice(0, 12),
    title: border?.title || `stone ${hash.slice(0, 12)}`,
    author: border?.author,
    created_at: border?.created,
    is_head: headHash ? hash === headHash : undefined,
    lod5: payload.stone?.layers?.lod5,
    refs: payload.stone?.layers?.lod2?.compressed_index ?? [],
    layers: payload.stone?.layers,
    metadata: {
      ...metadata,
      chain: border?.chain || fallbackChain,
      repo: border?.repo ?? metadata.repo,
      commit: border?.commit ?? metadata.commit,
      path: border?.path ?? metadata.path,
      related: payload.stone?.related ?? []
    }
  };
}

function normalizeV5Metadata(payload: CairnStoneV5StonePayload): Record<string, unknown> {
  const metadata = payload.stone?.metadata ?? {};
  const border = payload.stone?.border;
  const github = asRecord(metadata.github);

  if (Object.keys(github).length > 0) {
    return metadata;
  }

  const repoName = typeof border?.repo === "string" ? border.repo : "";
  const [owner, repo] = repoName.includes("/") ? repoName.split("/", 2) : [undefined, repoName || undefined];
  const path = border?.path;
  const ref = border?.commit || undefined;

  if (!owner || !repo || !path || !ref) {
    return metadata;
  }

  return {
    ...metadata,
    github: {
      owner,
      repo,
      path,
      ref
    }
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
