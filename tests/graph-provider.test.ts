import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CairnStoneV5GraphProvider, PayloadGraphProvider } from "../packages/adapters/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("payload provider builds navigable graph from request manifest", () => {
  const provider = new PayloadGraphProvider();
  const result = provider.buildGraph({ manifest, navigation: true });

  assert.equal(result.ok, true);
  assert.equal(result.provider, "payload");
  assert.ok(result.graph);
  assert.ok(result.graph.nodes.some((node) => node.kind === "ref"));
  assert.ok(result.graph.nodes.some((node) => node.kind === "raw_source"));
});

test("payload provider rejects missing manifest", () => {
  const provider = new PayloadGraphProvider();
  const result = provider.buildGraph({ navigation: true });

  assert.equal(result.ok, false);
  assert.equal(result.provider, "payload");
  assert.match(result.error ?? "", /manifest is required/);
});

test("cairnstone v5 provider reports scaffold when client is missing", async () => {
  const provider = new CairnStoneV5GraphProvider();
  const result = await provider.buildGraph({ chain: "cairngraph" });

  assert.equal(result.ok, false);
  assert.equal(result.provider, "cairnstone-v5");
  assert.match(result.error ?? "", /not configured/);
});

test("cairnstone v5 provider can use an injected client", async () => {
  const provider = new CairnStoneV5GraphProvider({
    async getChainManifest(chain: string) {
      return { ...manifest, chain };
    }
  });

  const result = await provider.buildGraph({ chain: "loop-engineer-template-review", navigation: true });

  assert.equal(result.ok, true);
  assert.equal(result.provider, "cairnstone-v5");
  assert.equal(result.graph?.source.chain, "loop-engineer-template-review");
});
