# Phase 3D: v1.0-alpha.4 Interactive HTML Shell

Phase 3D begins the interactive graph shell for CairnGraph v1.0-alpha.4.

Goal:

```text
turn static HTML graph output into a navigable browser shell
```

Planned capabilities:

```text
node search
node kind filters
grounding filters
click-to-inspect node detail panel
incoming and outgoing edge panel
source/ref evidence links
blast-radius summary panel
embedded graph JSON for client-side interaction
```

Non-goals for alpha.4:

```text
no external frontend framework
no canvas dependency
no live provider requirement
no breaking payload-first render endpoint
```

Compatibility rule:

```text
/render/html must keep returning valid standalone HTML
```

Verification:

```text
CI
Deploy Candidate
Live Verification after redeploy
```
