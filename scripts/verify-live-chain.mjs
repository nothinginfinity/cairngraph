import assert from "node:assert/strict";

const baseUrl = normalizeBaseUrl(process.env.CAIRNGRAPH_WORKER_URL ?? "https://cairngraph-worker.jaredtechfit.workers.dev");
const chain = process.env.CAIRNGRAPH_CHAIN ?? "cairngraph";
const requireConfiguredProvider = process.env.CAIRNGRAPH_REQUIRE_LIVE_PROVIDER === "true";

const checks = [];

await checkHealth();
await checkLiveChainJson();
await checkLiveChainHtml();

console.log(JSON.stringify({ ok: true, baseUrl, chain, checks }, null, 2));

async function checkHealth() {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  const liveProvider = body.providers?.find((provider) => provider.name === "cairnstone-v5");
  assert.ok(liveProvider);
  if (requireConfiguredProvider) assert.equal(liveProvider.status, "configured");
  checks.push({ endpoint: "GET /health", ok: true, provider_status: liveProvider.status });
}

async function checkLiveChainJson() {
  const response = await fetch(`${baseUrl}/graph/chain/${encodeURIComponent(chain)}`);
  if (response.status === 400 && !requireConfiguredProvider) {
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.equal(body.provider, "cairnstone-v5");
    assert.match(body.error, /not configured|configured/i);
    checks.push({ endpoint: "GET /graph/chain/:chain", ok: true, mode: "safe_unconfigured_rejection" });
    return;
  }
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.provider, "cairnstone-v5");
  assert.equal(body.chain, chain);
  assert.ok(body.graph?.nodes?.length > 0);
  checks.push({ endpoint: "GET /graph/chain/:chain", ok: true, nodes: body.graph.nodes.length });
}

async function checkLiveChainHtml() {
  const response = await fetch(`${baseUrl}/graph/chain/${encodeURIComponent(chain)}/html`);
  if (response.status === 400 && !requireConfiguredProvider) {
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.equal(body.provider, "cairnstone-v5");
    assert.match(body.error, /not configured|configured/i);
    checks.push({ endpoint: "GET /graph/chain/:chain/html", ok: true, mode: "safe_unconfigured_rejection" });
    return;
  }
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  const html = await response.text();
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Interactive controls/);
  assert.match(html, /node-search/);
  assert.match(html, /kind-filter/);
  assert.match(html, /grounding-filter/);
  checks.push({ endpoint: "GET /graph/chain/:chain/html", ok: true, bytes: html.length });
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}
