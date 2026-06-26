import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addGroundingNavigation, buildCairnGraphFromChainManifest } from "../packages/graph-engine/src/index.js";
import { renderHtmlGraph } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("renders browser-ready interactive HTML graph view", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  const html = renderHtmlGraph(graph, { title: "Test CairnGraph", includeJson: true });

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Test CairnGraph/);
  assert.match(html, /Grounding report/);
  assert.match(html, /Selected evidence/);
  assert.match(html, /Interactive controls/);
  assert.match(html, /Graph explorer/);
  assert.match(html, /graph-canvas/);
  assert.match(html, /edge-filter/);
  assert.match(html, /neighborhood-filter/);
  assert.match(html, /Interactive CairnGraph topology/);
  assert.match(html, /node-search/);
  assert.match(html, /kind-filter/);
  assert.match(html, /grounding-filter/);
  assert.match(html, /visible-count/);
  assert.match(html, /cairngraph-data/);
  assert.match(html, /source lines/);
  assert.match(html, /data-jump/);
  // v1.1-alpha.2: Zoom and pan controls
  assert.match(html, /zoom-in/);
  assert.match(html, /zoom-out/);
  assert.match(html, /reset-view/);
  assert.match(html, /data-graph-viewport/);
  assert.match(html, /Drag the background to pan/);
  assert.doesNotMatch(html, /undefined/);
});
