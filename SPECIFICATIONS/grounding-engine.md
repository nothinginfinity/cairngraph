# Grounding Engine

The grounding engine turns inferred diagrams into evidence-backed graph views.

## Inputs

- chain name
- stone hash
- ref id
- repo/path/commit
- receipt id
- raw manifest payload

## Resolution order

1. Chain manifest
2. HEAD hash
3. Stone metadata
4. LOD summaries
5. Refs
6. Raw keys
7. GitHub metadata
8. Receipts
9. Graph edges
10. Inference fallback

## Rule

Never use inference when canonical CairnStone graph data can answer the same question.

## Output

A graph model where every node has a traceable evidence path.
