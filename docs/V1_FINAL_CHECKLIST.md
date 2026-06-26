# CairnGraph v1 Final Checklist

Strict beta live-provider verification is green.

## Verified baseline

```text
v1.0-alpha.1 green
v1.0-alpha.2 green
v1.0-alpha.3 green
v1.0-alpha.4 green
v1.0-alpha.5 deployed and live verified
Phase 3F safe live-chain verification green
Phase 3G safe provider-config verification green
Phase 3H strict beta runbook green
Strict Live Provider Config green
Strict Live Chain Verification green
```

## Live URLs

Worker:
https://cairngraph-worker.jaredtechfit.workers.dev/

CairnStone V5 provider:
https://cairnstone-v5.jaredtechfit.workers.dev

## Verification endpoints

- `/health` reports `cairnstone-v5` as configured
- `/graph/chain/cairngraph` returns live graph JSON
- `/graph/chain/cairngraph/html` returns interactive live graph HTML

## Before v1.0 final tag

- [ ] confirm latest CI green
- [ ] confirm latest Deploy Candidate green
- [ ] confirm Deploy Worker green
- [ ] confirm Live Verification green
- [ ] confirm strict Live Provider Config green
- [ ] confirm strict Live Chain Verification green
- [ ] record deployed v1 orientation in CairnStone
- [ ] set CairnStone HEAD only after successful graph confirmation
- [ ] create v1.0.0 final tag

## Status

Not yet claimed until completed:

- v1.0 final released
- CairnStone HEAD updated
