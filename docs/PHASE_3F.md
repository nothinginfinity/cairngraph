# Phase 3F: v1.0-beta Preparation

Phase 3F prepares CairnGraph for v1.0-beta.

Verified baseline:

```text
v1.0-alpha.1 green
v1.0-alpha.2 green
v1.0-alpha.3 green
v1.0-alpha.4 green
v1.0-alpha.5 deployed and live verified
Live Chain Verification green in safe default mode
```

Live Worker:

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Added in this checkpoint:

```text
scripts/verify-live-chain.mjs
npm run verify:live-chain
.github/workflows/live-chain-verification.yml
```

The live chain verifier supports two modes.

Default safe mode:

```text
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=false
```

This mode passes if the live provider safely rejects because it is not configured.

Configured provider mode:

```text
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=true
```

This mode requires the deployed Worker to report `cairnstone-v5` as configured and requires live chain JSON and HTML to return successfully.

Beta goals:

```text
configure live CairnStone V5 provider in preview
verify live chain endpoints against real CairnStone data
record deployed v1 orientation in CairnStone
clean up alpha doc churn
set a new CairnStone HEAD when graph tooling permits
```
