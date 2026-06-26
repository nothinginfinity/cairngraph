# Phase 2F: First Worker Preview Deploy

Phase 2F is the first payload-first Worker preview deploy.

The repository is ready for a manual deploy once CI and Deploy Candidate are green.

## Local deploy

Run from the repository root:

```text
npm install --package-lock=false
npm run candidate
npx wrangler deploy --config workers/cairngraph-worker/wrangler.toml
```

## Expected Worker mode

- payload provider only
- workers.dev enabled
- no live CairnStone V5 fetching
- no direct CairnStone credentials required

## Post-deploy checks

Open the deployed Worker URL and verify:

- GET /health
- GET /manifest

Then send fixture payloads to verify:

- POST /render/html
- POST /graph/blast-radius
- POST /render/blast-radius/html

## Notes

A GitHub Actions deploy workflow should use the same validation path as Deploy Candidate, then run Wrangler deploy. The workflow needs access to the Cloudflare API token and account id configured in the repository settings.
