# Data Model: Web Monorepo Scaffold

**Feature**: 002-web-scaffold
**Date**: 2026-01-11

This feature introduces no persistent data model. It defines a minimal **health check contract** for service reachability.

## Entities

### Service
A runnable component of the system.

- **web**: Next.js dev server (port 3000)
- **api**: FastAPI dev server (port 8000)

### Health Check
A stable, lightweight response indicating the API is reachable.

## Health Contract

### Endpoint
- API direct: `GET /health`
- Via web origin (proxy): `GET /api/health` (rewritten to the API service)

### Response
- Status code: `200`
- Body:

```json
{ "status": "ok" }
```

### Error / Edge behavior
- If API is down: `GET /api/health` should fail clearly (typically `502` from the Next.js dev server proxy path or a connection error).
- If `API_BASE_URL` is missing/invalid: proxy requests should fail (misconfiguration is obvious).
