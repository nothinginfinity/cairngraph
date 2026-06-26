# CairnGraph Deployment Verification

## Preview deployment

Worker URL:

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Verification status:

```text
verified manually by Jared
Live Verification workflow green
```

Verified endpoints:

```text
GET /health
GET /manifest
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

Deployment mode:

```text
payload-first
workers.dev preview
no live CairnStone V5 fetch credentials
no direct CairnStone V5 provider enabled
```

Current Worker purpose:

```text
accept graph payloads
build CairnGraph models
render Mermaid
render HTML
compute blast radius
render blast-radius HTML
support fixture-backed live verification
```

Live verification command:

```text
npm run verify:live
```

GitHub workflow:

```text
Live Verification
```

Next phase:

```text
Phase 3B: re-stone repository and set deployed CairnGraph orientation as HEAD
```
