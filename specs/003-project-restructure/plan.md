# Implementation Plan: Project Restructure for Phase 2

**Branch**: `003-project-restructure` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-project-restructure/spec.md`

## Summary

Restructure the sorted monorepo to cleanly separate Phase 1 CLI artifacts from Phase 2 web application. This involves removing root-level `src/` and `tests/` directories (CLI code), updating `pyproject.toml` to serve as a workspace coordinator, and verifying that `apps/web/` and `services/api/` remain functional. The CLI remains accessible via the `001-console-app` branch.

## Technical Context

**Language/Version**: N/A (file operations only, no code changes)
**Primary Dependencies**: git (version control), npm (frontend verification), uvicorn (API verification)
**Storage**: N/A (no data model changes)
**Testing**: Manual verification of npm run build, uvicorn startup, git log
**Target Platform**: Linux/macOS/Windows development environments
**Project Type**: Monorepo restructure (web application focus)
**Performance Goals**: N/A (structural change only)
**Constraints**: Git history must be preserved (no rebase/force-push)
**Scale/Scope**: Remove ~20 files/directories, update 1 config file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | PASS | Restructure simplifies project understanding |
| Async-First Design | N/A | No code changes |
| Security by Default | N/A | No code changes |
| Phase-Based Evolution | PASS | Enables clean Phase II focus per constitution |
| Spec-Driven Development | PASS | Following full SDD workflow |
| Monorepo Structure | PASS | Constitution specifies "Monorepo with clear separation of phases" |

**Gate Result**: PASS - No violations. Restructure aligns with constitution's "clear separation of phases" directive.

## Project Structure

### Documentation (this feature)

```text
specs/003-project-restructure/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal - no unknowns)
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

**BEFORE restructure:**
```text
sorted/
├── .specify/            # SpecKit Plus (KEEP)
├── .venv/               # Python venv (REMOVE - CLI-specific)
├── apps/
│   └── web/             # Next.js frontend (KEEP)
├── history/             # PHRs and ADRs (KEEP)
├── services/
│   └── api/             # FastAPI backend (KEEP)
├── specs/               # Feature specs (KEEP)
├── src/                 # CLI source code (REMOVE)
├── tests/               # CLI tests (REMOVE)
├── pyproject.toml       # CLI config (UPDATE)
├── uv.lock              # CLI lockfile (REMOVE)
├── CLAUDE.md            # Agent config (KEEP)
└── README.md            # Project readme (KEEP)
```

**AFTER restructure:**
```text
sorted/
├── .specify/            # SpecKit Plus
├── apps/
│   └── web/             # Next.js frontend
├── history/             # PHRs and ADRs
├── services/
│   └── api/             # FastAPI backend (has own pyproject.toml)
├── specs/               # Feature specs
├── pyproject.toml       # Minimal workspace coordinator
├── CLAUDE.md            # Agent config
└── README.md            # Project readme
```

**Structure Decision**: Clean monorepo with `apps/` for frontend applications and `services/` for backend services. Root `pyproject.toml` becomes a UV workspace coordinator pointing to `services/api`. CLI code preserved in `001-console-app` branch.

## Complexity Tracking

No violations requiring justification. This is a simplification task that reduces complexity.

## Implementation Approach

### Step 1: Remove CLI Directories
- Delete `src/` directory (CLI source code)
- Delete `tests/` directory (CLI tests)
- Delete `.venv/` directory (CLI virtual environment)
- Delete `uv.lock` file (CLI lockfile)

### Step 2: Update Root pyproject.toml
Transform from CLI project config to minimal workspace coordinator:
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

### Step 3: Verify Frontend
- Run `npm run build` in `apps/web/`
- Confirm exit code 0

### Step 4: Verify Backend
- Start FastAPI server in `services/api/`
- Confirm startup without import errors

### Step 5: Verify Git History
- Run `git log --oneline` to confirm additive commits
- Confirm `001-console-app` branch is unaffected

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CLI branch affected | Low | High | Verify branch before/after; no rebase |
| Web app broken | Low | Medium | Test npm build before commit |
| API broken | Low | Medium | Test uvicorn startup before commit |
| SpecKit references broken | Low | Low | Verify .specify/ unchanged |

## Verification Checklist

- [ ] `ls` at root shows no `src/` or `tests/`
- [ ] `pyproject.toml` has no CLI entry points
- [ ] `npm run build` in `apps/web/` succeeds
- [ ] `uvicorn` in `services/api/` starts
- [ ] `git log` shows additive commits
- [ ] `001-console-app` branch unchanged
