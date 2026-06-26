# Phase 2A Implementation Note

Phase 2A introduces the CairnGraph Worker API scaffold.

Deploy is not required yet.

Implemented endpoints:

- `GET /health`
- `GET /manifest`
- `POST /graph/from-manifest`
- `POST /graph/from-v5`
- `POST /render/mermaid`

The Worker currently accepts payloads and uses the existing library stack:

- graph engine
- CairnStone V5 adapter
- grounding navigation
- grounding report
- Mermaid renderer

Current flow:

```text
HTTP payload
  ↓
CairnGraph model
  ↓
optional navigation expansion
  ↓
grounding report
  ↓
optional Mermaid output
```

Phase 2B decision:

- pure payload-in renderer service
- or live CairnStone V5 fetching Worker

The safest next step is to keep the Worker pure until the CairnStone V5 REST/API boundary is stable.
