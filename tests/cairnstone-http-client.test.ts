import assert from "node:assert/strict";
import test from "node:test";
import { CairnStoneHttpClient } from "../packages/adapters/src/index.js";

test("CairnStone HTTP client fetches chain manifest with configurable template", async () => {
  const calls: Array<{ input: string; authorization?: string }> = [];
  const client = new CairnStoneHttpClient({
    baseUrl: "https://cairnstone.example.test/",
    apiToken: "test-token",
    manifestPathTemplate: "/v5/chain/{chain}/manifest",
    fetchImpl: async (input, init) => {
      const headers = new Headers(init?.headers);
      calls.push({ input, authorization: headers.get("authorization") ?? undefined });
      return Response.json({ ok: true, chain: "cairngraph", nodes: [], edges: [] });
    }
  });

  const manifest = await client.getChainManifest("cairngraph");

  assert.equal(manifest.ok, true);
  assert.equal(manifest.chain, "cairngraph");
  assert.equal(calls[0]?.input, "https://cairnstone.example.test/v5/chain/cairngraph/manifest");
  assert.equal(calls[0]?.authorization, "Bearer test-token");
});

test("CairnStone HTTP client fetches stone payload with configurable template", async () => {
  const client = new CairnStoneHttpClient({
    baseUrl: "https://cairnstone.example.test",
    stonePathTemplate: "/v5/stone/{hash}",
    fetchImpl: async (input) => {
      assert.equal(input, "https://cairnstone.example.test/v5/stone/abc123");
      return Response.json({ ok: true, stone: { border: { hash: "abc123" } } });
    }
  });

  const stone = await client.getStone("abc123");

  assert.equal(stone.ok, true);
  assert.equal(stone.stone?.border?.hash, "abc123");
});

test("CairnStone HTTP client surfaces HTTP failures", async () => {
  const client = new CairnStoneHttpClient({
    baseUrl: "https://cairnstone.example.test",
    fetchImpl: async () => new Response("missing", { status: 404, statusText: "Not Found" })
  });

  await assert.rejects(() => client.getChainManifest("missing"), /404/);
});
