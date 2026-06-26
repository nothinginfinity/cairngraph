import { groundingReport } from "../../graph-engine/src/grounding-report.js";
import type { CairnGraph, CairnGraphEdge, CairnGraphNode } from "../../graph-engine/src/types.js";

export type BlastRadiusMetadata = {
  ok: boolean;
  root_node_id?: string;
  depth: number;
  direction: string;
  impacted_node_count: number;
  impacted_edge_count: number;
  risk_score: number;
};

export type HtmlRenderOptions = {
  title?: string;
  includeJson?: boolean;
  blastMetadata?: BlastRadiusMetadata;
};

export function renderHtmlGraph(graph: CairnGraph, options: HtmlRenderOptions = {}): string {
  const title = options.title ?? `CairnGraph: ${graph.source.chain}`;
  const report = groundingReport(graph);
  const nodes = graph.nodes;
  const edges = graph.edges;
  const includeJson = options.includeJson ?? true;
  const blast = options.blastMetadata;
  const kinds = Array.from(new Set(nodes.map((node) => node.kind))).sort();
  const groundings = Array.from(new Set(nodes.map((node) => node.grounding))).sort();
  const edgeTypes = Array.from(new Set(edges.map((edge) => edge.edge_type))).sort();

  // Track affected nodes/edges if blast metadata is present
  const affectedNodeIds = new Set<string>();
  const affectedEdgeIds = new Set<string>();
  if (blast && blast.ok) {
    // Mark nodes/edges that are in the filtered graph as affected
    nodes.forEach((node) => affectedNodeIds.add(node.id));
    edges.forEach((edge) => affectedEdgeIds.add(edge.id));
  }

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
.node.dim-unaffected { opacity: 0.35; }
.kind { color: var(--accent); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.label { margin-top: 4px; font-weight: 700; }
.evidence { margin-top: 8px; color: var(--muted); font-size: 12px; word-break: break-word; }
.graph { min-height: 70vh; }
.explorer-shell { border: 1px solid var(--line); border-radius: 16px; background: #020617; overflow: hidden; margin-bottom: 16px; }
.graph-canvas { min-height: 420px; position: relative; }
.graph-canvas svg { width: 100%; height: 420px; display: block; }
.graph-edge { stroke: var(--line); stroke-width: 1.6; opacity: .82; }
.graph-edge.selected { stroke: var(--accent); stroke-width: 2.5; opacity: 1; }
.graph-edge.blast-edge { stroke: #ef4444; opacity: 1; }
.graph-node circle { fill: var(--node); stroke: var(--accent); stroke-width: 1.5; }
.graph-node.selected circle { fill: #075985; stroke-width: 3; }
.graph-node.neighbor circle { stroke: var(--good); }
.graph-node.blast-root circle { fill: #b91c1c; stroke: #fca5a5; stroke-width: 2.5; }
.graph-node.blast-affected circle { fill: #7c2d12; stroke: #fb923c; stroke-width: 2; }
.graph-node.dim-unaffected circle { opacity: 0.3; }
.graph-node text { fill: var(--text); font-size: 11px; pointer-events: none; }
.graph-node button { cursor: pointer; }
.graph-empty { padding: 24px; color: var(--muted); }
.edge { border-left: 3px solid var(--accent); padding: 8px 0 8px 12px; margin: 8px 0; color: var(--muted); }
.edge button { margin-left: 8px; border: 1px solid var(--line); border-radius: 999px; background: #020617; color: var(--text); cursor: pointer; }
a { color: var(--accent); }
pre { overflow: auto; background: #020617; color: #e5e7eb; border-radius: 12px; padding: 12px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); font-size: 12px; margin: 0 4px 4px 0; }
.badge.blast-risk { border-color: #ef4444; color: #fca5a5; }
.complete { color: var(--good); }
.incomplete { color: var(--warn); }
.toolbar-status { color: var(--muted); font-size: 12px; }
.blast-summary { margin-top: 12px; padding: 12px; border: 1px solid #ef4444; border-radius: 12px; background: rgba(127, 29, 29, 0.3); color: #fca5a5; font-size: 12px; }
.blast-summary strong { color: #ef4444; }
.evidence-inspector { display: grid; gap: 12px; }
.inspector-field { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.inspector-label { color: var(--muted); min-width: 100px; }
.inspector-value { font-family: monospace; color: var(--accent); flex: 1; word-break: break-all; }
.inspector-button { border: 1px solid var(--line); border-radius: 999px; padding: 4px 8px; background: #020617; color: var(--text); cursor: pointer; font-size: 12px; }
.inspector-button:hover { border-color: var(--accent); }
.inspector-details { margin-top: 12px; }
.inspector-details summary { cursor: pointer; color: var(--accent); font-weight: 600; margin-bottom: 8px; }
.inspector-details pre { margin: 0; }
details[open] summary { color: var(--good); }
@media (max-width: 900px) { main { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<header>
<h1>${escapeHtml(title)}</h1>
<p>Grounded CairnGraph view for chain <strong>${escapeHtml(graph.source.chain)}</strong>${graph.source.head_hash ? ` with HEAD <code>${escapeHtml(shortHash(graph.source.head_hash))}</code>` : ""}.</p>
${blast ? blastSummaryPanel(blast) : ""}
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
${nodes.map((node) => renderNodeCard(node, blast ? affectedNodeIds.has(node.id) : false)).join("\n")}
</div>
</section>
<section class="card graph" data-blast-overlay="${blast ? "enabled" : "disabled"}">
<h2>Graph explorer</h2>
<p>Use the explorer to see topology, select nodes, filter edge types, and isolate a selected node neighborhood. Drag the background to pan, use zoom controls to adjust the view.</p>
<div class="controls" aria-label="Graph explorer controls">
<label>Edge type<select id="edge-filter"><option value="">all edge types</option>${edgeTypes.map((edgeType) => `<option value="${escapeAttr(edgeType)}">${escapeHtml(edgeType)}</option>`).join("")}</select></label>
<label class="inline-control"><input id="neighborhood-filter" type="checkbox"> selected neighborhood only</label>
${blast ? `<label class="inline-control"><input id="blast-toggle" type="checkbox" checked> show blast overlay</label>` : ""}
${blast ? `<label class="inline-control"><input id="dim-toggle" type="checkbox"> dim unaffected nodes</label>` : ""}
<div class="toolbar-status" id="graph-status">Graph explorer ready</div>
<div class="controls-zoom" style="display: flex; gap: 8px; margin-top: 10px;">
<button id="zoom-in" type="button" style="border: 1px solid var(--line); border-radius: 10px; padding: 9px; background: #020617; color: var(--text); cursor: pointer;">zoom in</button>
<button id="zoom-out" type="button" style="border: 1px solid var(--line); border-radius: 10px; padding: 9px; background: #020617; color: var(--text); cursor: pointer;">zoom out</button>
<button id="reset-view" type="button" style="border: 1px solid var(--line); border-radius: 10px; padding: 9px; background: #020617; color: var(--text); cursor: pointer;">reset view</button>
</div>
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
<script type="application/json" id="cairngraph-data">${escapeHtml(JSON.stringify({ graph, blast }))}</script>
<script>
const payload = JSON.parse(document.getElementById('cairngraph-data').textContent);
const graph = payload.graph;
const blast = payload.blast;
const selected = document.getElementById('selected');
const searchInput = document.getElementById('node-search');
const kindFilter = document.getElementById('kind-filter');
const groundingFilter = document.getElementById('grounding-filter');
const edgeFilter = document.getElementById('edge-filter');
const neighborhoodFilter = document.getElementById('neighborhood-filter');
const blastToggle = document.getElementById('blast-toggle');
const dimToggle = document.getElementById('dim-toggle');
const visibleCount = document.getElementById('visible-count');
const graphStatus = document.getElementById('graph-status');
const graphCanvas = document.getElementById('graph-canvas');
const cards = Array.from(document.querySelectorAll('[data-node-id]'));
let selectedNodeId = graph.nodes[0]?.id ?? '';
let showBlastOverlay = true;
let dimUnaffected = false;
let viewportX = 0;
let viewportY = 0;
let viewportW = 900;
let viewportH = 420;
const baseWidth = 900;
const baseHeight = 420;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panStartViewX = 0;
let panStartViewY = 0;

// Blast-affected tracking
const blastAffectedNodeIds = blast && blast.ok ? new Set(graph.nodes.map(n => n.id)) : new Set();
const blastAffectedEdgeIds = blast && blast.ok ? new Set(graph.edges.map(e => e.id)) : new Set();

function resetViewport() {
  viewportX = 0;
  viewportY = 0;
  viewportW = baseWidth;
  viewportH = baseHeight;
}

function zoomIn() {
  const centerX = viewportX + viewportW / 2;
  const centerY = viewportY + viewportH / 2;
  const factor = 0.7;
  const newW = viewportW * factor;
  const newH = viewportH * factor;
  viewportX = centerX - newW / 2;
  viewportY = centerY - newH / 2;
  viewportW = newW;
  viewportH = newH;
}

function zoomOut() {
  const centerX = viewportX + viewportW / 2;
  const centerY = viewportY + viewportH / 2;
  const factor = 1.43;
  const newW = Math.min(viewportW * factor, baseWidth);
  const newH = Math.min(viewportH * factor, baseHeight);
  viewportX = Math.max(0, centerX - newW / 2);
  viewportY = Math.max(0, centerY - newH / 2);
  viewportW = newW;
  viewportH = newH;
}

function startPan(event) {
  if (event.target.tagName === 'circle' || event.target.tagName === 'text') return;
  isPanning = true;
  panStartX = event.clientX || event.touches?.[0]?.clientX;
  panStartY = event.clientY || event.touches?.[0]?.clientY;
  panStartViewX = viewportX;
  panStartViewY = viewportY;
}

function doPan(event) {
  if (!isPanning) return;
  const svg = event.currentTarget;
  const rect = svg.getBoundingClientRect();
  const currentX = event.clientX || event.touches?.[0]?.clientX;
  const currentY = event.clientY || event.touches?.[0]?.clientY;
  const deltaX = panStartX - currentX;
  const deltaY = panStartY - currentY;
  const scaleX = viewportW / rect.width;
  const scaleY = viewportH / rect.height;
  viewportX = panStartViewX + deltaX * scaleX;
  viewportY = panStartViewY + deltaY * scaleY;
  viewportX = Math.max(0, Math.min(viewportX, baseWidth - viewportW));
  viewportY = Math.max(0, Math.min(viewportY, baseHeight - viewportH));
}

function endPan() {
  isPanning = false;
}

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
  cards.forEach(card => {
    card.classList.toggle('hidden', !ids.has(card.dataset.nodeId));
    if (dimUnaffected && !blastAffectedNodeIds.has(card.dataset.nodeId)) {
      card.classList.add('dim-unaffected');
    } else {
      card.classList.remove('dim-unaffected');
    }
  });
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
    (blast && blast.ok && node.id === blast.root_node_id ? '<p><span class="badge blast-risk">BLAST ROOT</span></p>' : '') +
    '<h3>Outgoing</h3>' + (outgoing.length ? outgoing.map(edgeLine).join('') : '<p>No outgoing edges.</p>') +
    '<h3>Incoming</h3>' + (incoming.length ? incoming.map(edgeLine).join('') : '<p>No incoming edges.</p>');
  selected.querySelectorAll('[class*="copy-"]').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
  renderGraphExplorer(matchingNodeIds());
}
function copyToClipboard(text, button) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const original = button.textContent;
      button.textContent = 'copied!';
      setTimeout(() => { button.textContent = original; }, 2000);
    }).catch(() => fallbackCopy(text, button));
  } else {
    fallbackCopy(text, button);
  }
}
function fallbackCopy(text, button) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    const original = button.textContent;
    button.textContent = 'copied!';
    setTimeout(() => { button.textContent = original; }, 2000);
  } catch (err) {
    button.textContent = 'copy failed';
  }
  document.body.removeChild(textarea);
}
function evidenceHtml(node) {
  const evidence = node.evidence ?? {};
  const stoneHash = evidence.stone_hash || evidence.short_hash;
  const refId = evidence.ref_id;
  const rawKey = evidence.raw_key;
  const sourceUrl = evidence.source_url;
  const lineStart = evidence.line_start;
  const lineEnd = evidence.line_end;
  let html = '<div class="evidence-inspector" id="evidence-inspector">' +
    '<div class="inspector-field"><span class="inspector-label">Node ID:</span><span class="inspector-value" id="inspector-node-id">' + esc(node.id) + '</span><button type="button" class="inspector-button copy-node-id" data-copy="' + esc(node.id) + '">copy</button></div>';
  if (stoneHash) {
    html += '<div class="inspector-field"><span class="inspector-label">Stone Hash:</span><span class="inspector-value" id="inspector-stone-hash">' + esc(stoneHash) + '</span><button type="button" class="inspector-button copy-stone-hash" data-copy="' + esc(stoneHash) + '">copy</button></div>';
  }
  if (refId) {
    html += '<div class="inspector-field"><span class="inspector-label">Ref ID:</span><span class="inspector-value" id="inspector-ref-id">' + esc(refId) + '</span><button type="button" class="inspector-button copy-ref-id" data-copy="' + esc(refId) + '">copy</button></div>';
  }
  if (rawKey) {
    html += '<div class="inspector-field"><span class="inspector-label">Raw Key:</span><span class="inspector-value" id="inspector-raw-key">' + esc(rawKey) + '</span></div>';
  }
  if (sourceUrl) {
    html += '<div class="inspector-field"><span class="inspector-label">Source URL:</span><a href="' + esc(sourceUrl) + '" target="_blank" rel="noreferrer" id="inspector-source-url" style="flex: 1; word-break: break-all;">' + esc(sourceUrl.slice(0, 60)) + (sourceUrl.length > 60 ? '…' : '') + '</a></div>';
  }
  if (lineStart && lineEnd) {
    html += '<div class="inspector-field"><span class="inspector-label">Line Range:</span><span class="inspector-value">' + lineStart + '-' + lineEnd + '</span></div>';
  }
  html += '<details class="inspector-details"><summary>Evidence JSON</summary><pre>' + esc(JSON.stringify(evidence, null, 2)) + '</pre><button type="button" class="inspector-button copy-evidence-json" data-copy=\'' + esc(JSON.stringify(evidence)) + '\' style="margin-top: 8px;">copy JSON</button></details></div>';
  return html;
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
  const width = baseWidth;
  const height = baseHeight;
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
    const isBlastEdge = showBlastOverlay && blastAffectedEdgeIds.has(edge.id);
    return '<line class="graph-edge ' + (selectedEdge ? 'selected' : '') + ' ' + (isBlastEdge ? 'blast-edge' : '') + '" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" data-blast-edge="' + (isBlastEdge ? 'true' : 'false') + '"><title>' + esc(edge.edge_type + ': ' + (edge.label ?? '')) + '</title></line>';
  }).join('');
  const nodeSvg = activeNodes.map(node => {
    const point = positions.get(node.id);
    const isSelected = node.id === selectedNodeId;
    const isNeighbor = graph.edges.some(edge => (edge.from === selectedNodeId && edge.to === node.id) || (edge.to === selectedNodeId && edge.from === node.id));
    const isBlastRoot = showBlastOverlay && blast && blast.ok && node.id === blast.root_node_id;
    const isBlastAffected = showBlastOverlay && blastAffectedNodeIds.has(node.id);
    const isDimmed = dimUnaffected && !blastAffectedNodeIds.has(node.id);
    const label = truncate(node.label, 24);
    return '<g class="graph-node ' + (isSelected ? 'selected' : '') + ' ' + (isNeighbor ? 'neighbor' : '') + ' ' + (isBlastRoot ? 'blast-root' : '') + ' ' + (isBlastAffected && !isBlastRoot ? 'blast-affected' : '') + ' ' + (isDimmed ? 'dim-unaffected' : '') + '" data-graph-node-id="' + esc(node.id) + '" data-blast-affected="' + (isBlastAffected ? 'true' : 'false') + '" data-blast-root="' + (isBlastRoot ? 'true' : 'false') + '" transform="translate(' + point.x + ' ' + point.y + ')"><circle r="18"></circle><text x="24" y="4">' + esc(label) + '</text><title>' + esc(node.label) + '</title></g>';
  }).join('');
  graphCanvas.innerHTML = '<svg role="img" aria-label="Interactive CairnGraph topology" data-graph-viewport="enabled" viewBox="' + Math.round(viewportX) + ' ' + Math.round(viewportY) + ' ' + Math.round(viewportW) + ' ' + Math.round(viewportH) + '">' + edgeSvg + nodeSvg + '</svg>';
  graphStatus.textContent = 'Showing ' + activeNodes.length + ' nodes and ' + activeEdges.length + ' edges';
  
  const svg = graphCanvas.querySelector('svg');
  svg.addEventListener('mousedown', startPan);
  svg.addEventListener('mousemove', doPan);
  svg.addEventListener('mouseup', endPan);
  svg.addEventListener('mouseleave', endPan);
  svg.addEventListener('touchstart', startPan);
  svg.addEventListener('touchmove', doPan);
  svg.addEventListener('touchend', endPan);
  
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
if (blastToggle) blastToggle.addEventListener('change', (e) => { showBlastOverlay = e.target.checked; applyFilters(); });
if (dimToggle) dimToggle.addEventListener('change', (e) => { dimUnaffected = e.target.checked; applyFilters(); });
document.getElementById('zoom-in').addEventListener('click', () => { zoomIn(); applyFilters(); });
document.getElementById('zoom-out').addEventListener('click', () => { zoomOut(); applyFilters(); });
document.getElementById('reset-view').addEventListener('click', () => { resetViewport(); applyFilters(); });
resetViewport();
applyFilters();
if (graph.nodes.length) inspect(graph.nodes[0].id);
</script>
</body>
</html>`;
