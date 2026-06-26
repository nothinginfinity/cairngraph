# CairnGraph

CairnGraph is the visual graph layer for CairnStone.

It turns CairnStone chains, HEAD stones, refs, receipts, graph edges, GitHub source files, verification events, and blast-radius evidence into grounded, navigable diagrams.

CairnGraph is not just a diagram renderer. It is intended to become the visual operating system for the CairnStone graph.

## Core promise

Every visible node should be traceable back to evidence.

A CairnGraph view should answer:

- What stone or ref is this node grounded in?
- Which chain and HEAD does it belong to?
- Which files, commits, tests, receipts, and graph edges support it?
- What is the blast radius if this node changes?
- Can I navigate from the diagram to the exact source window?

## Phase 1 status

Phase 1A implemented the first pipeline:

CairnStone chain manifest -> CairnGraph model -> Mermaid flowchart

Phase 1B adds ref-level grounding:

- compressed refs become `ref` nodes
- stones link to refs with grounded containment edges
- refs carry `ref_id`, path, line range, raw key, keywords, preview, and optional GitHub line URL
- tests cover ref creation and Mermaid rendering

Implemented files:

- packages/graph-engine/src/types.ts
- packages/graph-engine/src/from-chain-manifest.ts
- packages/renderer/src/mermaid.ts
- examples/loop-engineer-template-review.manifest.json
- tests/graph-engine.test.ts
- docs/PHASE_1A.md
- docs/PHASE_1B.md

## Initial goals

- Visualize any CairnStone chain manifest.
- Resolve HEAD before rendering.
- Prefer grounded nodes over inferred nodes.
- Carry exact source refs into every diagram artifact.
- Support blast-radius, timeline, architecture, file, function, ref, and BytePlane views.
- Provide renderers for Mermaid first, then interactive HTML/SVG/Canvas graph views.

## Repository status

This repo is the new home for the CairnGraph roadmap, specs, engine scaffold, renderer scaffold, blast-radius engine, timeline engine, and Cloudflare Worker adapter.
