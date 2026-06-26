# Beta Provider Configuration

CairnGraph v1.0-beta requires the deployed Worker to use the live CairnStone V5 provider.

## Current state

The Worker supports the provider boundary now.

```text
payload: implemented
cairnstone-v5: scaffold or configured depending on runtime vars
```

## Required Worker variables

```text
CAIRNSTONE_V5_BASE_URL
```

Optional Worker variables:

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

## Verification commands

Safe config check:

```text
npm run verify:provider-config
```

Strict config check:

```text
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=true npm run verify:provider-config
```

Safe live-chain check:

```text
npm run verify:live-chain
```

Strict live-chain check:

```text
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=true npm run verify:live-chain
```

## GitHub workflows

```text
Live Provider Config
Live Chain Verification
```

Run strict mode only after the Worker has a real `CAIRNSTONE_V5_BASE_URL`.

## Beta completion bar

```text
Live Provider Config green in strict mode
Live Chain Verification green in strict mode
/graph/chain/cairngraph returns live graph JSON
/graph/chain/cairngraph/html returns interactive live graph HTML
```
