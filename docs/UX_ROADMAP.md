# CairnGraph UX Roadmap

## Current Status: v1.1-beta (Live Verification) 🟡

---

## ✅ Complete & Verified

### v1.0.0 — Graph Baseline
**Status:** Released & Live  
**Features:**
- Standalone `/render/html` endpoint
- CairnGraph from manifest
- Grounding report integration
- Node card list (sidebar)
- Metrics panel

**Verified on:** https://cairngraph-worker.jaredtechfit.workers.dev/

---

## ✅ v1.1 Feature Phases

### v1.1-alpha.1 — Graph Explorer UX ✅
**Status:** Complete & Merged  
**Date:** 2026-06-26  
**What:**
- Embedded SVG graph explorer
- Node selection & sync
- Edge type filtering
- Selected-neighborhood isolation mode

**Tests:** 30/30 passing

---

### v1.1-alpha.2 — Zoom and Pan Controls ✅
**Status:** Complete & Merged  
**Date:** 2026-06-26  
**What:**
- Zoom in/out buttons
- Reset view button
- Dynamic SVG viewBox calculation
- Drag-to-pan with touch support

**Tests:** 30/30 passing

---

### v1.1-alpha.3 — Blast-radius Visual Overlay ✅
**Status:** Complete & Merged  
**Date:** 2026-06-26  
**What:**
- Blast radius summary panel
- Blast overlay toggle (show/hide)
- Dim unaffected nodes toggle
- Visual classes: `.blast-root`, `.blast-affected`, `.dim-unaffected`
- Blast edge highlighting

**Tests:** 30/30 passing

---

### v1.1-alpha.4 — Source/Ref Inspector and Stone Detail Drawer ✅
**Status:** Complete & Merged  
**Date:** 2026-06-26  
**What:**
- Structured evidence inspector panel
- Node ID display + copy button
- Stone hash display + copy button
- Ref ID display + copy button
- Raw key display
- Source URL with GitHub links
- Line range display
- Collapsible Evidence JSON with copy button
- Copy-to-clipboard utilities (native API + fallback)

**Tests:** 30/30 passing

---

### v1.1-beta — Live UX Verification & Polish 🟡
**Status:** Phase 1 — Live Verification Setup (in progress)  
**Date:** Started 2026-06-26  
**What (Phase 1):**
- ✅ `scripts/verify-live-worker.mjs` — 15-marker live verification
- ✅ `docs/V1_1_BETA_CHECKLIST.md` — Complete workflow checklist
- ✅ `docs/PHASE_4E.md` — Phase documentation & gates

**Phase 2 (Planned — Low-Risk Polish):**
- [ ] Graph legend (selected, neighbor, blast root, blast affected, dim)
- [ ] Selected node status text
- [ ] Keyboard hints help panel
- [ ] Inspector empty state message
- [ ] Update tests for new markers
- [ ] CI gate: all tests pass
- [ ] Deploy gate: live verification green

**Next Steps:**
1. ✅ Local: `npm run check` + `npm test` (expect pass)
2. ✅ CI: Await workflow green
3. 🔄 Deploy Worker
4. 🔄 Run: `node scripts/verify-live-worker.mjs`
5. 🔄 Phase 2 (if requested)

**Tests:** 30/30 passing (local, awaiting deploy to verify live)

---

## 🟡 In Progress

None currently — awaiting live Worker deployment.

---

## 🔵 Not Yet Started

### v1.2 — Multi-Chain Navigation
**Planned features:**
- Chain selector dropdown
- Switch between multiple chains in one view
- Cross-chain edge visualization
- Chain metadata display

---

### v1.3 — Timeline & Event Timeline View
**Planned features:**
- Timeline package finalization
- Event-based navigation
- Temporal blast radius analysis

---

### v2.0 — Advanced Analytics (Post-release)
**Planned features:**
- Dependency graph statistics
- Change impact prediction
- Automated changelog generation

---

## Preserved in All Phases

✅ **Core:**
- Standalone `/render/html` endpoint
- `/render/blast-radius/html` for isolated blast views
- No breaking API changes
- No external frontend frameworks (vanilla JS only)
- No canvas or GPU dependencies

✅ **Provider:**
- CairnStone V5 live provider integration
- Graph engine from chain manifest
- Grounding report system

✅ **Build:**
- TypeScript + Node.js
- No new dependencies for v1.1
- ESM modules throughout

---

## Testing & Verification

### Local (npm):
```bash
npm run check    # TypeScript
npm test         # All tests
npm run build    # Bundle check
```

### Live (after deploy):
```bash
node scripts/verify-live-worker.mjs    # 15 markers
node scripts/verify-live-chain.mjs     # (if available)
```

### CI/CD Gates:
- ✅ CI workflow green before deploy
- ✅ Deploy Candidate green before worker deploy
- 🔄 Live verification script passes after deploy

---

## Release Strategy

**v1.0.0** — Released to GitHub releases  
**v1.1-alpha.1 through alpha.4** — Development phases, not tagged  
**v1.1-beta** — Live verification & polish (current)  
**v1.1 final** — Tagged release after Phase 1 & 2 complete and live-verified  

**Gate:** Do not tag v1.1 until live verification script returns 0 exit code.

---

## Marker Checklist (Live Verification)

**Current (v1.1-alpha.1 through alpha.4):** 15 markers  
**Phase 2 additions:** +4 markers (legend, status, hints, empty state)

See `docs/V1_1_BETA_CHECKLIST.md` for complete list and Phase 2 details.

---

## Resources

- **ARCHITECTURE.md** — System design & graph model
- **ROADMAP.md** — Development priorities
- **PHASE_4E.md** — v1.1-beta workflow & gates
- **V1_1_BETA_CHECKLIST.md** — Phase 1 & 2 checklist
- **Live Worker:** https://cairngraph-worker.jaredtechfit.workers.dev/
- **CairnStone Provider:** https://cairnstone-v5.jaredtechfit.workers.dev/
