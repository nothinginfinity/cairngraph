import { groundingReport } from "../../graph-engine/src/grounding-report.js";
import type { CairnGraph, CairnGraphEdge, CairnGraphNode } from "../../graph-engine/src/types.js";

export type HtmlRenderOptions = {
  title?: string;
  includeJson?: boolean;
};

export function renderHtmlGraph(graph: CairnGraph, options: HtmlRenderOptions = {}): string {
  const title = options.title ?? `CairnGraph: ${graph.source.chain}`;
  const report = groundingReport(graph);
  const nodes = graph.nodes;
  const edges = graph.edges;
  const includeJson = options.includeJson ?? true;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
:root { color-scheme: light dark; --bg: #0f172a; --panel: #111827; --muted: #94a3b8; --text: #e5e7eb; --line: #334155; --accent: #38bdf8; --good: #22c55e; --warn: #f59e0b; --bad: #ef4444; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); }
header { padding: 28px; border-bottom: 1px solid var(--line); background: linear-gradient(135deg, #020617, #172554); }
h1 { margin: 0 0 8px; font-size: 28px; }
p { color: var(--muted); }
main { display: grid; grid-template-columns: minmax(280px, 360px) 1fr; gap: 16px; padding: 16px; }
.card { background: rgba(17, 24, 39, 0.92); border: 1px solid var(--line); border-radius: 16px; padding: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.25); }
.metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.metric { border: 1px solid var(--line); border-radius: 12px; padding: 10px; }
.metric strong { display: block; font-size: 22px; }
.node-list { display: flex; flex-direction: column; gap: 8px; max-height: 70vh; overflow: auto; }
.node { border: 1px solid var(--line); border-radius: 12px; padding: 10px; cursor: pointer; background: #0b1220; }
.node:hover { border-color: var(--accent); }
.node.selected { border-color: var(--accent); outline: 1px solid var(--accent); }
.kind { color: var(--accent); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.label { margin-top: 4px; font-weight: 700; }
.evidence { margin-top: 8px; color: var(--muted); font-size: 12px; word-break: break-word; }
.graph { min-height: 70vh; }
.edge { border-left: 3px solid var(--accent); padding: 8px 0 8px 12px; margin: 8px 0; color: var(--muted); }
a { color: var(--accent); }
pre { overflow: auto; background: #020617; color: #e5e7eb; border-radius: 12px; padding: 12px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); font-size: 12px; }
.complete { color: var(--good); }
.incomplete { color: var(--warn); }
@media (max-width: 900px) { main { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<header>
<h1>${escapeHtml(title)}</h1>
<p>Grounded CairnGraph view for chain <strong>${escapeHtml(graph.source.chain)}</strong>${graph.source.head_hash ? ` with HEAD <code>${escapeHtml(shortHash(graph.source.head_hash))}</code>` : ""}.</p>
</header>
<main>
<section class="card">
<h2>Grounding report</h2>
<div class="metrics">
${metric("Nodes", report.node_count)}
${metric("Edges", report.edge_count)}
${metric("Unresolved", report.unresolved_count)}
${metric("Complete", report.complete ? "yes" : "no", report.complete ? "complete" : "incomplete")}
</div>
<h3>Nodes</h3>
<div class="node-list">
${nodes.map(renderNodeCard).join("\n")}
</div>
</section>
<section class="card graph">
<h2>Selected evidence</h2>
<p id="selected-help">Click a node to inspect its evidence and outgoing navigation edges.</p>
<div id="selected"></div>
<h2>Edges</h2>
<div>${edges.map(renderEdge).join("\n")}</div>
${includeJson ? `<h2>Graph JSON</h2><pre>${escapeHtml(JSON.stringify(graph, null, 2))}</pre>` : ""}
</section>
</main>
<script type="application/json" id="cairngraph-data">${escapeHtml(JSON.stringify({ graph }))}</script>
<script>
const payload = JSON.parse(document.getElementById('cairngraph-data').textContent);
const graph = payload.graph;
const selected = document.getElementById('selected');
const cards = Array.from(document.querySelectorAll('[data-node-id]'));
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function inspect(nodeId) {
  cards.forEach(card => card.classList.toggle('selected', card.dataset.nodeId === nodeId));
  const node = graph.nodes.find(item => item.id === nodeId);
  const outgoing = graph.edges.filter(edge => edge.from === nodeId);
  const incoming = graph.edges.filter(edge => edge.to === nodeId);
  selected.innerHTML = '<h3>' + esc(node.label) + '</h3>' +
    '<p><span class="badge">' + esc(node.kind) + '</span> <span class="badge">' + esc(node.grounding) + '</span></p>' +
    '<pre>' + esc(JSON.stringify(node.evidence, null, 2)) + '</pre>' +
    '<h3>Outgoing</h3>' + (outgoing.length ? outgoing.map(edgeLine).join('') : '<p>No outgoing edges.</p>') +
    '<h3>Incoming</h3>' + (incoming.length ? incoming.map(edgeLine).join('') : '<p>No incoming edges.</p>');
}
function edgeLine(edge) {
  const target = graph.nodes.find(item => item.id === edge.to);
  const source = graph.nodes.find(item => item.id === edge.from);
  return '<div class="edge"><strong>' + esc(edge.edge_type) + '</strong> ' + esc(source?.label) + ' → ' + esc(target?.label) + '<br><small>' + esc(edge.label ?? '') + '</small></div>';
}
cards.forEach(card => card.addEventListener('click', () => inspect(card.dataset.nodeId)));
if (graph.nodes.length) inspect(graph.nodes[0].id);
</script>
</body>
</html>`;
}

function renderNodeCard(node: CairnGraphNode): string {
  const sourceUrl = node.evidence.source_url;
  return `<article class="node" data-node-id="${escapeAttr(node.id)}">
<div class="kind">${escapeHtml(node.kind)} · ${escapeHtml(node.grounding)}</div>
<div class="label">${escapeHtml(node.label)}</div>
<div class="evidence">
${node.evidence.stone_hash ? `stone ${escapeHtml(shortHash(node.evidence.stone_hash))}<br>` : ""}
${node.evidence.ref_id ? `ref ${escapeHtml(node.evidence.ref_id)}<br>` : ""}
${node.evidence.raw_key ? `raw ${escapeHtml(node.evidence.raw_key)}<br>` : ""}
${sourceUrl ? `<a href="${escapeAttr(sourceUrl)}" target="_blank" rel="noreferrer">source</a>` : ""}
</div>
</article>`;
}

function renderEdge(edge: CairnGraphEdge): string {
  return `<div class="edge"><strong>${escapeHtml(edge.edge_type)}</strong> ${escapeHtml(edge.from)} → ${escapeHtml(edge.to)}<br><small>${escapeHtml(edge.label ?? "")}</small></div>`;
}

function metric(label: string, value: string | number | boolean, className = ""): string {
  return `<div class="metric"><span>${escapeHtml(label)}</span><strong class="${escapeAttr(className)}">${escapeHtml(String(value))}</strong></div>`;
}

function shortHash(value: string): string {
  return value.slice(0, 12);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] ?? char));
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
