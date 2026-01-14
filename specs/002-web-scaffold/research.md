# Phase 0 Research: Web Monorepo Scaffold

**Feature**: 002-web-scaffold
**Date**: 2026-01-11

## 1) Next.js → FastAPI proxy/rewrite configuration

### Decision
Use Next.js `rewrites()` in `apps/web/next.config.ts` to forward all `/api/:path*` requests on the Next.js origin to a FastAPI base URL derived from an environment variable.

- `source`: `/api/:path*`
- `destination`: `${API_BASE_URL}/:path*`

### Rationale
- Meets **FR-005** (proxy/rewrite) and **FR-006** (configurable via env vars).
- Keeps FastAPI as the owner of `/api/*` routes (**FR-004**) by avoiding Next.js route handlers.

### Alternatives considered
- **Next.js Route Handlers** under `apps/web/app/api/*`: rejected (violates FR-004).
- **External reverse proxy** (nginx/traefik): rejected for this feature (adds moving parts beyond foundation slice).

### Evidence (official docs excerpts)
Next.js supports `rewrites()` rules using `:path*` parameters, and when a parameter is used in the destination it is not duplicated into the query string.

Source: Next.js config `rewrites` reference (Context7 fetch).

```js
async rewrites() {
  return [
    {
      source: '/docs/:path*',
      destination: '/:path*', // :path used in destination
    },
  ]
}
```

(We apply the same pattern for `/api/:path*` → `${API_BASE_URL}/:path*`.)

Additionally, Next.js docs show forwarding `/api/:path*` to a backend origin using `rewrites()`.

```ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://your-backend.com/:path*',
    },
  ]
}
```

Source: Next.js CRA migration guide (Context7 fetch).


## 2) Environment variable naming and .env strategy

### Decision
Use a single server-side environment variable for the rewrite destination base URL:

- `API_BASE_URL` (example: `http://localhost:8000`)

and rely on Next.js built-in `.env*` loading (no custom loader).

### Rationale
- Simple and explicit.
- Minimizes risk of accidentally exposing backend internals to the client.
- Fits the spec’s “misconfiguration fails obviously” edge case: if unset/invalid, `/api/health` requests will fail clearly.

### Alternatives considered
- `NEXT_PUBLIC_API_BASE_URL`: rejected because this value is not needed client-side (proxy is server-side) and would be easy to misuse.
- Multiple vars (host/port/protocol): rejected as unnecessary complexity.

### Open question
Whether to default `API_BASE_URL` locally (e.g. in `apps/web/.env.local`) vs requiring developers to set it manually. The implementation can include a `.env.example` but must avoid committing secrets.

## 3) FastAPI health contract shape

### Decision
Expose a lightweight `GET /health` endpoint from FastAPI returning a stable JSON shape:

```json
{ "status": "ok" }
```

### Rationale
- Meets FR-003 and Story 3 (“clear status indicator”).
- Minimizes future coupling while providing a stable smoke-test contract.

### Alternatives considered
- Include version/build metadata: rejected for now (unnecessary; may change frequently).
- Nested structures or RFC health formats: rejected (overkill for foundation slice).

### Evidence (FastAPI basics)
FastAPI minimal apps are structured as:

```py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}
```

(Source: `fastapi/fastapi` README via Context7 fetch.)

FastAPI’s docs also show running via Uvicorn CLI:

```console
uvicorn main:app --host 0.0.0.0 --port 80
```

(Source: FastAPI deployment docs via Context7 fetch.)

## 4) Local development start commands (planned)

### Decision
Provide explicit, service-local start commands (no repo-wide orchestrator in this feature):

- Web: `cd apps/web && npm run dev` (port 3000)
- API: `cd services/api && uv run uvicorn api.main:app --reload --port 8000`

### Rationale
- Matches the spec acceptance tests (start each dev server independently).
- Avoids introducing additional tooling (make, docker-compose) until needed.

### Alternatives considered
- Root `Makefile` or `justfile`: rejected for now (extra abstraction; can be added later if desired).
- Docker-compose: rejected (out of scope; later phases).
