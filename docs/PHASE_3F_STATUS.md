# Phase 3F Status

Phase 3F live chain verification is green.

Verified:

```text
Live Chain Verification
```

Mode:

```text
safe default mode
CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=false
```

Meaning:

```text
/graph/chain/:chain is wired
/graph/chain/:chain/html is wired
unconfigured live provider fails safely
payload-first Worker remains stable
```

Next beta step:

```text
configure CAIRNSTONE_V5_BASE_URL in the Worker environment
run Live Chain Verification with CAIRNGRAPH_REQUIRE_LIVE_PROVIDER=true
```
