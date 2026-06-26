# PHASE_4E: v1.1-beta — Live UX Verification & Polish

**Date:** 2026-06-26  
**Status:** Phase 1 — Live Verification Setup  
**Previous Phase:** v1.1-alpha.4 (Source/Ref Inspector) ✅ Complete  

---

## Overview

v1.1-beta focuses on deploying the complete UX stack to the live Worker and adding low-risk polish without changing the stable provider/API contract.

### What's Included:
- **Phase 1:** Live UX verification script and infrastructure
- **Phase 2:** Usability polish (graph legend, keyboard hints, status indicators)

### What's NOT Included:
- ❌ New endpoints or API changes
- ❌ External frontend frameworks
- ❌ Canvas or GPU dependencies
- ❌ New build dependencies
- ❌ Multi-chain navigation (v1.2+)

---

## Phase 1: Live UX Verification (Current)

### Deliverables:
1. **`scripts/verify-live-worker.mjs`** — HTTP client that fetches live HTML and checks for 15 UX markers
   - Graph explorer baseline (4 markers)
   - Graph filtering (3 markers)
   - Blast radius features (3 markers)
   - Evidence inspector (5 markers)

2. **`docs/V1_1_BETA_CHECKLIST.md`** — Complete Phase 1 & 2 checklist with CI/deploy gates

3. **`docs/PHASE_4E.md`** — This document

### Marker Verification (15 total):

| Category | Marker | v1.1 Phase | Status |
|----------|--------|-----------|--------|
| Explorer | `graph-canvas` | alpha.1 | ✅ |
| Explorer | `zoom-in` | alpha.2 | ✅ |
| Explorer | `zoom-out` | alpha.2 | ✅ |
| Explorer | `reset-view` | alpha.2 | ✅ |
| Filter | `node-search` | alpha.1 | ✅ |
| Filter | `edge-filter` | alpha.1 | ✅ |
| Filter | `neighborhood-filter` | alpha.1 | ✅ |
| Blast | `blast-summary` | alpha.3 | ✅ |
| Blast | `blast-toggle` | alpha.3 | ✅ |
| Blast | `dim-toggle` | alpha.3 | ✅ |
| Inspector | `evidence-inspector` | alpha.4 | ✅ |
| Inspector | `inspector-node-id` | alpha.4 | ✅ |
| Inspector | `copy-node-id` | alpha.4 | ✅ |
| Inspector | `copy-evidence-json` | alpha.4 | ✅ |
| Inspector | `inspector-details` | alpha.4 | ✅ |

---

## Phase 1 Workflow

### Step 1: Local Verification ✅
```bash
npm run check    # TypeScript compile
npm test         # All 30 tests
```
Expected: 0 errors, 30/30 passing

### Step 2: CI/Deploy Pipeline ✅
```
Actions: CI workflow → success
Actions: Deploy Candidate → success
```

### Step 3: Worker Deployment 🔄
```bash
npm run deploy   # Via wrangler
# or via GitHub Actions
```
Deploys to: `https://cairngraph-worker.jaredtechfit.workers.dev/`

### Step 4: Live Verification 🔄
```bash
node scripts/verify-live-worker.mjs
```
Expected output:
```
✅ graph-canvas              — SVG graph explorer viewport
✅ zoom-in                   — Zoom in button
✅ zoom-out                  — Zoom out button
✅ reset-view                — Reset view button
✅ node-search               — Node search input
✅ edge-filter               — Edge type filter select
✅ neighborhood-filter       — Neighborhood toggle
✅ blast-summary             — Blast radius summary panel
✅ blast-toggle              — Blast overlay toggle
✅ dim-toggle                — Dim unaffected nodes toggle
✅ evidence-inspector        — Structured evidence inspector
✅ inspector-node-id         — Node ID field in inspector
✅ copy-node-id              — Copy node ID button
✅ copy-evidence-json        — Copy evidence JSON button
✅ inspector-details         — Collapsible evidence JSON details

✅ All 15 markers present on live worker
```

---

## Phase 2: UX Polish (Planned)

### Low-Risk Additions:

#### 1. Graph Legend
**What:** Visual key showing node state meanings
**Where:** Below graph explorer, collapsible or always-visible
**Markers:** `graph-legend`, `legend-selected`, `legend-neighbor`, etc.
**Risk:** ✅ Low — Pure CSS + HTML, no logic changes

