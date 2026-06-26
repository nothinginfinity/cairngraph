# Phase 2B Implementation Note

Phase 2B introduces the graph provider abstraction.

Deploy is not required yet.

Providers:

## Payload provider

Implemented.

Accepts request-provided data:

- CairnStone chain manifest
- optional CairnStone V5 stone payloads
- optional navigation flag

Builds:

- CairnGraph model
- optional grounding navigation

## CairnStone V5 provider

Scaffolded.

Defines the boundary for future live CairnStone V5 fetching:

- `getChainManifest(chain)`
- optional `getStone(hash)`

The Worker does not yet fetch live CairnStone V5 data directly. This is intentional.

## Worker API changes

Added:

- `POST /graph/from-provider`
- provider list in `GET /health`
- provider list in `GET /manifest`

## Next target

Phase 2C should add the first browser-ready HTML renderer so CairnGraph output can be inspected visually before deploying a live-fetching Worker.
