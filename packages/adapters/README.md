# @cairngraph/adapters

Adapters connect CairnGraph to CairnStone V5, GitHub, Cloudflare, R2, D1, and MCP tools.

## Phase 1C

The CairnStone V5 adapter accepts:

- a V5 chain manifest
- optional V5 stone payloads from `cairnstone_get_stone`

It merges stone-level LOD2 compressed refs into manifest nodes, then builds a fully grounded CairnGraph model.
