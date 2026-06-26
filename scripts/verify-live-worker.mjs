import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const baseUrl = normalizeBaseUrl(process.env.CAIRNGRAPH_WORKER_URL ?? "https://cairngraph-worker.jaredtechfit.workers.dev");
const manifestPath = process.env.CAIRNGRAPH_FIXTURE ?? "examples/loop-engineer-template-review.manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const checks = [];

await checkHealth();
await checkManifest();
await checkRenderHtml();
await checkBlastRadiusJson();
await checkBlastRadiusHtml();

console.log(JSON.stringify({ ok: true, baseUrl, checks }, null, 2));

async function checkHealth() {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "cairngraph-worker");
  checks.push({ endpoint: "GET /health", ok: true, phase: body.phase });
}

async function checkManifest() {
  const response = await fetch(`${baseUrl}/manifest`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.name, "cairngraph-worker");
  assert.ok(Array.isArray(body.endpoints));
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/render/html"));
  assert.ok(body.endpoints.some((endpoint) => endpoint.path === "/graph/blast-radius"));
  checks.push({ endpoint: "GET /manifest", ok: true, endpoints: body.endpoints.length });
}

async function checkRenderHtml() {
  const response = await postJson("/render/html", {
    manifest,
    navigation: true,
    title: "Phase 3A Live HTML Verification",
    includeJson: false
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  const html = await response.text();
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Phase 3A Live HTML Verification/);
  assert.match(html, /Selected evidence/);
  assert.match(html, /loop-engineer-template-review/);
  checks.push({ endpoint: "POST /render/html", ok: true, bytes: html.length });
}

async function checkBlastRadiusJson() {
  const response = await postJson("/graph/blast-radius", {
    manifest,
    navigation: true,
    rootRefId: "fsl:1adf5e14c179ebb9",
    depth: 1,
    direction: "outgoing"
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.result.ok, true);
  assert.ok(body.result.impacted_node_count > 0);
  assert.ok(body.result.impacted_edge_count > 0);
  checks.push({ endpoint: "POST /graph/blast-radius", ok: true, impacted_node_count: body.result.impacted_node_count });
}

async function checkBlastRadiusHtml() {
  const response = await postJson("/render/blast-radius/html", {
    manifest,
    navigation: true,
    rootRefId: "fsl:1adf5e14c179ebb9",
    depth: 1,
    direction: "outgoing",
    title: "Phase 3A Live Blast Radius Verification",
    includeJson: false
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  const html = await response.text();
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Phase 3A Live Blast Radius Verification/);
  assert.match(html, /Blast radius status/);
  assert.match(html, /risk score/);
  checks.push({ endpoint: "POST /render/blast-radius/html", ok: true, bytes: html.length });
}

async function postJson(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}
