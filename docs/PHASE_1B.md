# Phase 1B Implementation Note

Phase 1B adds ref-level grounding to the graph engine.

Input:

- CairnStone chain manifest
- Optional per-stone refs
- Optional per-stone `layers.lod2.compressed_index`

Processing:

- Normalize ref windows into `ref` nodes
- Link each stone to each ref with a grounded `contains` edge
- Carry ref evidence fields into every ref node
- Generate GitHub line URLs when stone metadata contains owner, repo, path, and ref

Output:

- Graphs can now show exact `fsl:*` source windows
- Mermaid output includes ref nodes
- Tests verify ref node creation, line windows, source URLs, and containment edges

Next target:

- Phase 1C: add a real CairnStone V5 adapter module that accepts live V5 manifest and stone payloads instead of hand-shaped fixtures.
