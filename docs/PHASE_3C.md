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
v1.0-alpha.1: live HTTP client scaffold committed and green after type import fix
v1.0-alpha.2: Worker provider wiring committed and green after type import fix
v1.0-alpha.3: live chain convenience endpoints added
```

Behavior:

```text
without CAIRNSTONE_V5_BASE_URL -> cairnstone-v5 provider status is scaffold
with CAIRNSTONE_V5_BASE_URL -> cairnstone-v5 provider status is configured
```

New v1.0-alpha.3 endpoints:

```text
GET /graph/chain/:chain
GET /graph/chain/:chain/html
```

The new endpoints use the live CairnStone V5 provider and fail safely when the provider is not configured.

Next checkpoint:

```text
v1.0-alpha.4: interactive HTML graph shell
```
