# CairnGraph v1 Architecture

CairnGraph v1 turns the deployed payload-first Worker into a live CairnStone graph navigation service.

## Current stable foundation

```text
Payload manifest
  -> provider boundary
  -> CairnGraph model
  -> grounding navigation
  -> grounding report
  -> Mermaid, HTML, blast-radius HTML
```

## v1 target

```text
chain / stone / ref request
  -> CairnGraph Worker
  -> CairnStone V5 provider
  -> live chain manifest
  -> optional stone payloads
  -> grounded CairnGraph model
  -> interactive graph view
```

## Provider boundary

The provider boundary remains the central architectural seam.

Implemented:

- payload provider
- CairnStone V5 provider interface
- configurable CairnStone HTTP client scaffold

Next wiring:

- Worker creates a CairnStone HTTP client from runtime configuration
- `provider: cairnstone-v5` uses that client
- existing payload endpoints continue to work unchanged

## Renderer path

Current renderers:

- Mermaid
- static HTML graph view
- static blast-radius HTML view

v1 renderers:

- interactive HTML graph shell
- click-to-expand node navigation
- highlighted blast-radius subgraph
- source/ref deep links
- graph search

## Deployment posture

v1 should stay safe by default:

- payload provider always enabled
- live CairnStone provider disabled unless configured
- no live fetch credentials required for basic operation
- live provider can be added without breaking existing endpoints
