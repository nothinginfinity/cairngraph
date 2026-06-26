# Phase 3A: Fixture-Backed Live Verification

Phase 3A verifies the deployed Worker with real CairnStone-shaped payloads.

Live Worker:

```text
https://cairngraph-worker.jaredtechfit.workers.dev
```

## Added tooling

```text
scripts/verify-live-worker.mjs
npm run verify:live
.github/workflows/live-verification.yml
```

## Verified targets

```text
GET /health
GET /manifest
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

## Fixture

```text
examples/loop-engineer-template-review.manifest.json
```

## Local verification

```text
npm install --package-lock=false
npm run candidate
npm run verify:live
```

Override Worker URL:

```text
CAIRNGRAPH_WORKER_URL=https://cairngraph-worker.jaredtechfit.workers.dev npm run verify:live
```

## GitHub verification

Run the GitHub Actions workflow:

```text
Live Verification
```

The workflow accepts a `worker_url` input and runs the same fixture-backed checks.

## Success criteria

```text
HTTP 200 for all targets
/render/html returns text/html
/graph/blast-radius returns impacted nodes and edges
/render/blast-radius/html returns blast-radius HTML
responses contain chain/ref/evidence markers
```

## Next phase

After Live Verification is green:

```text
Phase 3B: re-stone the repository and mark deployed CairnGraph orientation as HEAD
```
