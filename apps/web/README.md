# sorted web (Next.js)

## Prerequisites

- Node.js (LTS recommended)

## Install

From repo root:

```bash
cd apps/web
npm install
```

## Run the dev server

From repo root:

```bash
cd apps/web
export API_BASE_URL="http://localhost:8000"
npm run dev
```

Open http://localhost:3000

## Verify API proxy wiring

With the API server also running:

```bash
curl -sS http://localhost:3000/api/health
```

Expected:

```json
{"status":"ok"}
```
