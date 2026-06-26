import assert from "node:assert/strict";

const baseUrl = normalizeBaseUrl(process.env.CAIRNGRAPH_WORKER_URL ?? "https://cairngraph-worker.jaredtechfit.workers.dev");
const requireConfiguredProvider = process.env.CAIRNGRAPH_REQUIRE_LIVE_PROVIDER === "true";

const response = await fetch(`${baseUrl}/health`);
assert.equal(response.status, 200);
const body = await response.json();
assert.equal(body.ok, true);
assert.ok(Array.isArray(body.providers));

const provider = body.providers.find((item) => item.name === "cairnstone-v5");
assert.ok(provider, "cairnstone-v5 provider entry is missing from /health");

if (requireConfiguredProvider) {
  assert.equal(provider.status, "configured");
} else {
  assert.ok(["scaffold", "configured"].includes(provider.status));
}

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  provider: "cairnstone-v5",
  status: provider.status,
  strict: requireConfiguredProvider
}, null, 2));

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}
