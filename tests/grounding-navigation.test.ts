import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  addGroundingNavigation,
  buildCairnGraphFromChainManifest,
  groundingReport,
  navigationTargetsForNode
} from "../packages/graph-engine/src/index.js";
import { renderMermaidFlowchart } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const fixture = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("adds raw source and file navigation nodes for grounded refs", () => {
  const baseGraph = buildCairnGraphFromChainManifest(fixture);
  const graph = addGroundingNavigation(baseGraph);

  const rawNodes = graph.nodes.filter((node) => node.kind === "raw_source");
  const fileNodes = graph.nodes.filter((node) => node.kind === "file");
  const expandsToEdges = graph.edges.filter((edge) => edge.edge_type === "expands_to");

  assert.equal(rawNodes.length, 1);
  assert.equal(fileNodes.length, 3);
  assert.equal(expandsToEdges.length, 6);

  const firstRef = graph.nodes.find((node) => node.kind === "ref" && node.evidence.ref_id === "fsl:1adf5e14c179ebb9");
  assert.ok(firstRef);

  const targets = navigationTargetsForNode(graph, firstRef.id);
  assert.equal(targets.length, 2);
  assert.ok(targets.some((node) => node.kind === "raw_source"));
  assert.ok(targets.some((node) => node.kind === "file"));
});

test("reports grounding completeness for navigable graph", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(fixture));
  const report = groundingReport(graph);

  assert.equal(report.chain, "loop-engineer-template-review");
  assert.equal(report.complete, true);
  assert.equal(report.unresolved_count, 0);
  assert.equal(report.nodes_by_kind.ref, 3);
  assert.equal(report.nodes_by_kind.raw_source, 1);
  assert.equal(report.nodes_by_kind.file, 3);
});

test("renders navigation nodes in Mermaid output", () => {
  const graph = addGroundingNavigation(buildCairnGraphFromChainManifest(fixture));
  const mermaid = renderMermaidFlowchart(graph, { includeMetadata: true });

  assert.match(mermaid, /raw key/);
  assert.match(mermaid, /source lines/);
  assert.match(mermaid, /content.txt/);
  assert.doesNotMatch(mermaid, /undefined/);
});
