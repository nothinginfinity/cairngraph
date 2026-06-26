import { groundingReport } from "../../../packages/graph-engine/src/index.js";
import { createCairnStoneHttpClientFromEnv, createGraphProvider } from "../../../packages/adapters/src/index.js";
import { blastRadiusSubgraph, computeBlastRadius, type BlastRadiusOptions } from "../../../packages/blast-radius/src/index.js";
import { renderBlastRadiusHtml, renderHtmlGraph, renderMermaidFlowchart } from "../../../packages/renderer/src/index.js";
import type { CairnGraph } from "../../../packages/graph-engine/src/types.js";
import type { GraphProviderName, GraphProviderRequest } from "../../../packages/adapters/src/graph-provider.js";

const VERSION = "1.0.0-alpha.2";

type WorkerEnv = Record<string, unknown>;

type GraphRequest = GraphProviderRequest & {
  provider?: GraphProviderName;
  mermaid?: boolean;
  html?: boolean;
  report?: boolean;
};

type RenderRequest = GraphRequest & {
  graph?: CairnGraph;
  includeMetadata?: boolean;
  includeJson?: boolean;
  title?: string;
};

type BlastRadiusRequest = RenderRequest & BlastRadiusOptions;

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });

      if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
        return json({ ok: true, service: "cairngraph-worker", version: VERSION, deploy_required: false, phase: "v1.0-alpha.2", providers: providerList(env), endpoints: endpointList() });
      }

      if (request.method === "GET" && url.pathname === "/manifest") {
        return json({ schema_version: "1.0.0", name: "cairngraph-worker", title: "CairnGraph Worker", version: VERSION, phase: "v1.0-alpha.2", providers: providerList(env), endpoints: endpointList() });
      }

      if (request.method === "POST" && url.pathname === "/graph/from-manifest") return graphFromProvider({ ...(await readJson<GraphRequest>(request)), provider: "payload" }, env);

      if (request.method === "POST" && url.pathname === "/graph/from-v5") {
        const body = await readJson<GraphRequest>(request);
        return graphFromProvider({ ...body, provider: body.provider ?? "payload" }, env);
      }

      if (request.method === "POST" && url.pathname === "/graph/from-provider") return graphFromProvider(await readJson<GraphRequest>(request), env);

      if (request.method === "POST" && url.pathname === "/graph/blast-radius") {
        const body = await readJson<BlastRadiusRequest>(request);
        const graph = await graphFromRenderRequest(body, env);
        const result = computeBlastRadius(graph, blastOptions(body));
        return json({ ok: result.ok, result, graph: blastRadiusSubgraph(graph, result) }, result.ok ? 200 : 400);
      }

      if (request.method === "POST" && url.pathname === "/render/mermaid") {
        const body = await readJson<RenderRequest>(request);
        const graph = await graphFromRenderRequest(body, env);
        return json({ ok: true, format: "mermaid", mermaid: renderMermaidFlowchart(graph, { includeMetadata: body.includeMetadata ?? true, title: body.title }), report: groundingReport(graph) });
      }

      if (request.method === "POST" && url.pathname === "/render/html") {
        const body = await readJson<RenderRequest>(request);
        return htmlResponse(renderHtmlGraph(await graphFromRenderRequest(body, env), { title: body.title, includeJson: body.includeJson ?? true }));
      }

      if (request.method === "POST" && url.pathname === "/render/blast-radius/html") {
        const body = await readJson<BlastRadiusRequest>(request);
        return htmlResponse(renderBlastRadiusHtml(await graphFromRenderRequest(body, env), { ...blastOptions(body), title: body.title, includeJson: body.includeJson ?? true }));
      }

      return json({ ok: false, error: "not_found", endpoints: endpointList() }, 404);
    } catch (error) {
      return json({ ok: false, error: error instanceof Error ? error.message : "unknown error" }, 500);
    }
  }
};

async function graphFromProvider(body: GraphRequest, env: WorkerEnv): Promise<Response> {
  const result = await providerFor(body.provider ?? "payload", env).buildGraph({ chain: body.chain, manifest: body.manifest, stones: body.stones, navigation: body.navigation });
  if (!result.ok || !result.graph) return json(result, 400);
  return json({ ok: true, provider: result.provider, graph: result.graph, report: body.report === false ? undefined : groundingReport(result.graph), mermaid: body.mermaid ? renderMermaidFlowchart(result.graph, { includeMetadata: true }) : undefined, html: body.html ? renderHtmlGraph(result.graph, { includeJson: false }) : undefined, diagnostics: result.diagnostics });
}

async function graphFromRenderRequest(body: RenderRequest, env: WorkerEnv): Promise<CairnGraph> {
  if (body.graph) return body.graph;
  const result = await providerFor(body.provider ?? "payload", env).buildGraph({ chain: body.chain, manifest: body.manifest, stones: body.stones, navigation: body.navigation });
  if (!result.ok || !result.graph) throw new Error(result.error ?? "graph or manifest is required");
  return result.graph;
}

function providerFor(name: GraphProviderName, env: WorkerEnv) {
  if (name === "cairnstone-v5") return createGraphProvider(name, createCairnStoneHttpClientFromEnv(env));
  return createGraphProvider(name);
}

function blastOptions(body: BlastRadiusRequest): BlastRadiusOptions {
  return { rootNodeId: body.rootNodeId, rootStoneHash: body.rootStoneHash, rootRefId: body.rootRefId, depth: body.depth, direction: body.direction };
}

async function readJson<T>(request: Request): Promise<T> {
  try { return (await request.json()) as T; } catch { throw new Error("Invalid JSON body"); }
}

function providerList(env: WorkerEnv): Array<{ name: GraphProviderName; status: string; description: string }> {
  const liveConfigured = typeof env.CAIRNSTONE_V5_BASE_URL === "string" && env.CAIRNSTONE_V5_BASE_URL.length > 0;
  return [
    { name: "payload", status: "implemented", description: "Builds graphs from manifests and stone payloads supplied in the request body." },
    { name: "cairnstone-v5", status: liveConfigured ? "configured" : "scaffold", description: "Provider boundary for live CairnStone V5 fetching." }
  ];
}

function endpointList(): Array<{ method: string; path: string; description: string }> {
  return [
    { method: "GET", path: "/health", description: "Service health, providers, and endpoint summary." },
    { method: "GET", path: "/manifest", description: "CairnGraph Worker API manifest." },
    { method: "POST", path: "/graph/from-manifest", description: "Build a CairnGraph model from a CairnStone chain manifest." },
    { method: "POST", path: "/graph/from-v5", description: "Build a CairnGraph model from V5 payloads." },
    { method: "POST", path: "/graph/from-provider", description: "Build a graph through an explicitly selected provider." },
    { method: "POST", path: "/graph/blast-radius", description: "Compute a blast-radius subgraph." },
    { method: "POST", path: "/render/mermaid", description: "Render Mermaid." },
    { method: "POST", path: "/render/html", description: "Render browser-ready HTML." },
    { method: "POST", path: "/render/blast-radius/html", description: "Render browser-ready blast-radius HTML." }
  ];
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders() } });
}

function htmlResponse(value: string, status = 200): Response {
  return new Response(value, { status, headers: { "content-type": "text/html; charset=utf-8", ...corsHeaders() } });
}

function corsHeaders(): Record<string, string> {
  return { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type,authorization", "access-control-max-age": "86400" };
}
