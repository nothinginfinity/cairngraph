# CairnGraph v1 API Contract

## Existing endpoints

```text
GET /health
GET /manifest
POST /graph/from-manifest
POST /graph/from-v5
POST /graph/from-provider
POST /graph/blast-radius
POST /render/mermaid
POST /render/html
POST /render/blast-radius/html
```

## v1 live endpoints

Planned live endpoints:

```text
GET /graph/chain/:chain
GET /graph/chain/:chain/html
GET /graph/chain/:chain/blast-radius
GET /graph/stone/:hash
GET /graph/ref/:ref
```

## Provider request body

```text
{
  provider: "payload" | "cairnstone-v5",
  chain?: string,
  manifest?: object,
  stones?: object[],
  navigation?: boolean,
  mermaid?: boolean,
  html?: boolean,
  report?: boolean
}
```

## Live provider configuration

The live provider is configured by runtime values:

```text
CAIRNSTONE_V5_BASE_URL
CAIRNSTONE_V5_API_TOKEN
CAIRNSTONE_V5_MANIFEST_PATH_TEMPLATE
CAIRNSTONE_V5_STONE_PATH_TEMPLATE
```

Default path templates:

```text
/chains/{chain}/manifest
/stones/{hash}
```

These templates are intentionally configurable because the final CairnStone V5 REST boundary may differ across environments.

## Compatibility rule

All payload-first endpoints must keep working after live provider support is enabled.
