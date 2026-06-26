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

## v1.0 direction

CairnGraph v1.0 turns the deployed payload-first Worker into a live CairnStone graph navigation service.

Current v1 work:

- live CairnStone HTTP client scaffold
- Worker live-provider wiring
- live chain endpoint scaffold pending CI verification
- v1 architecture contract
- v1 API contract
- v1 roadmap

The payload-first Worker remains stable while the live provider is enabled only when runtime configuration exists.

## Repository status

This repo is the new home for the CairnGraph roadmap, specs, engine scaffold, renderer scaffold, blast-radius engine, timeline engine, and Cloudflare Worker adapter.
