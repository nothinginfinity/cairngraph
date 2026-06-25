# CairnGraph Roadmap

## Phase 1 — Foundation

Build the repo, schema, graph model, and first renderer scaffold.

Deliverables:

- Project scaffold
- Graph node and edge model
- Grounding metadata model
- Mermaid renderer interface
- Cloudflare Worker skeleton
- Test fixtures for CairnStone chain manifests

Definition of done:

- A sample CairnStone chain manifest can be converted into an internal CairnGraph model.
- A Mermaid graph can be produced from that model.
- Every node carries at least one traceability slot, even if unresolved.

## Phase 2 — Grounding Engine

Connect directly to CairnStone V5 data structures.

Deliverables:

- Chain manifest adapter
- HEAD resolver
- Stone metadata resolver
- Ref resolver
- LOD resolver
- Receipt resolver
- GitHub source metadata resolver

Definition of done:

- A graph rendered from a chain can identify canonical HEAD.
- Every stone node contains hash, title, chain, HEAD status, LOD summary, refs, and edge counts.
- Every ref node contains ref id, path, line range, raw key, keywords, and preview.

## Phase 3 — Graph Navigation

Make diagrams navigable.

Deliverables:

- Chain → HEAD → Stone → LOD → Ref → Raw Source navigation model
- Node expansion protocol
- Click target metadata
- Cross-chain navigation
- Backlinks and forward links

Definition of done:

- A node can be expanded without regenerating the entire graph.
- Every rendered node has a stable id and navigation target.

## Phase 4 — True Blast Radius Engine

Compute blast radius from graph relationships and source metadata.

Deliverables:

- Upstream/downstream dependency traversal
- Supersedes/patches/documents/reviews/reference traversal
- Tests and workflow mapping
- File and commit impact mapping
- Risk scoring

Definition of done:

- Given any stone, ref, file, commit, or receipt, CairnGraph can return impacted nodes and verification requirements.

## Phase 5 — Verification Layer

Overlay verification evidence on graph nodes.

Deliverables:

- Compression receipt display
- Reconstruction receipt display
- CI/workflow receipt display
- Deployment verification display
- SHA/source verification display

Definition of done:

- Verification state can be shown as pass, fail, stale, inferred, or missing.
- The graph can explain why a node is trusted or not trusted.

## Phase 6 — Multi-Level Views

Support different visual projections of the same graph.

Views:

- Architecture view
- File view
- Function view
- Ref view
- BytePlane view
- Timeline view
- Blast-radius view
- Receipt view

Definition of done:

- The same grounded graph can render into at least three views without changing underlying evidence.

## Phase 7 — Interactive CairnGraph Worker

Build the live service.

Deliverables:

- Cloudflare Worker API
- Static interactive viewer
- Graph query endpoints
- Render endpoints
- Artifact endpoints
- Health and manifest endpoints

Definition of done:

- A deployed Worker can fetch or receive a manifest and return a navigable graph payload plus HTML viewer.

## Phase 8 — AI Explorer

Allow agents to ask graph-native questions.

Example questions:

- Show me everything related to LoopPlane.
- What breaks if this stone changes?
- Walk backwards from this receipt.
- Show me all unverified inferred nodes.
- Expand every ref touching BytePlane.

Definition of done:

- Natural-language graph questions map to deterministic graph operations with receipts.

## Phase 9 — CairnOS Integration

Integrate CairnGraph with local/agent workflows.

Targets:

- ChatGPT
- Claude
- VS Code
- Cursor/Hammerspoon
- GitHub PR review
- Cloudflare deploy review

Definition of done:

- A user can inspect a repo, patch, CI failure, or stone from a visual graph instead of raw logs.

## Phase 10 — CairnGraph Studio

A full visual desktop for CairnStone.

Long-term deliverables:

- Zoomable graph
- Timeline playback
- Search
- Impact analysis
- Cross-chain navigation
- Live updates
- Receipt explorer
- BytePlane compression visualizer
