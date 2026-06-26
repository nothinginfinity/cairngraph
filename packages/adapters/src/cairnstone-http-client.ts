import type { CairnStoneChainManifest } from "../../graph-engine/src/types.js";
import type { CairnStoneV5StonePayload } from "./cairnstone-v5.js";
import type { CairnStoneV5Client } from "./graph-provider.js";

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type CairnStoneHttpClientConfig = {
  baseUrl: string;
  apiToken?: string;
  /**
   * Optional REST path template for fetching chain manifests.
   * Tokens: {chain}
   *
   * When provided, getChainManifest() issues a REST GET to this path.
   * When omitted (default), getChainManifest() uses MCP JSON-RPC POST /mcp
   * because CairnStone V5 exposes chain manifests only via MCP.
   */
  manifestPathTemplate?: string;
  stonePathTemplate?: string;
  fetchImpl?: FetchLike;
};

const MCP_DEFAULT_PATH = "/mcp";

export class CairnStoneHttpClient implements CairnStoneV5Client {
  private readonly baseUrl: string;
  private readonly apiToken?: string;
  private readonly manifestPathTemplate: string | null;
  private readonly stonePathTemplate: string;
  private readonly fetchImpl: FetchLike;

  constructor(config: CairnStoneHttpClientConfig) {
    if (!config.baseUrl) throw new Error("CairnStone HTTP client requires baseUrl");
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiToken = config.apiToken;
    // Treat the default sentinel value as "use MCP" — only honour an
    // explicitly-supplied template as a REST override.
    this.manifestPathTemplate = config.manifestPathTemplate ?? null;
    this.stonePathTemplate = config.stonePathTemplate ?? "/v1/stones/{hash}";
    // Explicitly call globalThis.fetch so the Cloudflare Workers runtime never
    // throws "Illegal invocation" regardless of how the bundler hoists the ref.
    this.fetchImpl = config.fetchImpl ?? ((input, init) => globalThis.fetch(input, init));
  }

