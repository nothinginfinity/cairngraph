import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import worker from "../workers/cairngraph-worker/src/index.js";

const manifest = JSON.parse(readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8"));

test("worker health endpoint exposes Phase 2D endpoints", async () => {
  const response = await worker.fetch(new Request("https://cairngraph.test/health"), {});
  assert.equal(response.status, 200);
  const body = await response.json() as { ok: boolean; phase: string; endpoints: Array<{ path: string }> };
  assert.equal(body.ok, true);
  assert.equal(body.phase, "2D");
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/graph/blast-radius"));
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/render/blast-radius/html"));
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
  assert.match(html, /Blast radius status/);
});

test("worker still rejects unconfigured live provider", async () => {
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
