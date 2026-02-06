# Research: Database Setup

**Feature**: 004-database-setup
**Date**: 2026-02-05
**Status**: Complete

## Research Questions

### 1. SQLModel with Async PostgreSQL Driver

**Decision**: Use `asyncpg` driver with SQLAlchemy async engine

**Rationale**:
- asyncpg is the fastest PostgreSQL driver for Python async operations
- Native support in SQLAlchemy 2.0+ via `create_async_engine`
- SQLModel seamlessly integrates with SQLAlchemy async patterns

**Alternatives Considered**:
- psycopg3 (async mode): Newer, but asyncpg has more production usage
- databases library: Additional abstraction layer not needed with SQLModel

**Connection String Format**:
```
postgresql+asyncpg://user:password@host/dbname?sslmode=verify-full
```

---

### 2. Neon Serverless Connection Pooling

**Decision**: Use pooled endpoint with conservative pool sizing

**Rationale**:
- Neon's `-pooler` endpoint provides PgBouncer-based pooling
- Serverless cold starts require `pool_pre_ping=True`
- Conservative pool size (5) prevents overwhelming serverless instances

**Configuration**:
```python
pool_size=5           # Base connections
max_overflow=10       # Burst capacity (total: 15)
pool_pre_ping=True    # Validate before use
pool_recycle=3600     # Reconnect hourly
```

**Alternatives Considered**:
- Direct connections only: Would exhaust Neon limits quickly
- Larger pool sizes: Risk overwhelming serverless during cold starts

---

### 3. FastAPI Async Session Dependency

**Decision**: Async generator with context manager pattern

**Rationale**:
- Single session per request (FastAPI caches dependency results)
- Automatic cleanup via `finally` block
- Works with both success and error scenarios

**Pattern**:
```python
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
```

**Alternatives Considered**:
- Middleware-based sessions: More complex, less explicit
- Manual session management: Error-prone, leaks connections

---

### 4. UUID Primary Keys

**Decision**: Client-side UUID v4 generation with PostgreSQL native type

**Rationale**:
- Globally unique without database round-trip
- Privacy-preserving (doesn't leak record count)
- Native PostgreSQL UUID type (16 bytes, indexed efficiently)

**Implementation**:
```python
id: uuid.UUID = Field(
    default_factory=uuid.uuid4,
    primary_key=True,
    sa_column=Column(PGUUID(as_uuid=True), primary_key=True)
)
```

**Alternatives Considered**:
- Auto-increment integers: Leaks system size, not distributed-friendly
- UUID v7 (time-based): Sortable but Python stdlib lacks native support

---

### 5. Soft Delete Pattern

**Decision**: Boolean `is_deleted` flag with query-level filtering

**Rationale**:
- Simple boolean is sufficient for MVP (no audit trail needed yet)
- Matches spec requirement exactly
- Easy to extend to `deleted_at` timestamp later if needed

**Implementation**:
```python
is_deleted: bool = Field(default=False, index=True)

# Query pattern
select(Task).where(Task.is_deleted == False)
```

**Alternatives Considered**:
- `deleted_at` timestamp: More info but spec doesn't require it
- Automatic query filtering: Complex, may hide bugs

---

## Dependencies

```toml
[project.dependencies]
fastapi = ">=0.115.0"
sqlmodel = ">=0.0.22"
sqlalchemy = {extras = ["asyncio"], version = ">=2.0.35"}
asyncpg = ">=0.30.0"
uvicorn = {extras = ["standard"], version = ">=0.32.0"}
pydantic-settings = ">=2.6.0"
```

---

## Environment Variables

| Variable | Required | Format | Description |
|----------|----------|--------|-------------|
| DATABASE_URL | Yes | `postgresql+asyncpg://...` | Neon connection string with pooler |

---

## Security Considerations

1. **Never log DATABASE_URL**: Contains credentials
2. **Use verify-full SSL**: Protects against MITM attacks
3. **Pool limits**: Prevent connection exhaustion attacks
