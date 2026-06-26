import { groundingReport } from "../../../packages/graph-engine/src/index.js";
import { createGraphProvider } from "../../../packages/adapters/src/index.js";
import { renderMermaidFlowchart } from "../../../packages/renderer/src/index.js";
import type { CairnGraph } from "../../../packages/graph-engine/src/types.js";
import type { GraphProviderName, GraphProviderRequest } from "../../../packages/adapters/src/graph-provider.js";

const VERSION = "0.3.0";

type WorkerEnv = Record<string, unknown>;

type GraphRequest = GraphProviderRequest & {
  provider?: GraphProviderName;
  mermaid?: boolean;
  report?: boolean;
};

type MermaidRequest = GraphRequest & {
  graph?: CairnGraph;
  includeMetadata?: boolean;
  title?: string;
};

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    void env;
    const url = new URL(request.url);

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
        return json({
          ok: true,
          service: "cairngraph-worker",
          version: VERSION,
          deploy_required: false,
          phase: "2B",
          providers: providerList(),
          endpoints: endpointList()
        });
      }

      if (request.method === "GET" && url.pathname === "/manifest") {
        return json({
          schema_version: "1.0.0",
          name: "cairngraph-worker",
          title: "CairnGraph Worker",
          version: VERSION,
          phase: "2B",
          description: "HTTP API scaffold for provider-backed CairnGraph model creation, navigation expansion, reports, and Mermaid rendering.",
          providers: providerList(),
          endpoints: endpointList()
        });
      }

      if (request.method === "POST" && url.pathname === "/graph/from-manifest") {
        const body = await readJson<GraphRequest>(request);
        return graphFromProvider({ ...body, provider: "payload" });
      }

      if (request.method === "POST" && url.pathname === "/graph/from-v5") {
        const body = await readJson<GraphRequest>(request);
        return graphFromProvider({ ...body, provider: body.provider ?? "payload" });
      }

      if (request.method === "POST" && url.pathname === "/graph/from-provider") {
        const body = await readJson<GraphRequest>(request);
        return graphFromProvider(body);
      }

      if (request.method === "POST" && url.pathname === "/render/mermaid") {
        const body = await readJson<MermaidRequest>(request);
        const graph = await graphFromMermaidRequest(body);
        const mermaid = renderMermaidFlowchart(graph, { includeMetadata: body.includeMetadata ?? true, title: body.title });
        return json({ ok: true, format: "mermaid", mermaid, report: groundingReport(graph) });
      }

      return json({ ok: false, error: "not_found", endpoints: endpointList() }, 404);
    } catch (error) {
      return json({ ok: false, error: error instanceof Error ? error.message : "unknown error" }, 500);
    }
  }
};

async function graphFromProvider(body: GraphRequest): Promise<Response> {
  const provider = createGraphProvider(body.provider ?? "payload");
  const result = await provider.buildGraph({
    chain: body.chain,
    manifest: body.manifest,
    stones: body.stones,
    navigation: body.navigation
  });

  if (!result.ok || !result.graph) {
    return json(result, 400);
  }

  return json({
    ok: true,
    provider: result.provider,
    graph: result.graph,
    report: body.report === false ? undefined : groundingReport(result.graph),
    mermaid: body.mermaid ? renderMermaidFlowchart(result.graph, { includeMetadata: true }) : undefined,
    diagnostics: result.diagnostics
  });
}

async function graphFromMermaidRequest(body: MermaidRequest): Promise<CairnGraph> {
  if (body.graph) return body.graph;

  const provider = createGraphProvider(body.provider ?? "payload");
  const result = await provider.buildGraph({
    chain: body.chain,
    manifest: body.manifest,
    stones: body.stones,
    navigation: body.navigation
  });

  if (!result.ok || !result.graph) {
    throw new Error(result.error ?? "graph or manifest is required");
  }

  return result.graph;
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function providerList(): Array<{ name: GraphProviderName; status: string; description: string }> {
  return [
    { name: "payload", status: "implemented", description: "Builds graphs from manifests and stone payloads supplied in the request body." },
    { name: "cairnstone-v5", status: "scaffold", description: "Provider boundary for future live CairnStone V5 fetching." }
  ];
}

function endpointList(): Array<{ method: string; path: string; description: string }> {
  return [
    { method: "GET", path: "/health", description: "Service health, providers, and endpoint summary." },
    { method: "GET", path: "/manifest", description: "CairnGraph Worker API manifest." },
    { method: "POST", path: "/graph/from-manifest", description: "Build a CairnGraph model from a CairnStone chain manifest using the payload provider." },
    { method: "POST", path: "/graph/from-v5", description: "Build a CairnGraph model from a V5 chain manifest plus optional V5 stone payloads." },
    { method: "POST", path: "/graph/from-provider", description: "Build a graph through an explicitly selected provider." },
    { method: "POST", path: "/render/mermaid", description: "Render Mermaid from a graph, manifest, or provider payload." }
  ];
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}

function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "access-control-max-age": "86400"
  };
}
