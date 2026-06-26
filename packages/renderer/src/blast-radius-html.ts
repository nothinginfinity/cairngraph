import { blastRadiusSubgraph, computeBlastRadius, type BlastRadiusOptions, type BlastRadiusResult } from "../../blast-radius/src/index.js";
import type { CairnGraph } from "../../graph-engine/src/types.js";
import { renderHtmlGraph, type BlastRadiusMetadata } from "./html.js";

export type BlastRadiusHtmlOptions = BlastRadiusOptions & {
  title?: string;
  includeJson?: boolean;
};

export function renderBlastRadiusHtml(graph: CairnGraph, options: BlastRadiusHtmlOptions = {}): string {
  const result = computeBlastRadius(graph, options);
  const subgraph = blastRadiusSubgraph(graph, result);
  const title = options.title ?? `Blast radius: ${graph.source.chain}`;
  
  const metadata: BlastRadiusMetadata = {
    ok: result.ok,
    root_node_id: result.root_node_id,
    depth: result.depth,
    direction: result.direction,
    impacted_node_count: result.impacted_node_count,
    impacted_edge_count: result.impacted_edge_count,
    risk_score: result.risk_score
  };

  return renderHtmlGraph(subgraph, {
    title,
    includeJson: options.includeJson ?? true,
    blastMetadata: metadata
  });
}
