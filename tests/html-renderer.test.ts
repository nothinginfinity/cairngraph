import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addGroundingNavigation, buildCairnGraphFromChainManifest } from "../packages/graph-engine/src/index.js";
import { renderHtmlGraph } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("renders browser-ready HTML graph view", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  const html = renderHtmlGraph(graph, { title: "Test CairnGraph", includeJson: true });

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Test CairnGraph/);
  assert.match(html, /Grounding report/);
  assert.match(html, /Selected evidence/);
  assert.match(html, /cairngraph-data/);
  assert.match(html, /source lines/);
  assert.doesNotMatch(html, /undefined/);
});
