# Phase 2C Implementation Note

Phase 2C adds the first browser-ready HTML renderer.

Deploy is not required yet.

Implemented:

- `renderHtmlGraph(graph, options)`
- `POST /render/html`
- optional `html` field from graph-producing Worker endpoints
- HTML renderer tests
- Worker HTML endpoint tests

HTML view includes:

- grounding report metrics
- node list
- selected-node evidence panel
- incoming and outgoing edge inspection
- source links when available
- optional embedded graph JSON

Current flow:

```text
CairnGraph model
  ↓
grounding report
  ↓
HTML document
  ↓
click node
  ↓
inspect evidence and navigation edges
```

Next target:

Phase 2D should add either:

- SVG/static graph projection, or
- blast-radius view rendering.

The recommended next target is blast-radius view rendering because it is core to CairnGraph's purpose.
