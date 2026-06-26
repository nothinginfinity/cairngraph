# Phase 3G: v1.0-beta Live Provider Configuration

Phase 3G prepares strict live-provider verification.

Added:

```text
scripts/check-live-provider-config.mjs
npm run verify:provider-config
.github/workflows/live-provider-config.yml
docs/BETA_PROVIDER_CONFIG.md
```

Purpose:

```text
prove whether the deployed Worker reports cairnstone-v5 as scaffold or configured
```

Strict beta mode:

```text
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=true
```

This mode fails until the Worker has a valid `CAIRNSTONE_V5_BASE_URL` runtime variable.

Current honest status:

```text
live provider configuration scaffold added
actual CairnStone V5 base URL still required
no CairnStone HEAD update claimed
```
