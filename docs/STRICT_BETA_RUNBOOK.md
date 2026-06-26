# Strict Beta Runbook

This runbook moves CairnGraph from safe-mode beta verification to strict live-provider beta verification.

## Current verified baseline

```text
v1.0-alpha.1 green
v1.0-alpha.2 green
v1.0-alpha.3 green
v1.0-alpha.4 green
v1.0-alpha.5 deployed and live verified
Phase 3F live chain verification green in safe mode
Phase 3G provider config verification green in safe mode
```

## Required value

Strict beta requires a real CairnStone V5 HTTP base URL.

```text
CAIRNSTONE_V5_BASE_URL
```

Do not use a placeholder value. Strict verification should fail unless the deployed Worker can fetch live CairnStone chain data.

## Optional values

Use these only if the CairnStone V5 HTTP service requires them.

```text
CAIRNSTONE_V5_API_TOKEN
CAIRNSTONE_V5_MANIFEST_PATH_TEMPLATE
CAIRNSTONE_V5_STONE_PATH_TEMPLATE
```

Default path templates:

```text
/chains/{chain}/manifest
/stones/{hash}
```

## Cloudflare Worker setup

Set Worker runtime variables for `cairngraph-worker`.

Required:

```text
CAIRNSTONE_V5_BASE_URL=<real CairnStone V5 base URL>
```

Optional:

```text
CAIRNSTONE_V5_API_TOKEN=<token if required>
CAIRNSTONE_V5_MANIFEST_PATH_TEMPLATE=<override if required>
CAIRNSTONE_V5_STONE_PATH_TEMPLATE=<override if required>
```

Then deploy the Worker.

## Verification order

Run these in order.

```text
Deploy Worker
Live Provider Config with require_live_provider=true
Live Chain Verification with require_live_provider=true
```

## Expected strict results

The deployed `/health` endpoint must report:

```text
cairnstone-v5: configured
```

The deployed live chain endpoints must return real graph output.

```text
GET /graph/chain/cairngraph
GET /graph/chain/cairngraph/html
```

The HTML endpoint must include the interactive shell markers.

```text
Interactive controls
node-search
kind-filter
grounding-filter
visible-count
```

## Failure meanings

If `Live Provider Config` fails in strict mode, the Worker does not see a valid `CAIRNSTONE_V5_BASE_URL` runtime variable.

If `Live Provider Config` passes but `Live Chain Verification` fails, the provider is configured but the CairnStone V5 HTTP path, auth token, response shape, or chain data is not compatible yet.

If JSON passes but HTML fails, the live graph provider is working and the issue is in HTML rendering or endpoint content-type.

## Completion bar

Strict beta is complete only when all of these are true.

```text
Deploy Worker green
Live Provider Config green with require_live_provider=true
Live Chain Verification green with require_live_provider=true
/graph/chain/cairngraph returns live graph JSON
/graph/chain/cairngraph/html returns interactive live graph HTML
```

## CairnStone graph note

Do not claim CairnStone HEAD is updated from this runbook alone. HEAD should only be updated after a successful CairnStone graph operation records the deployed v1 orientation.
