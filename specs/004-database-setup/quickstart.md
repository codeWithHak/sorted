# Quickstart: Database Setup

**Feature**: 004-database-setup
**Prerequisites**: Neon PostgreSQL account with database provisioned

## Step 1: Configure Environment

Create `.env` file in `services/api/`:

```bash
cd services/api
cp .env.example .env
```

Edit `.env` with your Neon credentials:

```bash
# Use the pooled connection endpoint (with -pooler suffix)
DATABASE_URL=postgresql+asyncpg://neon_user:neon_password@ep-xxxxxxxx-pooler.us-east-1.aws.neon.tech/sorted?sslmode=verify-full
```

**Important**:
- Use `-pooler` in the hostname for connection pooling
- Use `postgresql+asyncpg://` prefix for async driver
- Use `sslmode=verify-full` for security

## Step 2: Install Dependencies

```bash
cd services/api
uv sync
```

New dependencies added:
- `sqlmodel` - ORM with Pydantic integration
- `asyncpg` - Async PostgreSQL driver
- `pydantic-settings` - Environment configuration

## Step 3: Start the Application

```bash
cd services/api
uv run uvicorn src.api.main:app --reload --port 8000
```

**Expected output**:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Database tables created successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 4: Verify Database Connection

### Test health endpoint:

```bash
curl -sS http://localhost:8000/health | jq
```

**Expected response**:
```json
{
  "status": "ok"
}
```

### Verify tables created in Neon:

1. Go to Neon Console → Your Project → Tables
2. Confirm `users` and `tasks` tables exist

Or via SQL:

```bash
# Using Neon's SQL Editor or psql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

**Expected output**:
```
 table_name
------------
 users
 tasks
```

## Step 5: Test Database Session Injection

The `/health` endpoint now uses database session to verify connectivity.

```bash
# This confirms the async session dependency works
curl -sS http://localhost:8000/health
```

## Troubleshooting

### Error: "DATABASE_URL is not set"

```
RuntimeError: DATABASE_URL environment variable is required
```

**Fix**: Ensure `.env` file exists with DATABASE_URL or export it:
```bash
export DATABASE_URL="postgresql+asyncpg://..."
```

### Error: "Connection refused"

```
asyncpg.exceptions.ConnectionDoesNotExistError
```

**Fix**:
- Check Neon project is active (not suspended)
- Verify hostname includes `-pooler` suffix
- Confirm password is correct

### Error: "SSL required"

```
asyncpg.exceptions.InvalidAuthorizationSpecificationError: SSL required
```

**Fix**: Add `?sslmode=verify-full` to DATABASE_URL

### Error: "Too many connections"

```
asyncpg.exceptions.TooManyConnectionsError
```

**Fix**: Reduce pool_size in database config (default: 5)

## Verification Checklist

- [ ] `.env` file created with DATABASE_URL
- [ ] Application starts without errors
- [ ] `/health` returns `{"status": "ok"}`
- [ ] `users` table exists in Neon
- [ ] `tasks` table exists in Neon
- [ ] Tables have correct columns and constraints
