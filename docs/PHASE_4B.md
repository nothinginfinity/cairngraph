# PHASE 4B: v1.1-alpha.2 Graph Explorer Zoom and Pan Controls

## Overview

v1.1-alpha.2 extends the graph explorer UX from v1.1-alpha.1 with native SVG viewBox-based zoom and pan controls, enabling users to navigate complex graphs interactively without external dependencies.

## Implementation

### Viewport Management
- Added viewport state variables: `viewportX`, `viewportY`, `viewportW`, `viewportH`
- Base dimensions: 900×420 (matching the original graph canvas)
- Viewport is constrained to valid bounds and always remains within the base bounds

### Zoom Controls
Three native button controls manipulate the viewport:

1. **Zoom In** (`zoom-in` button)
   - Multiplies viewport width/height by 0.7 (30% reduction)
   - Centers zoom on the current viewport center
   - Increases detail level for dense graphs

2. **Zoom Out** (`zoom-out` button)
   - Multiplies viewport width/height by 1.43 (43% expansion)
   - Capped at base dimensions to avoid over-zooming
   - Helps context views of large graphs

3. **Reset View** (`reset-view` button)
   - Restores viewport to original: (0, 0, 900, 420)
   - One-click return to default framing

### Pan Support
Drag-based panning on the SVG background:
- Mouse drag: click and drag anywhere on the graph background
- Touch drag: equivalent support for mobile/tablet
- Automatically skips panning when clicking on nodes or text (avoids conflict with node selection)
- Pan is constrained: cannot pan beyond the valid graph bounds
- Scale-aware: pan distance scales with current viewport zoom level

### Dynamic ViewBox
The SVG viewBox attribute is computed dynamically on each render:
- Format: `viewBox="X Y W H"` where X, Y = viewport top-left, W, H = viewport dimensions
- Enables smooth zoom/pan without manipulating SVG DOM nodes
- Marker attribute `data-graph-viewport="enabled"` indicates viewport-aware SVG rendering

### Preserved Behavior
- Node selection: clicking graph nodes still selects them and updates evidence panel
- Node list sync: clicking list nodes updates graph selection
- Filters remain active during zoom/pan: search, node kind, grounding, edge type, neighborhood mode
- All existing topology and layout logic is unchanged

## Files Changed

**packages/renderer/src/html.ts**
- Added viewport state and functions: `resetViewport()`, `zoomIn()`, `zoomOut()`, `startPan()`, `doPan()`, `endPan()`
- Modified `renderGraphExplorer()` to use dynamic viewBox computation
- Added event listeners for zoom buttons and SVG pan handlers
- Updated help text to explain drag-to-pan functionality

**tests/html-renderer.test.ts**
- Added assertions for `zoom-in`, `zoom-out`, `reset-view` button markers
- Added assertion for `data-graph-viewport` SVG viewport marker
- Added assertion for pan help text: "Drag the background to pan"

**docs/PHASE_4B.md** (this file)
- Documents v1.1-alpha.2 design and implementation

## Contract Preservation

✅ `/render/html` remains standalone HTML with no external framework dependencies  
✅ Payload provider remains stable (no breaking changes to response contract)  
✅ CairnStone V5 live provider remains stable  
✅ No canvas dependency introduced  
✅ Pure SVG with native HTML5 `<svg>` viewBox attribute  
✅ No build-time dependencies added  

## Verification

Test assertions confirm:
- `zoom-in`, `zoom-out`, `reset-view` buttons render with correct IDs
- SVG contains `data-graph-viewport="enabled"` marker for viewport awareness
- Help text includes pan instruction

No Deploy Worker or Live Verification workflows required for this phase (UX-only change, no API modification).

## Next Phase

v1.1-alpha.3 could add:
- Keyboard shortcuts for zoom (e.g., `+`/`-` keys, arrow keys for pan)
- Scroll wheel zoom support (with shift modifier for pan)
- Fit-to-view button (auto-zoom to show all nodes)
- Graph minimap overlay
- Viewport history (undo/redo pan/zoom actions)

---

**Status:** Implemented and pending CI verification  
**Date:** 2026-06-26  
**Author:** Claude  
