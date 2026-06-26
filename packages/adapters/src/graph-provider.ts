import { buildCairnGraphFromChainManifest } from "../../graph-engine/src/from-chain-manifest.js";
import { addGroundingNavigation } from "../../graph-engine/src/navigation.js";
import { buildCairnGraphFromV5 } from "./cairnstone-v5.js";
import type { CairnGraph, CairnStoneChainManifest } from "../../graph-engine/src/types.js";
import type { CairnStoneV5StonePayload } from "./cairnstone-v5.js";

export type GraphProviderName = "payload" | "cairnstone-v5";

export type GraphProviderRequest = {
  chain?: string;
  manifest?: CairnStoneChainManifest;
  stones?: CairnStoneV5StonePayload[];
  navigation?: boolean;
};

export type GraphProviderResult = {
  ok: boolean;
  provider: GraphProviderName;
  graph?: CairnGraph;
  error?: string;
  diagnostics?: Record<string, unknown>;
};

export interface GraphProvider {
  name: GraphProviderName;
  buildGraph(request: GraphProviderRequest): Promise<GraphProviderResult> | GraphProviderResult;
}

export class PayloadGraphProvider implements GraphProvider {
  readonly name = "payload" as const;

  buildGraph(request: GraphProviderRequest): GraphProviderResult {
    if (!request.manifest) {
      return {
        ok: false,
        provider: this.name,
        error: "manifest is required for payload graph provider"
      };
    }

    const baseGraph = request.stones?.length
      ? buildCairnGraphFromV5({ manifest: request.manifest, stones: request.stones })
      : buildCairnGraphFromChainManifest(request.manifest);

    return {
      ok: true,
      provider: this.name,
      graph: request.navigation === false ? baseGraph : addGroundingNavigation(baseGraph),
      diagnostics: {
        manifest_chain: request.manifest.chain,
        stone_payloads: request.stones?.length ?? 0,
        navigation: request.navigation !== false
      }
    };
  }
}

export type CairnStoneV5Client = {
  getChainManifest(chain: string): Promise<CairnStoneChainManifest>;
  getStone?(hash: string): Promise<CairnStoneV5StonePayload>;
};

export class CairnStoneV5GraphProvider implements GraphProvider {
  readonly name = "cairnstone-v5" as const;

  constructor(private readonly client?: CairnStoneV5Client) {}

  async buildGraph(request: GraphProviderRequest): Promise<GraphProviderResult> {
    if (!this.client) {
      return {
        ok: false,
        provider: this.name,
        error: "CairnStone V5 client is not configured",
        diagnostics: {
          required: ["getChainManifest"],
          optional: ["getStone"],
          mode: "scaffold"
        }
      };
    }

    if (!request.chain && !request.manifest?.chain) {
      return {
        ok: false,
        provider: this.name,
        error: "chain is required for CairnStone V5 graph provider"
      };
    }

    const chain = request.chain ?? request.manifest?.chain ?? "";
    const manifest = request.manifest ?? await this.client.getChainManifest(chain);
    const stones = request.stones ?? [];
    const baseGraph = buildCairnGraphFromV5({ manifest, stones });

    return {
      ok: true,
      provider: this.name,
      graph: request.navigation === false ? baseGraph : addGroundingNavigation(baseGraph),
      diagnostics: {
        chain,
        manifest_source: request.manifest ? "request" : "client",
        stone_payloads: stones.length,
        navigation: request.navigation !== false
      }
    };
  }
}

export function createGraphProvider(name: GraphProviderName, client?: CairnStoneV5Client): GraphProvider {
  if (name === "payload") return new PayloadGraphProvider();
  if (name === "cairnstone-v5") return new CairnStoneV5GraphProvider(client);
  return new PayloadGraphProvider();
}
