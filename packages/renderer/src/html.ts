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
  const kinds = Array.from(new Set(nodes.map((node) => node.kind))).sort();
  const groundings = Array.from(new Set(nodes.map((node) => node.grounding))).sort();
  const edgeTypes = Array.from(new Set(edges.map((edge) => edge.edge_type))).sort();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
:root { color-scheme: light dark; --bg: #0f172a; --panel: #111827; --muted: #94a3b8; --text: #e5e7eb; --line: #334155; --accent: #38bdf8; --good: #22c55e; --warn: #f59e0b; --bad: #ef4444; --node: #1e293b; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); }
header { padding: 28px; border-bottom: 1px solid var(--line); background: linear-gradient(135deg, #020617, #172554); }
h1 { margin: 0 0 8px; font-size: 28px; }
p { color: var(--muted); }
main { display: grid; grid-template-columns: minmax(280px, 380px) 1fr; gap: 16px; padding: 16px; }
.card { background: rgba(17, 24, 39, 0.92); border: 1px solid var(--line); border-radius: 16px; padding: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.25); }
.metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.metric { border: 1px solid var(--line); border-radius: 12px; padding: 10px; }
.metric strong { display: block; font-size: 22px; }
.controls { display: grid; gap: 10px; margin: 14px 0; }
.controls label { display: grid; gap: 4px; color: var(--muted); font-size: 12px; }
.inline-control { display: flex !important; grid-template-columns: none !important; align-items: center; gap: 8px !important; }
input, select { border: 1px solid var(--line); border-radius: 10px; padding: 9px; background: #020617; color: var(--text); }
input[type="checkbox"] { width: auto; }
.node-list { display: flex; flex-direction: column; gap: 8px; max-height: 70vh; overflow: auto; }
.node { border: 1px solid var(--line); border-radius: 12px; padding: 10px; cursor: pointer; background: #0b1220; }
.node:hover { border-color: var(--accent); }
.node.selected { border-color: var(--accent); outline: 1px solid var(--accent); }
.node.hidden { display: none; }
.kind { color: var(--accent); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.label { margin-top: 4px; font-weight: 700; }
.evidence { margin-top: 8px; color: var(--muted); font-size: 12px; word-break: break-word; }
.graph { min-height: 70vh; }
.explorer-shell { border: 1px solid var(--line); border-radius: 16px; background: #020617; overflow: hidden; margin-bottom: 16px; }
.graph-canvas { min-height: 420px; position: relative; }
.graph-canvas svg { width: 100%; height: 420px; display: block; }
.graph-edge { stroke: var(--line); stroke-width: 1.6; opacity: .82; }
.graph-edge.selected { stroke: var(--accent); stroke-width: 2.5; opacity: 1; }
.graph-node circle { fill: var(--node); stroke: var(--accent); stroke-width: 1.5; }
.graph-node.selected circle { fill: #075985; stroke-width: 3; }
.graph-node.neighbor circle { stroke: var(--good); }
.graph-node text { fill: var(--text); font-size: 11px; pointer-events: none; }
.graph-node button { cursor: pointer; }
.graph-empty { padding: 24px; color: var(--muted); }
.edge { border-left: 3px solid var(--accent); padding: 8px 0 8px 12px; margin: 8px 0; color: var(--muted); }
.edge button { margin-left: 8px; border: 1px solid var(--line); border-radius: 999px; background: #020617; color: var(--text); cursor: pointer; }
a { color: var(--accent); }
pre { overflow: auto; background: #020617; color: #e5e7eb; border-radius: 12px; padding: 12px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); font-size: 12px; margin: 0 4px 4px 0; }
.complete { color: var(--good); }
.incomplete { color: var(--warn); }
.toolbar-status { color: var(--muted); font-size: 12px; }
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
<h3>Interactive controls</h3>
<div class="controls" aria-label="Graph filters">
<label>Search nodes<input id="node-search" type="search" placeholder="label, hash, ref, path, keyword"></label>
<label>Node kind<select id="kind-filter"><option value="">all kinds</option>${kinds.map((kind) => `<option value="${escapeAttr(kind)}">${escapeHtml(kind)}</option>`).join("")}</select></label>
<label>Grounding<select id="grounding-filter"><option value="">all grounding</option>${groundings.map((grounding) => `<option value="${escapeAttr(grounding)}">${escapeHtml(grounding)}</option>`).join("")}</select></label>
<div class="toolbar-status" id="visible-count">Showing ${nodes.length} nodes</div>
</div>
<h3>Nodes</h3>
<div class="node-list" id="node-list">
${nodes.map(renderNodeCard).join("\n")}
</div>
</section>
<section class="card graph">
<h2>Graph explorer</h2>
<p>Use the explorer to see topology, select nodes, filter edge types, and isolate a selected node neighborhood.</p>
<div class="controls" aria-label="Graph explorer controls">
<label>Edge type<select id="edge-filter"><option value="">all edge types</option>${edgeTypes.map((edgeType) => `<option value="${escapeAttr(edgeType)}">${escapeHtml(edgeType)}</option>`).join("")}</select></label>
<label class="inline-control"><input id="neighborhood-filter" type="checkbox"> selected neighborhood only</label>
<div class="toolbar-status" id="graph-status">Graph explorer ready</div>
</div>
<div class="explorer-shell"><div class="graph-canvas" id="graph-canvas"></div></div>
<h2>Selected evidence</h2>
<p id="selected-help">Click a node to inspect its evidence and incoming/outgoing navigation edges.</p>
<div id="selected"></div>
<h2>Edges</h2>
<div id="edge-list">${edges.map(renderEdge).join("\n")}</div>
${includeJson ? `<h2>Graph JSON</h2><pre>${escapeHtml(JSON.stringify(graph, null, 2))}</pre>` : ""}
</section>
</main>
<script type="application/json" id="cairngraph-data">${escapeHtml(JSON.stringify({ graph }))}</script>
<script>
const payload = JSON.parse(document.getElementById('cairngraph-data').textContent);
const graph = payload.graph;
const selected = document.getElementById('selected');
const searchInput = document.getElementById('node-search');
const kindFilter = document.getElementById('kind-filter');
const groundingFilter = document.getElementById('grounding-filter');
const edgeFilter = document.getElementById('edge-filter');
const neighborhoodFilter = document.getElementById('neighborhood-filter');
const visibleCount = document.getElementById('visible-count');
const graphStatus = document.getElementById('graph-status');
const graphCanvas = document.getElementById('graph-canvas');
const cards = Array.from(document.querySelectorAll('[data-node-id]'));
let selectedNodeId = graph.nodes[0]?.id ?? '';
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function searchable(node) { return [node.id, node.kind, node.label, node.grounding, JSON.stringify(node.evidence ?? {})].join(' ').toLowerCase(); }
function matchingNodeIds() {
  const query = searchInput.value.trim().toLowerCase();
  const kind = kindFilter.value;
  const grounding = groundingFilter.value;
  const base = graph.nodes.filter(node => (!query || searchable(node).includes(query)) && (!kind || node.kind === kind) && (!grounding || node.grounding === grounding));
  if (!neighborhoodFilter.checked || !selectedNodeId) return new Set(base.map(node => node.id));
  const neighbors = new Set([selectedNodeId]);
  graph.edges.forEach(edge => {
    if (edge.from === selectedNodeId) neighbors.add(edge.to);
    if (edge.to === selectedNodeId) neighbors.add(edge.from);
  });
  return new Set(base.filter(node => neighbors.has(node.id)).map(node => node.id));
}
function applyFilters() {
  const ids = matchingNodeIds();
  cards.forEach(card => card.classList.toggle('hidden', !ids.has(card.dataset.nodeId)));
  visibleCount.textContent = 'Showing ' + ids.size + ' of ' + graph.nodes.length + ' nodes';
  renderGraphExplorer(ids);
}
function inspect(nodeId) {
  selectedNodeId = nodeId;
  cards.forEach(card => card.classList.toggle('selected', card.dataset.nodeId === nodeId));
  const node = graph.nodes.find(item => item.id === nodeId);
  if (!node) return;
  const outgoing = graph.edges.filter(edge => edge.from === nodeId);
  const incoming = graph.edges.filter(edge => edge.to === nodeId);
  selected.innerHTML = '<h3>' + esc(node.label) + '</h3>' +
    '<p><span class="badge">' + esc(node.kind) + '</span> <span class="badge">' + esc(node.grounding) + '</span></p>' +
    evidenceHtml(node) +
    '<h3>Outgoing</h3>' + (outgoing.length ? outgoing.map(edgeLine).join('') : '<p>No outgoing edges.</p>') +
    '<h3>Incoming</h3>' + (incoming.length ? incoming.map(edgeLine).join('') : '<p>No incoming edges.</p>');
  renderGraphExplorer(matchingNodeIds());
}
function evidenceHtml(node) {
  const evidence = node.evidence ?? {};
  const source = evidence.source_url ? '<p><a href="' + esc(evidence.source_url) + '" target="_blank" rel="noreferrer">source lines</a></p>' : '';
  return source + '<pre>' + esc(JSON.stringify(evidence, null, 2)) + '</pre>';
}
function edgeLine(edge) {
  const target = graph.nodes.find(item => item.id === edge.to);
  const source = graph.nodes.find(item => item.id === edge.from);
  return '<div class="edge"><strong>' + esc(edge.edge_type) + '</strong> ' + esc(source?.label) + ' → ' + esc(target?.label) + '<button type="button" data-jump="' + esc(edge.to) + '">to</button><button type="button" data-jump="' + esc(edge.from) + '">from</button><br><small>' + esc(edge.label ?? '') + '</small></div>';
}
function renderGraphExplorer(nodeIds) {
  const activeNodes = graph.nodes.filter(node => nodeIds.has(node.id));
  const edgeType = edgeFilter.value;
  const activeIdSet = new Set(activeNodes.map(node => node.id));
  const activeEdges = graph.edges.filter(edge => activeIdSet.has(edge.from) && activeIdSet.has(edge.to) && (!edgeType || edge.edge_type === edgeType));
  if (!activeNodes.length) {
    graphCanvas.innerHTML = '<div class="graph-empty">No graph nodes match the current filters.</div>';
    graphStatus.textContent = 'Showing 0 nodes and 0 edges';
    return;
  }
  const width = 900;
  const height = 420;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(90, Math.min(180, 42 + activeNodes.length * 7));
  const positions = new Map();
  activeNodes.forEach((node, index) => {
    const angle = activeNodes.length === 1 ? 0 : (Math.PI * 2 * index) / activeNodes.length - Math.PI / 2;
    positions.set(node.id, { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius });
  });
  const edgeSvg = activeEdges.map(edge => {
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
    const selectedEdge = edge.from === selectedNodeId || edge.to === selectedNodeId;
    return '<line class="graph-edge ' + (selectedEdge ? 'selected' : '') + '" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '"><title>' + esc(edge.edge_type + ': ' + (edge.label ?? '')) + '</title></line>';
  }).join('');
  const nodeSvg = activeNodes.map(node => {
    const point = positions.get(node.id);
    const isSelected = node.id === selectedNodeId;
    const isNeighbor = graph.edges.some(edge => (edge.from === selectedNodeId && edge.to === node.id) || (edge.to === selectedNodeId && edge.from === node.id));
    const label = truncate(node.label, 24);
    return '<g class="graph-node ' + (isSelected ? 'selected' : '') + ' ' + (isNeighbor ? 'neighbor' : '') + '" data-graph-node-id="' + esc(node.id) + '" transform="translate(' + point.x + ' ' + point.y + ')"><circle r="18"></circle><text x="24" y="4">' + esc(label) + '</text><title>' + esc(node.label) + '</title></g>';
  }).join('');
  graphCanvas.innerHTML = '<svg role="img" aria-label="Interactive CairnGraph topology" viewBox="0 0 ' + width + ' ' + height + '">' + edgeSvg + nodeSvg + '</svg>';
  graphStatus.textContent = 'Showing ' + activeNodes.length + ' nodes and ' + activeEdges.length + ' edges';
  graphCanvas.querySelectorAll('[data-graph-node-id]').forEach(item => item.addEventListener('click', () => inspect(item.dataset.graphNodeId)));
}
function truncate(value, length) { const text = String(value ?? ''); return text.length > length ? text.slice(0, length - 1) + '…' : text; }
cards.forEach(card => card.addEventListener('click', () => inspect(card.dataset.nodeId)));
selected.addEventListener('click', event => { const target = event.target; if (target && target.dataset && target.dataset.jump) inspect(target.dataset.jump); });
searchInput.addEventListener('input', applyFilters);
kindFilter.addEventListener('change', applyFilters);
groundingFilter.addEventListener('change', applyFilters);
edgeFilter.addEventListener('change', applyFilters);
neighborhoodFilter.addEventListener('change', applyFilters);
applyFilters();
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
${sourceUrl ? `<a href="${escapeAttr(sourceUrl)}" target="_blank" rel="noreferrer">source lines</a>` : ""}
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
