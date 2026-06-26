# CairnGraph v1 Roadmap

## v1.0-alpha.1

Status: complete and green after type import fix.

Scope:

- live CairnStone HTTP client scaffold
- v1 architecture contract
- v1 API contract
- live provider remains opt-in

## v1.0-alpha.2

Status: complete and green after type import fix.

Scope:

- wire Worker to create live CairnStone provider from runtime config
- keep payload provider as default
- add Worker tests for configured and unconfigured live provider states

## v1.0-alpha.3

Status: complete and green.

Scope:

- add live chain endpoint scaffold
- `GET /graph/chain/:chain`
- `GET /graph/chain/:chain/html`
- fail safely when the live provider is not configured

## v1.0-alpha.4

Status: next.

Scope:

- interactive HTML shell
- graph search
- node detail panel
- source/ref deep links

## v1.0-beta

Scope:

- live provider deployed in preview
- live verification workflow extended for chain fetch
- CairnStone graph HEAD updated with deployed v1 orientation

## v1.0

Scope:

- stable payload and live provider APIs
- interactive graph navigation
- blast-radius highlighting
- deployment docs
- CairnStone orientation HEAD updated
