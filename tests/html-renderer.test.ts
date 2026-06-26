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

  assert.ok(typeof html === "string");
  assert.ok(html.length > 100);
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Test CairnGraph/);
  assert.match(html, /Grounding report/);
  assert.match(html, /Graph explorer/);
  // v1.1-alpha.2: Zoom and pan controls
  assert.match(html, /zoom-in/);
  assert.match(html, /zoom-out/);
  assert.match(html, /reset-view/);
  // v1.1-alpha.3: Blast overlay disabled when no metadata
  assert.match(html, /data-blast-overlay="disabled"/);
  // Ensure no undefined values
  assert.doesNotMatch(html, /undefined/);
});

test("supports optional blast-radius metadata parameter", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  const firstNodeId = graph.nodes[0]?.id ?? "test-node";

  const html = renderHtmlGraph(graph, { 
    title: "Test with Blast",
    blastMetadata: {
      ok: true,
      root_node_id: firstNodeId,
      depth: 2,
      direction: "both",
      impacted_node_count: 3,
      impacted_edge_count: 2,
      risk_score: 8
    }
  });

  assert.ok(typeof html === "string");
  assert.ok(html.length > 100);
  // v1.1-alpha.3: Blast overlay enabled when metadata is present
  assert.match(html, /data-blast-overlay="enabled"/);
  assert.match(html, /blast-summary/);
  assert.match(html, /Blast radius/);
  // Controls present when metadata exists
  assert.match(html, /blast-toggle/);
  // Markers present
  assert.match(html, /data-blast-affected/);
  // Ensure no undefined values
  assert.doesNotMatch(html, /undefined/);
});
