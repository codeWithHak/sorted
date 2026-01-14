# Quickstart: Web Monorepo Scaffold

This quickstart validates the Phase II foundation slice: Next.js web runs, FastAPI runs, and `/api/health` works through the Next.js origin.

## Prerequisites

- Node.js (LTS recommended)
- Python 3.13+
- `uv` installed

## 1) Start the API (FastAPI)

From repo root:

```bash
cd services/api
uv run uvicorn api.main:app --reload --port 8000
```

Verify direct API health:

```bash
curl -sS http://localhost:8000/health
```

Expected:

```json
{"status":"ok"}
```

## 2) Start the web app (Next.js)

From repo root:

```bash
cd apps/web
# configure where /api/* should forward to (server-side)
export API_BASE_URL="http://localhost:8000"

npm install
npm run dev
```

Verify the web home page loads:

- Open http://localhost:3000

## 3) Verify proxy wiring through Next.js origin

With both servers running:

```bash
curl -sS http://localhost:3000/api/health
```

Expected:

```json
{"status":"ok"}
```

## Expected failures (edge cases)

- If the API server is not running, `curl http://localhost:3000/api/health` should fail clearly.
- If `API_BASE_URL` is missing or invalid, `/api/health` should fail (misconfiguration is obvious).
