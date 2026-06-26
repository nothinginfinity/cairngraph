# v1.0-beta Readiness

CairnGraph is ready for strict beta configuration.

Verified baseline:

```text
v1.0-alpha.1 green
v1.0-alpha.2 green
v1.0-alpha.3 green
v1.0-alpha.4 green
v1.0-alpha.5 deployed and live verified
Phase 3F safe live-chain verification green
Phase 3G safe provider-config verification green
Phase 3H strict beta runbook green
```

Live Worker:

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Strict beta blocker:

```text
CAIRNSTONE_V5_BASE_URL
```

Strict beta unlock sequence:

```text
set CAIRNSTONE_V5_BASE_URL
redeploy Worker
run Live Provider Config with require_live_provider=true
run Live Chain Verification with require_live_provider=true
```

Not yet claimed:

```text
live CairnStone data verified
strict beta complete
CairnStone HEAD updated
```
