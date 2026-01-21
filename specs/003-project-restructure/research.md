# Research: Project Restructure for Phase 2

**Feature**: 003-project-restructure
**Date**: 2026-01-21

## Overview

This feature involves file system operations (deletions, config updates) rather than code implementation. No external libraries, frameworks, or architectural patterns require research. All decisions are straightforward with clear best practices.

## Decisions

### Decision 1: Root pyproject.toml Handling

**Decision**: Keep pyproject.toml as a minimal UV workspace coordinator

**Rationale**:
- The `services/api/` directory has its own `pyproject.toml` for FastAPI dependencies
- UV workspace feature allows managing multiple Python projects from root
- Preserves ability to run `uv sync` from repository root
- Simpler than completely removing pyproject.toml and recreating later

**Alternatives Considered**:
1. Remove pyproject.toml entirely - Rejected because UV workspace functionality is useful for monorepo management
2. Keep full pyproject.toml with all tools config - Rejected because tools like ruff, mypy, pytest were CLI-specific

### Decision 2: .venv Directory Handling

**Decision**: Remove root `.venv/` directory

**Rationale**:
- The `.venv/` was created for CLI development with CLI-specific packages
- `services/api/` should use its own virtual environment
- Prevents confusion about which packages are installed
- Clean slate for Phase II development

**Alternatives Considered**:
1. Keep .venv and clean packages - Rejected because it's simpler to recreate fresh
2. Move .venv to services/api/ - Rejected because services/api/ should manage its own venv

### Decision 3: uv.lock Handling

**Decision**: Remove root `uv.lock` file

**Rationale**:
- The lockfile captures CLI-specific dependency resolution
- Will be regenerated when `uv sync` is run with new workspace config
- Prevents stale dependency information

**Alternatives Considered**:
1. Keep and update uv.lock - Rejected because regeneration is cleaner

### Decision 4: Git Operation Method

**Decision**: Use `git rm` for tracked files, `rm -rf` for untracked

**Rationale**:
- `git rm` properly stages deletions for commit
- Preserves file history (files can be recovered from git history)
- `.venv/` is gitignored so needs regular `rm -rf`
- Aligns with FR-010 (git history preserved through additive commits)

**Alternatives Considered**:
1. Just `rm -rf` everything - Rejected because wouldn't stage deletions properly
2. `git rm -rf` for everything - Rejected because would fail on gitignored files

## No Unknowns

All technical context items are clear:
- File operations are standard Unix/git commands
- Verification steps use existing tooling (npm, uvicorn)
- No external dependencies or integrations to research

## Conclusion

Research phase complete. No blockers identified. Ready for implementation via `/sp.tasks`.
