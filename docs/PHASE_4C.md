# PHASE 4C: v1.1-alpha.3 Blast-radius Visual Overlay

## Overview

v1.1-alpha.3 adds visual impact-path visualization to the graph explorer, making CairnGraph explain which nodes and edges are affected by a blast-radius computation without requiring browser automation or external visualization libraries.

## Implementation

### Visual State Management

**Optional Blast Metadata**
- `BlastRadiusMetadata` type extends `HtmlRenderOptions` with blast computation results
- When present, enables blast-radius visual mode; when absent, renders normal graph
- Affected nodes/edges tracked from the filtered subgraph passed by `renderBlastRadiusHtml`

### CSS Classes and Visual Markers

Node styling:
- `.blast-root` – root node with dark red fill (#b91c1c) and soft accent stroke
- `.blast-affected` – impacted nodes with dark orange fill (#7c2d12) and orange stroke
- `.dim-unaffected` – unaffected nodes with reduced opacity (0.35) when dimming toggle enabled

Edge styling:
- `.blast-edge` – affected edges with red stroke (#ef4444) and full opacity
- Normal edges remain default styling

Node list cards:
- `.dim-unaffected` applies 35% opacity to unaffected cards when toggle is active
- `data-blast-affected="true|false"` marker on each node card for test assertion

Graph explorer controls:
- `.data-blast-overlay="enabled|disabled"` marker on graph section
- Shows/hides blast-specific controls based on metadata presence

### UI Controls (Conditional)

Blast controls only render when `blastMetadata` is present:

1. **Show Blast Overlay** (checked by default)
   - ID: `blast-toggle`
   - Toggles visibility of `blast-root`, `blast-affected`, and `blast-edge` classes
   - Preserves all other graph interaction

2. **Dim Unaffected Nodes** (unchecked by default)
   - ID: `dim-toggle`
   - Applies `.dim-unaffected` class to non-affected nodes
   - Works in both node list and graph explorer
   - Clarifies which nodes fall outside the blast radius

### Blast Summary Panel

- ID: `blast-summary`
- Renders only when `blastMetadata.ok === true`
- Shows: depth, direction (outgoing/incoming/both), impacted node/edge counts, risk score
- Inserted into header after title and description
- Styled with red border and dark background for visual prominence

### Selected Evidence Enhancement

When a blast-root node is selected:
- Selected evidence panel includes `<span class="badge blast-risk">BLAST ROOT</span>`
- Helps user identify the origin point of the impact analysis

### Preserved UX

✅ Node search, kind filter, grounding filter work unchanged  
✅ Edge type filter works during blast mode  
✅ Selected-neighborhood mode works with blast overlay  
✅ Zoom in/out/reset preserve viewport and affect affected/normal nodes equally  
✅ Pan behavior unchanged  
✅ Node selection sync between list and graph works  
✅ Evidence panel remains functional  

## Files Changed

**packages/renderer/src/html.ts**
- Added `BlastRadiusMetadata` type
- Extended `HtmlRenderOptions` to accept optional `blastMetadata`
- Added `blastSummaryPanel()` helper function
- Modified `renderNodeCard()` to include `data-blast-affected` marker
- Updated `renderGraphExplorer()` to apply blast CSS classes conditionally
- Added event listeners for blast-toggle and dim-toggle controls
- Integrated blast-affected node tracking and visual application

**packages/renderer/src/blast-radius-html.ts**
- Simplified to pass computed blast result as metadata to renderer
- Removed custom summary block implementation (now handled in renderer)
- Delegates all rendering to enhanced `renderHtmlGraph`

**tests/html-renderer.test.ts**
- Added second test: "renders blast-radius HTML with visual overlay"
- Test 1 asserts normal HTML has no blast markers (`data-blast-overlay="disabled"`)
- Test 2 asserts blast HTML includes all required markers and controls
- Both tests preserve existing UX assertions (zoom, pan, filters, etc.)

**docs/PHASE_4C.md** (this file)
- Documents v1.1-alpha.3 design and implementation

## Contract Preservation

✅ `/render/html` remains standalone HTML with optional metadata input  
✅ `/render/blast-radius/html` remains standalone HTML wrapper  
✅ Payload provider remains stable  
✅ CairnStone V5 live provider remains stable  
✅ No external frontend framework introduced  
✅ No canvas dependency  
✅ No new build dependencies  
✅ Pure CSS class-driven visual state  
✅ Backward compatible – normal graphs render identically to v1.1-alpha.2  

## Test Strategy

**Normal HTML render (no blast metadata):**
- Asserts `data-blast-overlay="disabled"`
- Asserts no `data-blast-affected="true"` appears
- Asserts no blast-specific controls appear
- Asserts all existing zoom/pan/filter markers still present

**Blast-radius HTML render (with metadata):**
- Asserts `data-blast-overlay="enabled"`
- Asserts `data-blast-affected` markers on node cards
- Asserts `blast-toggle` and `dim-toggle` controls exist
- Asserts `blast-summary` panel exists with metadata
- Asserts `blast-root` or `blast-affected` classes applied to graph nodes
- Asserts all existing UX still works (zoom, pan, filters, evidence)
- Asserts no "undefined" anywhere

## CSS-Driven Verification

Tests verify behavior without browser automation:
- Class names (`blast-root`, `blast-affected`, `dim-unaffected`, `blast-edge`) are deterministic
- Markers (`data-blast-overlay`, `data-blast-affected`, `data-blast-root`) are present/absent as expected
- Controls (`blast-toggle`, `dim-toggle`, `blast-summary`) only appear when appropriate

## Example: v1.1-alpha.3 in Action

**Normal /render/html with 5-node graph:**
```
[Graph explorer]
- all 5 nodes visible with standard styling
- no blast controls
- data-blast-overlay="disabled"
```

**Same graph via /render/blast-radius/html with root = node 1:**
```
[Blast Summary Panel]
⚡ Blast radius: depth 2 · direction both · impacted 3 nodes, 2 edges · risk score 8

[Graph explorer]
- node 1: dark red, "blast-root" class
- nodes 2,3: dark orange, "blast-affected" class
- nodes 4,5: normal styling
- edges 1→2, 1→3: red stroke, "blast-edge" class
- other edges: normal styling
- controls: [☑ show blast overlay] [☐ dim unaffected nodes]
- [Selected node 1 evidence]: <span class="badge blast-risk">BLAST ROOT</span>
```

## Next Phase

v1.1-alpha.4 scope (not started):
- Source and ref inspector (link to GitHub)
- Stone detail drawer (show stone metadata)
- Copy evidence payloads
- Enhanced blast-radius history/replay

---

**Status:** Implemented and pending CI verification  
**Date:** 2026-06-26  
**Author:** Claude  