  async getChainManifest(chain: string): Promise<CairnStoneChainManifest> {
    // When a REST path template is explicitly configured, honour it.
    if (this.manifestPathTemplate !== null) {
      const path = fillTemplate(this.manifestPathTemplate, { chain });
      return this.getJson<CairnStoneChainManifest>(path);
    }

    // Default: CairnStone V5 exposes chain manifests only via MCP JSON-RPC.
    // There is no public REST GET /chains/{chain}/manifest route.
    const url = `${this.baseUrl}${MCP_DEFAULT_PATH}`;

    const rpcBody = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "cairnstone_get_chain_manifest",
        arguments: { chain }
      }
    });

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: "POST",
        headers: this.headers({ "content-type": "application/json" }),
        body: rpcBody
      });
    } catch (err: unknown) {
      const e = asError(err);
      throw new CairnStoneNetworkError(
        `CairnStone MCP fetch failed url=${url}: ${e.message}`,
        { stage: "fetch", url, errorName: e.name, errorMessage: e.message, stack: e.stack }
      );
    }

    if (!response.ok) {
      let body = "";
      try { body = await response.text(); } catch { /* ignore */ }
      throw new CairnStoneNetworkError(
        `CairnStone MCP request failed ${response.status} ${response.statusText}`.trim(),
        { stage: "http", url, status: response.status, statusText: response.statusText, body: body.slice(0, 400) }
      );
    }

    let rpc: unknown;
    try {
      rpc = await response.json();
    } catch (err: unknown) {
      const e = asError(err);
      throw new CairnStoneNetworkError(
        `CairnStone MCP JSON parse failed url=${url}: ${e.message}`,
        { stage: "json_parse", url, errorName: e.name, errorMessage: e.message }
      );
    }

    // Unwrap MCP envelope: { jsonrpc, id, result: { content: [{ type: "text", text: "..." }] } }
    const rpcRecord = rpc as Record<string, unknown>;
    if (rpcRecord["error"]) {
      const rpcErr = rpcRecord["error"] as Record<string, unknown>;
      throw new CairnStoneNetworkError(
        `CairnStone MCP tool error: ${String(rpcErr["message"] ?? JSON.stringify(rpcErr))}`,
        { stage: "mcp_tool_error", url, rpcError: rpcErr }
      );
    }

    const result = rpcRecord["result"] as Record<string, unknown> | undefined;
    const content = result?.["content"] as Array<Record<string, unknown>> | undefined;
    const text = content?.[0]?.["text"];

    if (typeof text !== "string") {
      throw new CairnStoneNetworkError(
        `CairnStone MCP response missing content[0].text`,
        { stage: "mcp_unwrap", url, result }
      );
    }

    let manifest: unknown;
    try {
      manifest = JSON.parse(text);
    } catch (err: unknown) {
      const e = asError(err);
      throw new CairnStoneNetworkError(
        `CairnStone MCP tool result JSON parse failed: ${e.message}`,
        { stage: "mcp_text_parse", url, text: text.slice(0, 400) }
      );
    }

    return manifest as CairnStoneChainManifest;
  }

  async getStone(hash: string): Promise<CairnStoneV5StonePayload> {
    const path = fillTemplate(this.stonePathTemplate, { hash });
    return this.getJson<CairnStoneV5StonePayload>(path);
  }

  private async getJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let response: Response;

    try {
      response = await this.fetchImpl(url, {
        method: "GET",
        headers: this.headers()
      });
    } catch (err: unknown) {
      const e = asError(err);
      throw new CairnStoneNetworkError(
        `CairnStone fetch failed url=${url}: ${e.message}`,
        { stage: "fetch", url, errorName: e.name, errorMessage: e.message, stack: e.stack }
      );
    }

    if (!response.ok) {
      let body = "";
      try { body = await response.text(); } catch { /* ignore */ }
      throw new CairnStoneNetworkError(
        `CairnStone request failed ${response.status} ${response.statusText}`.trim(),
        { stage: "http", url, status: response.status, statusText: response.statusText, body: body.slice(0, 400) }
      );
    }

    try {
      return (await response.json()) as T;
    } catch (err: unknown) {
      const e = asError(err);
      throw new CairnStoneNetworkError(
        `CairnStone JSON parse failed url=${url}: ${e.message}`,
        { stage: "json_parse", url, errorName: e.name, errorMessage: e.message }
      );
    }
  }

  private headers(extra?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = { accept: "application/json", ...(extra ?? {}) };
    if (this.apiToken) headers["authorization"] = `Bearer ${this.apiToken}`;
    return headers;
  }
}

/** Structured error carrying diagnostic metadata for the debug endpoint. */
export class CairnStoneNetworkError extends Error {
  readonly diagnostics: Record<string, unknown>;
  constructor(message: string, diagnostics: Record<string, unknown>) {
    super(message);
    this.name = "CairnStoneNetworkError";
    this.diagnostics = diagnostics;
  }
}

export function createCairnStoneHttpClientFromEnv(env: Record<string, unknown>): CairnStoneHttpClient | undefined {
  const baseUrl = stringValue(env["CAIRNSTONE_V5_BASE_URL"]);
  if (!baseUrl) return undefined;

  return new CairnStoneHttpClient({
    baseUrl,
    apiToken: stringValue(env["CAIRNSTONE_V5_API_TOKEN"]) || undefined,
    manifestPathTemplate: stringValue(env["CAIRNSTONE_V5_MANIFEST_PATH_TEMPLATE"]) || undefined,
    stonePathTemplate: stringValue(env["CAIRNSTONE_V5_STONE_PATH_TEMPLATE"]) || undefined
  });
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => encodeURIComponent(values[key] ?? ""));
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asError(value: unknown): { name: string; message: string; stack?: string } {
  if (value instanceof Error) return value;
  return { name: "UnknownError", message: String(value) };
}
