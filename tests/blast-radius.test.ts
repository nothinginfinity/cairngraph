import assert from "node:assert/strict";
import test from "node:test";
import { buildCairnGraphFromChainManifest, addGroundingNavigation, computeBlastRadius } from "../packages/graph-engine/src/index.js";
import { renderBlastRadiusHtml, blastRadiusSubgraph } from "../packages/renderer/src/index.js";
import { readFileSync } from "node:fs";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")) as CairnStoneChainManifest;
const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));

test("computes radius from HEAD stone hash", () => {
  const result = computeBlastRadius(graph, { rootHash: manifest.head_hash, depth: 1 });
  assert.equal(result.ok, true);
  assert.ok(result.root_node_id);
});

test("computes radius from ref id", () => {
  const result = computeBlastRadius(graph, { rootRefId: "fsl:1adf5e14c179ebb9", depth: 1 });
  assert.equal(result.ok, true);
  assert.ok(result.impacted_node_count > 0);
});

test("returns error for missing root", () => {
  const result = computeBlastRadius(graph, { rootRefId: "fsl:missing", depth: 1 });
  assert.equal(result.ok, false);
  assert.match(result.error ?? "", /not found/);
});

test("creates blast-radius subgraph", () => {
  const result = computeBlastRadius(graph, { rootRefId: "fsl:1adf5e14c179ebb9", depth: 1 });
  const subgraph = blastRadiusSubgraph(graph, result);
  assert.match(subgraph.graph_id, /blast-radius/);
  assert.equal(subgraph.nodes.length, result.nodes.length);
});

test("renders blast-radius HTML", () => {
  const html = renderBlastRadiusHtml(graph, { rootRefId: "fsl:1adf5e14c179ebb9", depth: 1, title: "Radius Test" });
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Radius Test/);
  assert.match(html, /Blast radius:/);
  assert.match(html, /blast-summary/);
});
