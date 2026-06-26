# Phase 1C Implementation Note

Phase 1C adds the CairnStone V5 adapter.

Input:

- V5 chain manifest payload
- optional V5 stone payloads from `cairnstone_get_stone`

Processing:

- merge stone-level LOD2 compressed refs into manifest nodes
- normalize V5 border metadata into GitHub navigation metadata when possible
- preserve manifest graph edges
- build a CairnGraph model through the existing graph engine

Output:

- fully grounded graph model from live V5-shaped payloads
- ref nodes sourced from actual stone LOD2 compressed indexes
- GitHub line URLs for refs when repo, path, and commit/ref are available

Worker deploy is still not required. The Worker should begin after Phase 1D or Phase 2 when the adapter API is stable enough to expose over HTTP.
