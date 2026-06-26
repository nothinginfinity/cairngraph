# v1.1-beta — Live UX Verification & Polish

**Status:** In Progress (v1.1-alpha phases complete, live verification pending)

## Phase 1: Live UX Verification Support ✅ IN PROGRESS

### Completed:
- [x] `scripts/verify-live-worker.mjs` — Assert 15 v1.1 UX markers present in live HTML
- [x] Documentation: this checklist + PHASE_4E.md

### Tasks:

#### Step 1: Verify npm run check & npm test pass locally
```bash
npm run check  # TypeScript
npm test       # All 30 tests
```

#### Step 2: Confirm CI / Deploy Candidate green
- [ ] CI workflow green on latest commit
- [ ] Deploy Candidate workflow green on latest commit

#### Step 3: Deploy Worker
```bash
npm run deploy  # or via Actions workflow
```

#### Step 4: Run Live Worker Verification
```bash
node scripts/verify-live-worker.mjs
```
Expected output: ✅ All 15 markers present

#### Step 5: Live Chain Verification (if applicable)
```bash
node scripts/verify-live-chain.mjs
```
(To be implemented if CairnGraph provides chain-level HTML rendering)

---

## Phase 2: UX Polish (Low-Risk Only)

### Planned features:
- [ ] Visible "selected node" status text
- [ ] Keyboard hints/help panel
- [ ] Inspector empty state message
- [ ] Graph legend for node visualization states:
  - `selected` — highlighted blue
  - `neighbor` — green ring
  - `blast-root` — red fill, pink stroke
  - `blast-affected` — orange fill, orange stroke
  - `dim-unaffected` — reduced opacity

### New test markers:
- `graph-legend` — legend container
- `selected-node-status` — status text
- `keyboard-hints` — help panel
- `inspector-empty-state` — "no node selected" message

### Tests to update:
```bash
tests/html-renderer.test.ts
  - Verify normal HTML includes: explorer + zoom + inspector + legend + status
  - Verify blast-radius HTML includes: blast-summary + toggle + overlay
  - Confirm no undefined appears
```

---

## Phase 2 Implementation Checklist

### Files to modify:
- [ ] `packages/renderer/src/html.ts`
  - Add graph legend section
  - Add selected node status text
  - Add keyboard hints panel
  - Add inspector empty state

- [ ] `tests/html-renderer.test.ts`
  - Add assertions for new markers
  - Test legend, status, hints rendering

### Testing:
- [ ] `npm run check` passes
- [ ] `npm test` passes (30/30)
- [ ] `npm run build` succeeds

### CI/Deploy:
- [ ] CI workflow green
- [ ] Deploy Candidate green
- [ ] Worker deployed
- [ ] `node scripts/verify-live-worker.mjs` passes

---

## v1.1 Final Gate

**Do not proceed to v1.1 final release until:**
- [x] v1.1-alpha.1 through alpha.4 complete and green
- [ ] v1.1-beta Phase 1 live verification complete
- [ ] v1.1-beta Phase 2 polish complete
- [ ] Live Worker verified with all markers
- [ ] No additional changes needed

---

## Preserved in v1.1:
✅ Standalone `/render/html` endpoint  
✅ Standalone `/render/blast-radius/html` endpoint  
✅ Payload provider contract  
✅ CairnStone V5 live provider integration  
✅ SVG graph explorer  
✅ Zoom/pan/reset controls  
✅ Blast radius overlay  
✅ Evidence inspector  
✅ No external frontend framework (vanilla JS)  
✅ No canvas dependency  
✅ No new build dependencies  

---

## Marker Checklist (Live Verification)

### Graph Explorer Baseline:
- [ ] `graph-canvas` — SVG viewport
- [ ] `zoom-in` — Zoom in button
- [ ] `zoom-out` — Zoom out button
- [ ] `reset-view` — Reset view button

### Graph Filtering:
- [ ] `node-search` — Node search input
- [ ] `edge-filter` — Edge type filter select
- [ ] `neighborhood-filter` — Neighborhood toggle

### Blast Radius (v1.1-alpha.3):
- [ ] `blast-summary` — Summary panel
- [ ] `blast-toggle` — Overlay toggle
- [ ] `dim-toggle` — Dim unaffected toggle

### Evidence Inspector (v1.1-alpha.4):
- [ ] `evidence-inspector` — Inspector container
- [ ] `inspector-node-id` — Node ID field
- [ ] `copy-node-id` — Copy button
- [ ] `copy-evidence-json` — JSON copy button
- [ ] `inspector-details` — Collapsible details

### Phase 2 Polish Markers (Pending):
- [ ] `graph-legend` — Legend container
- [ ] `selected-node-status` — Status text
- [ ] `keyboard-hints` — Help panel
- [ ] `inspector-empty-state` — Empty message
