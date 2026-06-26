# CairnGraph

CairnGraph is the visual graph layer for CairnStone.

It turns CairnStone chains, HEAD stones, refs, receipts, graph edges, GitHub source files, verification events, and blast-radius evidence into grounded, navigable diagrams.

CairnGraph is not just a diagram renderer. It is intended to become the visual operating system for the CairnStone graph.

## Live preview

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Verified:

```text
GET /health
GET /manifest
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

Live verification:

```text
npm run verify:live
```

## Core promise

Every visible node should be traceable back to evidence.

A CairnGraph view should answer:

- What stone or ref is this node grounded in?
- Which chain and HEAD does it belong to?
- Which files, commits, tests, receipts, and graph edges support it?
- What is the blast radius if this node changes?
- Can I navigate from the diagram to the exact source window?

## v1.0 direction

CairnGraph v1.0 turns the deployed payload-first Worker into a live CairnStone graph navigation service.

Current v1 work:

- live CairnStone HTTP client scaffold
- v1 architecture contract
- v1 API contract
- v1 roadmap

The payload-first Worker remains stable while the live provider is wired behind the existing provider boundary.

## Repository status

This repo is the new home for the CairnGraph roadmap, specs, engine scaffold, renderer scaffold, blast-radius engine, timeline engine, and Cloudflare Worker adapter.
