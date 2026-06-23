# Security Policy

## Supported Use

Zamili Studio is a local-first development app. The built-in API routes are intended for trusted local development and self-hosted environments.

Do not expose the Vite dev server directly to the public internet without adding authentication, authorization, rate limiting, and upload controls.

## Secrets

Never commit:

- `.env`
- API keys
- service account keys
- credentials JSON files
- local SQLite databases
- rendered videos
- generated voiceovers
- private customer or brand media

The `.gitignore` is configured to exclude these by default.

## Reporting Issues

If you find a security issue, do not open a public issue with exploit details. Contact the maintainer privately and include:

- affected route/file
- reproduction steps
- expected impact
- suggested mitigation, if known

## Hardening Checklist

Before production deployment:

- Add auth to `/api/studio/*`
- Store secrets in a managed secret store
- Validate and limit uploads
- Serve rendered files from private object storage
- Add request rate limits
- Add logging and audit trails
- Run dependency audits regularly
