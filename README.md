# CairnGraph

CairnGraph is the visual graph layer for CairnStone.

It turns CairnStone chains, HEAD stones, refs, receipts, graph edges, GitHub source files, verification events, and blast-radius evidence into grounded, navigable diagrams.

CairnGraph is not just a diagram renderer. It is intended to become the visual operating system for the CairnStone graph.

## Live preview

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Verified manually:

```text
GET /health
GET /manifest
```

## Core promise

Every visible node should be traceable back to evidence.

A CairnGraph view should answer:

- What stone or ref is this node grounded in?
- Which chain and HEAD does it belong to?
- Which files, commits, tests, receipts, and graph edges support it?
- What is the blast radius if this node changes?
- Can I navigate from the diagram to the exact source window?

## Phase status

Phase 1A implemented the first pipeline.

Phase 1B added ref-level grounding.

Phase 1C added the CairnStone V5 adapter.

Phase 1D added grounding completeness navigation.

Phase 2A added the Worker API scaffold.

Phase 2B added the graph provider abstraction.

Phase 2C added the browser-ready HTML renderer.

Phase 2D added blast-radius view rendering.

Phase 2E prepared the deploy candidate.

Phase 2F deployed the first payload-first Worker preview.

Phase 3A will verify live POST endpoints with fixture payloads.

## Repository status

This repo is the new home for the CairnGraph roadmap, specs, engine scaffold, renderer scaffold, blast-radius engine, timeline engine, and Cloudflare Worker adapter.
