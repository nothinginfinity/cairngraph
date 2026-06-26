# CairnGraph Deploy Candidate

Phase 2E prepares the first Worker deploy candidate without deploying it automatically.

## Candidate checks

Run locally:

```text
npm install --package-lock=false
npm run candidate
npm run worker:deploy:dry
```

GitHub Actions:

- `CI` validates build and tests.
- `Deploy Candidate` validates build, tests, and Wrangler dry-run.

## Current Worker mode

The Worker is still payload-first.

It accepts manifests and V5-shaped payloads over HTTP. It does not yet fetch live CairnStone V5 data directly.

## Deploy criteria

Before live deploy:

- CI green
- Deploy Candidate workflow green
- Worker dry-run green
- payload provider confirmed
- `/health` response confirms expected phase
- `/manifest` lists expected endpoints
- `/render/html` works from fixture payload
- `/render/blast-radius/html` works from fixture payload

## First deployment target

Recommended first deployment:

- Cloudflare Workers `workers_dev = true`
- payload provider only
- no secrets required
- no direct CairnStone V5 credentials

This avoids coupling the first deploy to live CairnStone fetch credentials.
