# Phase 3B: Live Verified CairnStone Graph Checkpoint

Phase 3B records the first live-verified CairnGraph deployment and prepares the CairnStone graph HEAD update.

## Live Worker

```text
https://cairngraph-worker.jaredtechfit.workers.dev
```

## Verification status

```text
Live Verification workflow green
```

Verified targets:

```text
GET /health
GET /manifest
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

## Deployment mode

```text
payload-first Worker preview
workers.dev enabled
no live CairnStone V5 provider credentials
no direct CairnStone fetch path enabled
```

## Current capability checkpoint

CairnGraph can now:

```text
accept CairnStone-shaped manifest payloads
build grounded graph models
expand refs into raw/source navigation targets
produce grounding reports
render Mermaid
render browser-ready HTML
compute blast radius
render blast-radius HTML
verify deployed Worker endpoints with fixture payloads
```

## Graph hygiene target

After this note lands:

```text
re-stone the repo under chain cairngraph
create a new orientation stone
link implementation files and docs
set the new orientation as HEAD
```

## Next phase

```text
Phase 3C: live CairnStone V5 provider integration plan
```
