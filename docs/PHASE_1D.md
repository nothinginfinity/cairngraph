# Phase 1D Implementation Note

Phase 1D adds grounding completeness and navigation expansion.

Input:

- CairnGraph model with grounded ref nodes

Processing:

- expand ref nodes into raw source navigation nodes
- expand ref nodes into source URL/file navigation nodes
- add grounded `expands_to` edges
- compute grounding completeness reports
- expose navigation targets for a selected node

Output:

- refs can now navigate to raw keys
- refs can now navigate to GitHub/source line targets when available
- graph reports show node counts, grounding counts, unresolved evidence gaps, and completeness

Worker deploy is still not required. Phase 1D is a library-level completion pass that makes the future Worker responses richer and more stable.
