# CairnGraph Worker

Cloudflare Worker surface for CairnGraph.

Phase 2A is an API scaffold only. Deploy is not required yet.

Implemented endpoints:

- `GET /health`
- `GET /manifest`
- `POST /graph/from-manifest`
- `POST /graph/from-v5`
- `POST /render/mermaid`

Planned endpoints:

- `GET /graph/chain/:chain`
- `GET /graph/stone/:hash`
- `GET /graph/ref/:ref`
- `GET /graph/blast-radius/:hash`
- `GET /render/html`
- `GET /render/svg`

Phase 2B should decide whether the Worker fetches live CairnStone V5 data directly or stays as a pure render/adapter service that receives payloads from MCP callers.
