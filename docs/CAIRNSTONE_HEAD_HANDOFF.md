# CairnStone HEAD Handoff

CairnGraph has strict beta live-provider verification green.

## Current live URLs

- Worker: https://cairngraph-worker.jaredtechfit.workers.dev/
- CairnStone V5 provider: https://cairnstone-v5.jaredtechfit.workers.dev

## Required graph-side sequence

1. Get cairngraph chain manifest
2. Identify current HEAD
3. Create deployed v1 orientation stone
4. Link orientation stone to relevant verification/status stones
5. Set deployed v1 orientation stone as HEAD only if it is intended to be canonical
6. Re-read chain manifest
7. Confirm HEAD actually changed

## Orientation stone specification

**Title:** `cairngraph v1 deployed orientation`

**Author:** Jared Edwards

**Chain:** `cairngraph`

**Content should include:**

- Live Worker URL
- Live CairnStone V5 provider URL
- Strict verification status
- Live chain endpoint status
- Interactive HTML shell status
- Final release checklist status
- Repo link

**Example:**

```
CairnGraph v1 strict beta is live-provider verified.

Live Worker:
https://cairngraph-worker.jaredtechfit.workers.dev/

Live CairnStone V5 provider:
https://cairnstone-v5.jaredtechfit.workers.dev

Verified:
- strict Live Provider Config green
- strict Live Chain Verification green
- /health reports cairnstone-v5 as configured
- /graph/chain/cairngraph returns live graph JSON
- /graph/chain/cairngraph/html returns interactive live graph HTML

Repo:
https://github.com/nothinginfinity/cairngraph

Remaining before final:
- confirm final checklist commit green
- create v1.0.0 tag
```

## HEAD rule

Do not infer HEAD from timestamps.
Use the chain manifest and explicit HEAD marker.

Only set this stone as HEAD if it is the canonical current orientation.
After setting HEAD, re-read the chain manifest and confirm the returned HEAD hash equals the new orientation stone hash.
