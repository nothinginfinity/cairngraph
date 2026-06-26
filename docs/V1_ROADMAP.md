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

Status: complete and green.

Scope:

- interactive HTML shell
- graph search
- node detail panel
- source/ref deep links

## v1.0-alpha.5

Status: complete, deployed, and live verified.

Scope:

- redeploy alpha.4 Worker
- extend Live Verification to assert interactive shell markers
- record live alpha.4 verification

## Phase 3F

Status: complete in safe live-chain mode.

Scope:

- add live chain verification workflow
- verify live chain routes fail safely when provider is not configured
- prepare strict live-provider verification path

## Phase 3G

Status: complete in safe provider-config mode.

Scope:

- add live provider config workflow
- verify `/health` exposes the live provider boundary
- prepare strict provider-config verification path

## Phase 3H

Status: complete and green.

Scope:

- add strict beta runbook
- document required Worker runtime variables
- document strict verification order and failure meanings

## v1.0-beta

Status: strict live-provider verification green.

Scope completed:

- set real `CAIRNSTONE_V5_BASE_URL`
- redeploy Worker
- run strict provider config verification
- run strict live chain verification
- verify `/graph/chain/:chain` against real CairnStone data
- verify `/graph/chain/:chain/html` against real CairnStone data

Remaining before v1.0 final:

- record deployed v1 orientation in CairnStone
- set a new CairnStone HEAD when graph tooling permits
- prepare final release checklist

## v1.0

Scope:

- stable payload and live provider APIs
- interactive graph navigation
- blast-radius highlighting
- deployment docs
- CairnStone orientation HEAD updated
