import { buildCairnGraphFromChainManifest, addGroundingNavigation, groundingReport } from "../../../packages/graph-engine/src/index.js";
import { buildCairnGraphFromV5 } from "../../../packages/adapters/src/index.js";
import { renderMermaidFlowchart } from "../../../packages/renderer/src/index.js";
import type { CairnGraph } from "../../../packages/graph-engine/src/types.js";
import type { BuildGraphFromV5Input } from "../../../packages/adapters/src/cairnstone-v5.js";

const VERSION = "0.2.0";

type WorkerEnv = Record<string, unknown>;

type GraphRequest = {
  manifest?: unknown;
  stones?: unknown[];
  navigation?: boolean;
  mermaid?: boolean;
  report?: boolean;
};

type MermaidRequest = {
  graph?: CairnGraph;
  manifest?: unknown;
  stones?: unknown[];
  navigation?: boolean;
  includeMetadata?: boolean;
  title?: string;
};

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    void env;
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return json({
        ok: true,
        service: "cairngraph-worker",
        version: VERSION,
        deploy_required: false,
        phase: "2A",
        endpoints: endpointList()
      });
    }

    if (request.method === "GET" && url.pathname === "/manifest") {
      return json({
        schema_version: "1.0.0",
        name: "cairngraph-worker",
        title: "CairnGraph Worker",
        version: VERSION,
        phase: "2A",
        description: "HTTP API scaffold for grounded CairnGraph model creation, navigation expansion, reports, and Mermaid rendering.",
        endpoints: endpointList()
      });
    }

    if (request.method === "POST" && url.pathname === "/graph/from-manifest") {
      const body = await readJson<GraphRequest>(request);
      if (!body.manifest) return json({ ok: false, error: "manifest is required" }, 400);
      const graph = maybeAddNavigation(buildCairnGraphFromChainManifest(body.manifest as never), body.navigation ?? true);
      return json(graphResponse(graph, body));
    }

    if (request.method === "POST" && url.pathname === "/graph/from-v5") {
      const body = await readJson<GraphRequest>(request);
      if (!body.manifest) return json({ ok: false, error: "manifest is required" }, 400);
      const graph = maybeAddNavigation(buildCairnGraphFromV5({ manifest: body.manifest as never, stones: body.stones as BuildGraphFromV5Input["stones"] }), body.navigation ?? true);
      return json(graphResponse(graph, body));
    }

    if (request.method === "POST" && url.pathname === "/render/mermaid") {
      const body = await readJson<MermaidRequest>(request);
      const graph = graphFromMermaidRequest(body);
      const mermaid = renderMermaidFlowchart(graph, { includeMetadata: body.includeMetadata ?? true, title: body.title });
      return json({ ok: true, format: "mermaid", mermaid, report: groundingReport(graph) });
    }

    return json({ ok: false, error: "not_found", endpoints: endpointList() }, 404);
  }
};

function graphFromMermaidRequest(body: MermaidRequest): CairnGraph {
  if (body.graph) return maybeAddNavigation(body.graph, body.navigation ?? false);
  if (body.manifest) {
    if (body.stones) return maybeAddNavigation(buildCairnGraphFromV5({ manifest: body.manifest as never, stones: body.stones as BuildGraphFromV5Input["stones"] }), body.navigation ?? true);
    return maybeAddNavigation(buildCairnGraphFromChainManifest(body.manifest as never), body.navigation ?? true);
  }
  throw new Error("graph or manifest is required");
}

function graphResponse(graph: CairnGraph, request: GraphRequest): Record<string, unknown> {
  return {
    ok: true,
    graph,
    report: request.report === false ? undefined : groundingReport(graph),
    mermaid: request.mermaid ? renderMermaidFlowchart(graph, { includeMetadata: true }) : undefined
  };
}

function maybeAddNavigation(graph: CairnGraph, enabled: boolean): CairnGraph {
  return enabled ? addGroundingNavigation(graph) : graph;
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function endpointList(): Array<{ method: string; path: string; description: string }> {
  return [
    { method: "GET", path: "/health", description: "Service health and endpoint summary." },
    { method: "GET", path: "/manifest", description: "CairnGraph Worker API manifest." },
    { method: "POST", path: "/graph/from-manifest", description: "Build a CairnGraph model from a CairnStone chain manifest." },
    { method: "POST", path: "/graph/from-v5", description: "Build a CairnGraph model from a V5 chain manifest plus optional V5 stone payloads." },
    { method: "POST", path: "/render/mermaid", description: "Render Mermaid from a graph, manifest, or V5 payload." }
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
