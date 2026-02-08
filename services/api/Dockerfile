# Multi-stage build for FastAPI backend
# Stage 1: Install dependencies
FROM python:3.13-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pyproject.toml ./
RUN pip install --no-cache-dir uv && uv pip install --system --compile-bytecode .

# Stage 2: Copy application code and run
FROM python:3.13-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Copy installed Python packages from the deps stage
COPY --from=deps --chown=app:app /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=deps --chown=app:app /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=app:app . .

ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE ${PORT}

CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port $PORT"]