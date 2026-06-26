import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildCairnGraphFromChainManifest } from "../packages/graph-engine/src/index.js";
import { renderMermaidFlowchart } from "../packages/renderer/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";

const fixture = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

test("builds a grounded CairnGraph model from a CairnStone chain manifest", () => {
  const graph = buildCairnGraphFromChainManifest(fixture);

  assert.equal(graph.source.chain, "loop-engineer-template-review");
  assert.equal(graph.source.head_hash, fixture.head_hash);
  assert.equal(graph.unresolved.length, 0);

  const head = graph.nodes.find((node) => node.kind === "head");
  assert.ok(head);
  assert.equal(head.evidence.stone_hash, fixture.head_hash);
  assert.equal(head.grounding, "grounded");
  assert.equal(head.metadata?.ref_count, 5);

  const chainEdges = graph.edges.filter((edge) => edge.edge_type === "contains" || edge.edge_type === "head_of");
  assert.equal(chainEdges.length, fixture.nodes?.length);

  const manifestEdges = graph.edges.filter((edge) => edge.evidence.edge_id);
  assert.equal(manifestEdges.length, fixture.edges?.length);
});

test("renders a Mermaid flowchart from the grounded graph", () => {
  const graph = buildCairnGraphFromChainManifest(fixture);
  const mermaid = renderMermaidFlowchart(graph, { includeMetadata: true });

  assert.match(mermaid, /^flowchart TD/);
  assert.match(mermaid, /loop-engineer-template-review/);
  assert.match(mermaid, /HEAD/);
  assert.match(mermaid, /graph_id/);
  assert.doesNotMatch(mermaid, /undefined/);
});
