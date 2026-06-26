import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import worker from "../workers/cairngraph-worker/src/index.js";

const manifest = JSON.parse(readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8"));

test("worker health endpoint exposes Phase 2A endpoints", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/health"), {});
  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; endpoints: Array<{ path: string }> };
  assert.equal(body.ok, true);
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/graph/from-manifest"));
});

test("worker builds graph from manifest", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/graph/from-manifest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ manifest, navigation: true, mermaid: true })
  }), {});

  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; graph: { nodes: unknown[] }; mermaid?: string; report?: { complete: boolean } };
  assert.equal(body.ok, true);
  assert.ok(body.graph.nodes.length > 0);
  assert.match(body.mermaid ?? "", /^flowchart TD/);
  assert.equal(body.report?.complete, true);
});

test("worker renders Mermaid from manifest", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/render/mermaid", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ manifest, navigation: true })
  }), {});

  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; mermaid: string };
  assert.equal(body.ok, true);
  assert.match(body.mermaid, /source lines/);
});
