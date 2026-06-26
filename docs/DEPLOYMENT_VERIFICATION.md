# CairnGraph Deployment Verification

## Preview deployment

Worker URL:

```text
https://cairngraph-worker.jaredtechfit.workers.dev/
```

Verification status:

```text
verified manually by Jared
```

Verified endpoints:

```text
GET /health
GET /manifest
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
```

Next verification targets:

```text
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

Next phase:

```text
Phase 3A: fixture-backed live endpoint verification
```
