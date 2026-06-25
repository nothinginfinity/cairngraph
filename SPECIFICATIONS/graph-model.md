# Graph Model Specification

## CairnGraph

A CairnGraph is a normalized graph projection of one or more CairnStone chains.

```ts
type CairnGraph = {
  graph_id: string;
  chains: ChainNode[];
  nodes: CairnGraphNode[];
  edges: CairnGraphEdge[];
  views: CairnGraphView[];
  receipts: GraphReceipt[];
  created_at: string;
};
```

## Required node evidence

Every node must carry one of:

- `stone_hash`
- `ref_id`
- `raw_key`
- `github`
- `receipt_id`
- `edge_id`
- `inferred_reason`

If none are present, the node is invalid.

## Required graph metadata

- source chain
- HEAD hash when available
- graph completeness
- adapter used
- generation time
- unresolved count
