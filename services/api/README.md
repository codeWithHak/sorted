# sorted API (FastAPI)

## Prerequisites

- Python 3.13+
- `uv`

## Run the dev server

From repo root:

```bash
cd services/api
uv run uvicorn src.api.main:app --reload --port 8000
```

## Health check

```bash
curl -sS http://localhost:8000/health
```

Expected:

```json
{"status":"ok"}
```
