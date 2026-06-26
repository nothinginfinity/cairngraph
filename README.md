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

## Phase status

Phase 1A implemented the first pipeline:

CairnStone chain manifest -> CairnGraph model -> Mermaid flowchart

Phase 1B added ref-level grounding.

Phase 1C added the CairnStone V5 adapter.

Phase 1D added grounding completeness navigation.

Phase 2A added the Worker API scaffold.

Phase 2B added the graph provider abstraction.

Phase 2C adds the browser-ready HTML renderer:

- renderHtmlGraph
- POST /render/html
- click-to-inspect evidence panel
- grounding metrics
- source links

Deploy is not required yet.

## Implemented files

- packages/graph-engine/src/types.ts
- packages/graph-engine/src/from-chain-manifest.ts
- packages/graph-engine/src/navigation.ts
- packages/graph-engine/src/grounding-report.ts
- packages/adapters/src/cairnstone-v5.ts
- packages/adapters/src/graph-provider.ts
- packages/renderer/src/mermaid.ts
- packages/renderer/src/html.ts
- workers/cairngraph-worker/src/index.ts
- examples/loop-engineer-template-review.manifest.json
- tests/graph-engine.test.ts
- tests/cairnstone-v5-adapter.test.ts
- tests/grounding-navigation.test.ts
- tests/graph-provider.test.ts
- tests/html-renderer.test.ts
- tests/worker-api.test.ts

## Repository status

This repo is the new home for the CairnGraph roadmap, specs, engine scaffold, renderer scaffold, blast-radius engine, timeline engine, and Cloudflare Worker adapter.
