import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import worker from "../workers/cairngraph-worker/src/index.js";

const manifest = JSON.parse(readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8"));

test("worker health exposes v1 alpha provider states and live chain endpoints", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/health"), {});
  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; phase: string; providers: Array<{ name: string; status: string }>; endpoints: Array<{ path: string }> };
  assert.equal(body.ok, true);
  assert.equal(body.phase, "v1.0-alpha.3");
  assert.ok(body.providers.some((provider) => provider.name === "payload" && provider.status === "implemented"));
  assert.ok(body.providers.some((provider) => provider.name === "cairnstone-v5" && provider.status === "scaffold"));
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/graph/chain/:chain"));
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/graph/chain/:chain/html"));
});

test("worker health reports configured live provider when base url is present", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/health"), { CAIRNSTONE_V5_BASE_URL: "https://cairnstone.example.test" });
  assert.equal(response.status, 200);
  const body = await response.json() as { providers: Array<{ name: string; status: string }> };
  assert.ok(body.providers.some((provider) => provider.name === "cairnstone-v5" && provider.status === "configured"));
});

test("live chain JSON endpoint rejects safely when provider is not configured", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/chain/cairngraph"), {});
  assert.equal(response.status, 400);
  const body = await response.json() as { ok: boolean; provider: string; error: string };
  assert.equal(body.ok, false);
  assert.equal(body.provider, "cairnstone-v5");
  assert.match(body.error, /not configured/);
});

test("live chain HTML endpoint rejects safely when provider is not configured", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/chain/cairngraph/html"), {});
  assert.equal(response.status, 400);
  const body = await response.json() as { ok: boolean; provider: string; error: string };
  assert.equal(body.ok, false);
  assert.equal(body.provider, "cairnstone-v5");
  assert.match(body.error, /not configured/);
});

test("worker builds graph from manifest", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/from-manifest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ manifest, navigation: true, mermaid: true, html: true })
  }), {});
  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; provider: string; graph: { nodes: unknown[] }; mermaid?: string; html?: string; report?: { complete: boolean } };
  assert.equal(body.ok, true);
  assert.equal(body.provider, "payload");
  assert.ok(body.graph.nodes.length > 0);
  assert.match(body.mermaid ?? "", /^flowchart TD/);
  assert.match(body.html ?? "", /^<!doctype html>/);
  assert.equal(body.report?.complete, true);
});

test("worker computes blast radius from manifest", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/blast-radius", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ manifest, navigation: true, rootRefId: "fsl:1adf5e14c179ebb9", depth: 1 })
  }), {});
  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; result: { impacted_node_count: number } };
  assert.equal(body.ok, true);
  assert.ok(body.result.impacted_node_count > 0);
});

test("worker renders blast radius HTML", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/render/blast-radius/html", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ manifest, navigation: true, rootRefId: "fsl:1adf5e14c179ebb9", depth: 1, title: "Worker Radius" })
  }), {});
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  const html = await response.text();
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Worker Radius/);
  assert.match(html, /Blast radius:/);
  assert.match(html, /blast-summary/);
});

test("worker still rejects unconfigured live provider through POST provider route", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/from-provider", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ provider: "cairnstone-v5", chain: "cairngraph" })
  }), {});
  assert.equal(response.status, 400);
  const body = await response.json() as { ok: boolean; provider: string; error: string };
  assert.equal(body.ok, false);
  assert.equal(body.provider, "cairnstone-v5");
  assert.match(body.error, /not configured/);
});
