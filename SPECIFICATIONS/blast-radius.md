# Blast Radius Engine

Blast radius answers: what changes if this node changes?

## Inputs

- stone hash
- ref id
- file path
- commit hash
- receipt id
- diagram id
- graph edge id

## Traversal

The engine should traverse:

- outgoing graph edges
- incoming graph edges
- supersedes chains
- patches relationships
- reviews relationships
- documents relationships
- ref containment
- file-to-test relationships
- workflow and deployment relationships

## Output

- directly impacted nodes
- transitively impacted nodes
- verification requirements
- risk score
- unresolved dependencies
- recommended next actions
