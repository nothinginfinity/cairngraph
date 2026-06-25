# CairnGraph Architecture

## System layers

```text
CairnStone V5
  ↓
CairnGraph Adapters
  ↓
CairnGraph Engine
  ↓
View Models
  ↓
Renderers
  ↓
Interactive Viewer / MCP / Worker API
```

## Core components

### Graph Engine

Normalizes chains, stones, refs, receipts, commits, and graph edges into a single graph model.

### Grounding Engine

Resolves every node to canonical evidence:

- chain
- HEAD
- stone hash
- source refs
- raw keys
- path and line ranges
- repo and commit
- receipts
- verification status

### Blast Radius Engine

Traverses graph edges and source relationships to compute affected nodes.

### Timeline Engine

Orders graph events by causality and graph relationships, not only timestamp.

### Renderer

Converts graph models into Mermaid, SVG, HTML, Canvas, D3, Cytoscape, ReactFlow, or other projections.

### Worker Adapter

Cloudflare Worker surface for graph generation, rendering, artifact access, and AI/agent workflows.

## Data flow

```text
chain name
  ↓
get chain manifest
  ↓
resolve HEAD
  ↓
load stones
  ↓
load refs
  ↓
load graph edges
  ↓
load receipts
  ↓
build CairnGraph model
  ↓
compute blast radius
  ↓
render selected view
  ↓
attach artifact / receipt
```

## Non-goals

CairnGraph should not replace CairnStone V5.

It should not own canonical storage, compression, or HEAD state. It visualizes and analyzes those systems.
