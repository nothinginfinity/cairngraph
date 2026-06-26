# CairnGraph Worker

Cloudflare Worker surface for CairnGraph.

Phase 2C adds the first browser-ready HTML renderer. Deploy is not required yet.

Implemented endpoints:

- `GET /health`
- `GET /manifest`
- `POST /graph/from-manifest`
- `POST /graph/from-v5`
- `POST /graph/from-provider`
- `POST /render/mermaid`
- `POST /render/html`

Providers:

- `payload`: implemented. Accepts manifests and stone payloads supplied in the request body.
- `cairnstone-v5`: scaffold. Defines the boundary for future live CairnStone V5 fetching.

Phase 2C HTML output includes:

- grounding report metrics
- node list
- selected-node evidence inspection
- incoming/outgoing edges
- optional embedded graph JSON

Planned endpoints:

- `GET /graph/chain/:chain`
- `GET /graph/stone/:hash`
- `GET /graph/ref/:ref`
- `GET /graph/blast-radius/:hash`
- `GET /render/svg`

Phase 2D should add an SVG/static graph projection or begin blast-radius rendering.
