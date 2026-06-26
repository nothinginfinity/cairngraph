import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeBlastRadius, blastRadiusSubgraph } from "../packages/blast-radius/src/index.js";
import { addGroundingNavigation, buildCairnGraphFromChainManifest } from "../packages/graph-engine/src/index.js";
import { renderBlastRadiusHtml } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")) as CairnStoneChainManifest;
const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));

test("computes radius from HEAD stone hash", () => {
  const result = computeBlastRadius(graph, { rootStoneHash: manifest.head_hash, depth: 2, direction: "both" });
  assert.equal(result.ok, true);
  assert.ok(result.nodes.length > 1);
  assert.ok(result.edges.length > 0);
});

test("computes radius from ref id", () => {
  const result = computeBlastRadius(graph, { rootRefId: "fsl:1adf5e14c179ebb9", depth: 1, direction: "outgoing" });
  assert.equal(result.ok, true);
  assert.ok(result.nodes.some((node) => node.kind === "raw_source"));
  assert.ok(result.nodes.some((node) => node.kind === "file"));
});

test("returns error for missing root", () => {
  const result = computeBlastRadius(graph, { rootRefId: "missing", depth: 1 });
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
