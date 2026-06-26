# Phase 3A Plan: Fixture-Backed Live Verification

Phase 3A verifies the deployed Worker with real payloads.

Goal:

```text
prove the deployed Worker can accept CairnStone-shaped payloads and return browser-ready grounded graph views
```

Targets:

```text
POST /render/html
POST /graph/blast-radius
POST /render/blast-radius/html
```

Inputs:

```text
examples/loop-engineer-template-review.manifest.json
```

Expected outputs:

```text
HTML graph response
blast-radius JSON response
blast-radius HTML response
```

Validation criteria:

```text
HTTP 200
content-type is correct
response contains chain name
response contains source/ref evidence
blast-radius response contains impacted node count
blast-radius HTML contains blast radius status
```

After Phase 3A:

```text
re-stone the repository
set the latest CairnGraph orientation as HEAD
begin live CairnStone V5 provider integration
```
