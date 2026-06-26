# Phase 3D: v1.0-alpha.4 Interactive HTML Shell

Phase 3D adds the interactive graph shell for CairnGraph v1.0-alpha.4.

Status:

```text
verified green
```

Verified:

```text
CI
Deploy Candidate
```

Implemented capabilities:

```text
node search
node kind filters
grounding filters
visible node count
click-to-inspect node detail panel
incoming and outgoing edge panel
source/ref evidence links
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
/render/html keeps returning valid standalone HTML
```

Next deployment verification:

```text
redeploy Worker
run Live Verification
confirm /render/html contains interactive shell markers
```
