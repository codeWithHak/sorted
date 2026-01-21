# Quickstart: Project Restructure for Phase 2

**Feature**: 003-project-restructure
**Date**: 2026-01-21

## Prerequisites

- Git installed and configured
- Node.js 18+ (for frontend verification)
- Python 3.13+ with UV (for backend verification)

## Implementation Steps

### 1. Remove CLI Artifacts

```bash
# Remove tracked files (stages deletions)
git rm -rf src/
git rm -rf tests/
git rm uv.lock

# Remove untracked/gitignored files
rm -rf .venv/
```

### 2. Update pyproject.toml

Replace the current CLI-focused pyproject.toml with a minimal workspace coordinator:

```toml
[project]
name = "sorted"
version = "0.2.0"
description = "A todo app - Phase II Web Application"
readme = "README.md"
requires-python = ">=3.13"

[tool.uv.workspace]
members = ["services/api"]
```

### 3. Verify Frontend

```bash
cd apps/web
npm run build
# Expected: Build succeeds with exit code 0
```

### 4. Verify Backend

```bash
cd services/api
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000
# Expected: Server starts without import errors
# Check: http://localhost:8000/health returns OK
```

### 5. Verify CLI Branch Preserved

```bash
git checkout 001-console-app
ls src/  # Should exist
python -m src.main  # Should run
git checkout 003-project-restructure
```

### 6. Commit Changes

```bash
git add pyproject.toml
git commit -m "refactor: remove CLI artifacts for Phase II web focus

- Remove src/ directory (CLI source code)
- Remove tests/ directory (CLI tests)
- Remove uv.lock (CLI lockfile)
- Update pyproject.toml to minimal workspace coordinator
- CLI preserved in 001-console-app branch

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

## Post-Implementation Verification

Run these checks to confirm success:

```bash
# SC-001: No src/ or tests/ at root
ls -la | grep -E "^d.*(src|tests)$" && echo "FAIL" || echo "PASS"

# SC-002: pyproject.toml has no CLI config
grep -E "(project.scripts|tool.ruff|tool.pytest|tool.mypy)" pyproject.toml && echo "FAIL" || echo "PASS"

# SC-003: Frontend builds
cd apps/web && npm run build && echo "PASS" || echo "FAIL"

# SC-004: Backend starts
cd ../services/api && timeout 5 uv run uvicorn main:app --port 8000 || echo "PASS (timeout expected)"

# SC-005: Git history preserved
git log --oneline | head -5

# SC-006: CLI branch works
git stash && git checkout 001-console-app && ls src/ && git checkout - && git stash pop
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm run build` fails | Check `apps/web/package.json` exists; run `npm install` first |
| `uvicorn` import error | Ensure `services/api/pyproject.toml` has FastAPI dependency |
| Git complains about changes | Commit or stash changes before switching branches |
