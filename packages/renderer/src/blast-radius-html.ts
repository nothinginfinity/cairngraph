import { blastRadiusSubgraph, computeBlastRadius, type BlastRadiusOptions, type BlastRadiusResult } from "../../blast-radius/src/index.js";
import type { CairnGraph } from "../../graph-engine/src/types.js";
import { renderHtmlGraph } from "./html.js";

export type BlastRadiusHtmlOptions = BlastRadiusOptions & {
  title?: string;
  includeJson?: boolean;
};

export function renderBlastRadiusHtml(graph: CairnGraph, options: BlastRadiusHtmlOptions = {}): string {
  const result = computeBlastRadius(graph, options);
  const subgraph = blastRadiusSubgraph(graph, result);
  const title = options.title ?? `Blast radius: ${graph.source.chain}`;
  return renderHtmlGraph(subgraph, { title, includeJson: options.includeJson ?? true }).replace("</header>", `${summaryBlock(result)}</header>`);
}

function summaryBlock(result: BlastRadiusResult): string {
  return `<section style="margin-top:16px;padding:12px;border:1px solid #334155;border-radius:12px;background:rgba(15,23,42,.7)">
<strong>Blast radius status:</strong> ${escapeHtml(result.ok ? "ok" : "error")} ·
<strong>depth:</strong> ${result.depth} ·
<strong>direction:</strong> ${escapeHtml(result.direction)} ·
<strong>impacted nodes:</strong> ${result.impacted_node_count} ·
<strong>impacted edges:</strong> ${result.impacted_edge_count} ·
<strong>risk score:</strong> ${result.risk_score}
${result.error ? `<br><strong>Error:</strong> ${escapeHtml(result.error)}` : ""}
</section>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] ?? char));
}
