# Phase 3C: CairnGraph v1 Live Provider Start

Phase 3C begins CairnGraph v1.0.

Implemented in this checkpoint:

```text
packages/adapters/src/cairnstone-http-client.ts
tests/cairnstone-http-client.test.ts
docs/V1_ARCHITECTURE.md
docs/V1_API_CONTRACT.md
docs/V1_ROADMAP.md
```

Purpose:

```text
create the live CairnStone V5 client seam without breaking the deployed payload-first Worker
```

Important status:

```text
live HTTP client scaffold committed
Worker wiring not yet committed
payload-first Worker remains the stable deployed service
```

Next checkpoint:

```text
v1.0-alpha.2: wire Worker to use the live client when runtime config exists
```
