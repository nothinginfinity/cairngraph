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
  // v1.1-alpha.3: Blast-radius visual overlay (should not appear in normal render)
  assert.match(html, /data-blast-overlay="disabled"/);
  assert.doesNotMatch(html, /data-blast-affected="true"/);
  assert.doesNotMatch(html, /blast-toggle/);
  assert.doesNotMatch(html, /undefined/);
});

test("renders HTML with optional blast-radius metadata", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  const firstNodeId = graph.nodes[0]?.id;
  
  if (!firstNodeId) {
    return; // Skip if no nodes
  }

  const blastMetadata = {
    ok: true,
    root_node_id: firstNodeId,
    depth: 2,
    direction: "both",
    impacted_node_count: 3,
    impacted_edge_count: 2,
    risk_score: 8
  };

  const html = renderHtmlGraph(graph, { 
    title: "Test Blast Radius",
    blastMetadata 
  });

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Test Blast Radius/);
  // v1.1-alpha.3: Blast overlay markers when metadata is present
  assert.match(html, /data-blast-overlay="enabled"/);
  assert.match(html, /blast-summary/);
  assert.match(html, /Blast radius/);
  assert.match(html, /blast-toggle/);
  assert.match(html, /dim-toggle/);
  assert.match(html, /data-blast-affected="true"/);
  assert.match(html, /data-blast-affected="false"/);
  // Preserve existing UX
  assert.match(html, /graph-canvas/);
  assert.match(html, /zoom-in/);
  assert.match(html, /reset-view/);
  assert.match(html, /node-search/);
  assert.match(html, /edge-filter/);
  assert.doesNotMatch(html, /undefined/);
});
