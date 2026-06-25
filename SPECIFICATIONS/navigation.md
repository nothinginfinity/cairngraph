# Navigation Specification

CairnGraph navigation should support drill-down and lateral graph walking.

## Drill-down path

```text
chain
  → HEAD
  → stone
  → LOD
  → ref
  → raw source
  → GitHub file
  → commit
  → receipt
```

## Lateral paths

- stone to related stones
- ref to adjacent refs
- file to tests
- file to workflows
- receipt to verification evidence
- diagram to source refs
- patch to superseded file
