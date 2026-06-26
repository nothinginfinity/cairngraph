import type { CairnStoneChainManifest } from "../../graph-engine/src/types.js";
import type { CairnStoneV5StonePayload } from "./cairnstone-v5.js";
import type { CairnStoneV5Client } from "./graph-provider.js";

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type CairnStoneHttpClientConfig = {
  baseUrl: string;
  apiToken?: string;
  manifestPathTemplate?: string;
  stonePathTemplate?: string;
  fetchImpl?: FetchLike;
};

export class CairnStoneHttpClient implements CairnStoneV5Client {
  private readonly baseUrl: string;
  private readonly apiToken?: string;
  private readonly manifestPathTemplate: string;
  private readonly stonePathTemplate: string;
  private readonly fetchImpl: FetchLike;

  constructor(config: CairnStoneHttpClientConfig) {
    if (!config.baseUrl) throw new Error("CairnStone HTTP client requires baseUrl");
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiToken = config.apiToken;
    this.manifestPathTemplate = config.manifestPathTemplate ?? "/chains/{chain}/manifest";
    this.stonePathTemplate = config.stonePathTemplate ?? "/stones/{hash}";
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async getChainManifest(chain: string): Promise<CairnStoneChainManifest> {
    const path = fillTemplate(this.manifestPathTemplate, { chain });
    return this.getJson<CairnStoneChainManifest>(path);
  }

  async getStone(hash: string): Promise<CairnStoneV5StonePayload> {
    const path = fillTemplate(this.stonePathTemplate, { hash });
    return this.getJson<CairnStoneV5StonePayload>(path);
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: this.headers()
    });

    if (!response.ok) {
      throw new Error(`CairnStone request failed ${response.status} ${response.statusText}`.trim());
    }

    return (await response.json()) as T;
  }

  private headers(): HeadersInit {
    const headers: Record<string, string> = { accept: "application/json" };
    if (this.apiToken) headers.authorization = `Bearer ${this.apiToken}`;
    return headers;
  }
}

export function createCairnStoneHttpClientFromEnv(env: Record<string, unknown>): CairnStoneHttpClient | undefined {
  const baseUrl = stringValue(env.CAIRNSTONE_V5_BASE_URL);
  if (!baseUrl) return undefined;

  return new CairnStoneHttpClient({
    baseUrl,
    apiToken: stringValue(env.CAIRNSTONE_V5_API_TOKEN) || undefined,
    manifestPathTemplate: stringValue(env.CAIRNSTONE_V5_MANIFEST_PATH_TEMPLATE) || undefined,
    stonePathTemplate: stringValue(env.CAIRNSTONE_V5_STONE_PATH_TEMPLATE) || undefined
  });
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => encodeURIComponent(values[key] ?? ""));
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
