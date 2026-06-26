# Phase 3C: CairnGraph v1 Live Provider Start

Phase 3C begins CairnGraph v1.0.

Implemented:

```text
packages/adapters/src/cairnstone-http-client.ts
tests/cairnstone-http-client.test.ts
docs/V1_ARCHITECTURE.md
docs/V1_API_CONTRACT.md
docs/V1_ROADMAP.md
workers/cairngraph-worker/src/index.ts
```

Purpose:

```text
create and wire the live CairnStone V5 client seam without breaking the deployed payload-first Worker
```

Status:

```text
v1.0-alpha.1: live HTTP client scaffold committed
v1.0-alpha.2: Worker provider wiring committed
```

Behavior:

```text
without CAIRNSTONE_V5_BASE_URL -> cairnstone-v5 provider status is scaffold
with CAIRNSTONE_V5_BASE_URL -> cairnstone-v5 provider status is configured
```

Next checkpoint:

```text
v1.0-alpha.3: add live chain convenience endpoints
GET /graph/chain/:chain
GET /graph/chain/:chain/html
```