```html
<div id="graph-legend" class="graph-legend">
  <h3>Graph Legend</h3>
  <div class="legend-item">
    <div class="legend-sample selected"></div>
    <span>Selected node</span>
  </div>
  <div class="legend-item">
    <div class="legend-sample neighbor"></div>
    <span>Neighbor of selected</span>
  </div>
  <div class="legend-item">
    <div class="legend-sample blast-root"></div>
    <span>Blast radius root</span>
  </div>
  <div class="legend-item">
    <div class="legend-sample blast-affected"></div>
    <span>Blast affected</span>
  </div>
  <div class="legend-item">
    <div class="legend-sample dim-unaffected"></div>
    <span>Dimmed (not affected)</span>
  </div>
</div>
```

#### 2. Selected Node Status Text
**What:** Human-readable indicator of which node is selected
**Where:** Above inspector, updates dynamically
**Marker:** `selected-node-status`
**Risk:** ✅ Low — Simple text binding

```html
<div id="selected-node-status" class="selected-node-status">
  Selected: <strong>node-label</strong> (kind: node-kind)
</div>
```

#### 3. Keyboard Hints
**What:** Help text showing keyboard/interaction tips
**Where:** Sidebar or collapsible panel
**Marker:** `keyboard-hints`
**Risk:** ✅ Low — Static or minimal interactivity

```html
<div id="keyboard-hints" class="keyboard-hints">
  <h4>Keyboard & Interaction Tips</h4>
  <ul>
    <li>Click a node to select and inspect</li>
    <li>Drag background to pan</li>
    <li>Use zoom buttons or scroll to adjust view</li>
    <li>Search bar filters nodes in real-time</li>
    <li>Toggle "neighborhood only" to focus on connections</li>
  </ul>
</div>
```

#### 4. Inspector Empty State
**What:** Friendly message when no node is selected
**Where:** In inspector panel
**Marker:** `inspector-empty-state`
**Risk:** ✅ Low — Conditional rendering

```html
<div id="inspector-empty-state" class="inspector-empty-state">
  <p>👈 Select a node to view its evidence and connections</p>
</div>
```

### Phase 2 Changes:
- **`packages/renderer/src/html.ts`** — Add 4 new sections (250–400 lines max)
- **`tests/html-renderer.test.ts`** — Add assertions for new markers
- **CSS additions** — ~200 lines for legend styling

### Phase 2 Testing:
```bash
npm run check
npm test       # Expect 30/30 passing
npm run build
```

---

## How to Proceed

### If Phase 1 Live Verification ✅ Passes:
1. Deploy Worker (if not already done)
2. Run `node scripts/verify-live-worker.mjs`
3. Confirm all 15 markers ✅
4. Move to Phase 2 (if requested) or freeze at v1.1-beta

### If Phase 1 Live Verification ❌ Fails:
1. Check Worker deployment logs
2. Verify HTML output contains expected markers
3. If missing, diagnose and fix
4. Re-run verification until ✅

### If Phase 2 Polish Requested:
1. Update `packages/renderer/src/html.ts` with legend, status, hints, empty state
2. Run local tests: `npm test`
3. Verify TypeScript: `npm run check`
4. Push and wait for CI
5. Deploy and re-verify with script

---

## CI/Deploy Gates

**Do not proceed past Phase 1 until:**
- ✅ Local: `npm run check` passes
- ✅ Local: `npm test` 30/30 passing
- ✅ CI: workflow green
- ✅ Deploy Candidate: green
- ✅ Live: Worker deployed
- ✅ Live: `node scripts/verify-live-worker.mjs` all 15 markers ✅

**Do not release v1.1 final until:**
- ✅ Phase 1 live verification complete
- ✅ Phase 2 (if implemented) local tests passing
- ✅ Phase 2 (if implemented) live verification complete
- ✅ No regressions from alpha phases

---

## Preserved API & Contract

✅ **Endpoints:**
- `GET /render/html` — CairnGraph HTML with optional blast metadata
- `POST /render/html` — CairnGraph HTML from payload

✅ **Provider:**
- `CairnStone V5` — Live provider chain manifest & search integration

✅ **No breaking changes:**
- Field names in HTML output
- CSS class names (used by verification script)
- JavaScript behavior
- Worker binding requirements

---

## Next Phase: v1.2 (Not in scope)

- Multi-chain navigation
- Chain switching UI
- Cross-chain edge visualization
- Timeline view (if timeline package matures)

---

## References

- **v1.1-alpha.1** — Graph Explorer UX
- **v1.1-alpha.2** — Zoom and Pan Controls
- **v1.1-alpha.3** — Blast-radius Visual Overlay
- **v1.1-alpha.4** — Source/Ref Inspector and Stone Detail Drawer
- **v1.1-beta** — Live UX Verification & Polish (this phase)
