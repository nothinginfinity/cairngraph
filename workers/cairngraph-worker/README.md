# CairnGraph Worker

Cloudflare Worker surface for CairnGraph.

Phase 2B introduces the provider abstraction. Deploy is not required yet.

Implemented endpoints:

- `GET /health`
- `GET /manifest`
- `POST /graph/from-manifest`
- `POST /graph/from-v5`
- `POST /graph/from-provider`
- `POST /render/mermaid`

Providers:

- `payload`: implemented. Accepts manifests and stone payloads supplied in the request body.
- `cairnstone-v5`: scaffold. Defines the boundary for future live CairnStone V5 fetching.

Planned endpoints:

- `GET /graph/chain/:chain`
- `GET /graph/stone/:hash`
- `GET /graph/ref/:ref`
- `GET /graph/blast-radius/:hash`
- `GET /render/html`
- `GET /render/svg`

Phase 2C should add the first browser-ready HTML renderer while the live CairnStone V5 fetch client remains behind the provider boundary.
