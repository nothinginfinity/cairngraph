# Phase 3E: v1.0-alpha.5 Live Interactive Verification

Phase 3E verifies that the deployed Worker is serving the v1.0-alpha.4 interactive HTML shell.

Goal:

```text
prove the live Worker returns interactive graph HTML, not only static graph HTML
```

Added verification markers:

```text
Interactive controls
node-search
kind-filter
grounding-filter
visible-count
```

Updated command:

```text
npm run verify:live
```

Verification order:

```text
Deploy Worker
Live Verification
```

Expected result:

```text
CI green
Deploy Candidate green
Deploy Worker green
Live Verification green
```
