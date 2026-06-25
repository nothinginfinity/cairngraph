# Edge Types

CairnGraph preserves CairnStone edge semantics.

## Core edge types

- `supersedes`
- `patches`
- `documents`
- `reviews`
- `references`

## Operational edge types

- `contains`
- `expands_to`
- `verifies`
- `fails`
- `passes`
- `depends_on`
- `imports`
- `calls`
- `deploys`
- `tests`
- `generated`
- `attached_to`

## Edge evidence

Every edge should include:

- edge_id when from CairnStone
- from node id
- to node id
- edge type
- confidence
- source ref or receipt if available
- note if available
