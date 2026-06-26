import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addGroundingNavigation, buildCairnGraphFromChainManifest } from "../packages/graph-engine/src/index.js";
import { renderHtmlGraph } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const manifest = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("renders HTML without blast metadata", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  const html = renderHtmlGraph(graph);

  assert.ok(typeof html === "string");
  assert.ok(html.length > 500);
  assert.ok(html.includes("<!doctype html>"));
  assert.ok(!html.includes("undefined"));
});

test("renders HTML with blast metadata", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(manifest));
  
  const html = renderHtmlGraph(graph, {
    blastMetadata: {
      ok: true,
      root_node_id: graph.nodes[0]?.id,
      depth: 2,
      direction: "both",
      impacted_node_count: 3,
      impacted_edge_count: 2,
      risk_score: 8
    }
  });

  assert.ok(typeof html === "string");
  assert.ok(html.length > 500);
  assert.ok(html.includes("<!doctype html>"));
  assert.ok(!html.includes("undefined"));
});
