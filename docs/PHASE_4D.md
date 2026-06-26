# v1.1-alpha.4: Source/Ref Inspector and Stone Detail Drawer

**Status:** Pending CI verification  
**Commit:** (will be updated after push)

## Overview

v1.1-alpha.4 upgrades the selected evidence panel into a comprehensive structured inspector for examining stone, ref, raw source, and GitHub evidence. This makes the evidence panel far more useful for debugging and understanding node relationships in the graph.

## Implementation

### 1. Structured Evidence Inspector

The selected evidence panel now displays:

- **Node ID**: Unique identifier with copy button
- **Stone Hash**: If present, with copy button for quick reference
- **Ref ID**: CairnStone ref identifier with copy button
- **Raw Key**: R2 object key if available
- **Source URL**: GitHub file link with target="_blank" safety
- **Line Range**: Start-end lines if present (e.g., 1-80)
- **Evidence JSON**: Collapsible details block for full evidence data

### 2. Action Buttons

Deterministic copy-to-clipboard buttons for:

- `copy-node-id`: Quick copy of the node identifier
- `copy-stone-hash`: Copy stone hash for chain lookups
- `copy-ref-id`: Copy ref ID for source navigation
- `copy-evidence-json`: Copy full evidence object as JSON

**Clipboard Strategy:**
- Primary: Uses `navigator.clipboard` API (modern browsers)
- Fallback: Document `execCommand('copy')` for older browsers
- UX: Button shows "copied!" briefly on success

### 3. CSS Styling

New classes for the inspector UI:

- `.evidence-inspector`: Main container with grid layout
- `.inspector-field`: Flex row for label + value + buttons
- `.inspector-label`: Consistent label width
- `.inspector-value`: Monospace font for identifiers
- `.inspector-button`: Styled action buttons with hover state
- `.inspector-details`: Details/summary collapsible block

### 4. Markers for Tests

All components include deterministic data attributes:

- `id="evidence-inspector"`: Main inspector container
- `id="inspector-node-id"`: Node ID value display
- `id="inspector-stone-hash"`: Stone hash value display (if present)
- `id="inspector-ref-id"`: Ref ID value display (if present)
- `id="inspector-raw-key"`: Raw key value display (if present)
- `id="inspector-source-url"`: Source URL link (if present)
- `class="copy-node-id"`: Copy node ID button
- `class="copy-stone-hash"`: Copy stone hash button
- `class="copy-ref-id"`: Copy ref ID button
- `class="copy-evidence-json"`: Copy evidence JSON button
- `<details>`: Standard HTML details for collapsible JSON

## Preserved Behavior

✅ Standalone `/render/html` endpoint  
✅ Standalone `/render/blast-radius/html` endpoint  
✅ Graph explorer with SVG topology  
✅ Zoom in/out and reset view controls  
✅ Drag-to-pan and touch pan support  
✅ Node search by id/label/kind/evidence  
✅ Kind filter (stone, head, ref, raw_source, file)  
✅ Grounding filter (grounded, unresolved)  
✅ Edge type filter (contains, expands_to, etc.)  
✅ Neighborhood mode (selected node + edges)  
✅ Blast radius overlay when available  
✅ Blast toggle and dim unaffected toggle  
✅ Node selection sync between graph and cards  

## Testing

All existing tests pass with new assertions for:

- Inspector markers present in HTML
- Copy buttons exist with correct classes
- Graph explorer markers still present
- Zoom/pan markers still present
- Blast overlay markers present in blast-radius HTML
- No "undefined" in output

Run tests:

```bash
npm run check  # TypeScript
npm test       # All 30 tests
```

## Files Changed

- `packages/renderer/src/html.ts`: Added inspector styles, functions, and marker IDs
- `tests/html-renderer.test.ts`: Enhanced test assertions for new functionality

## Next Steps

After CI verification (green):

1. Move to v1.1-beta planning
2. Consider: multi-chain navigation, live chain explorer polish, release candidate UX docs
3. Do not proceed to v1.1-beta until v1.1-alpha.4 CI is fully green

## Technical Notes

- No new dependencies introduced
- Uses only native HTML/CSS/JavaScript
- Clipboard fallback ensures broad browser compatibility
- Inspector generated client-side from embedded graph JSON
- All existing graph explorer functionality untouched
- Evidence JSON included in collapsible details for power users
