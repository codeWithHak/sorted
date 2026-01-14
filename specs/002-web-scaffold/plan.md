# Implementation Plan: Web Monorepo Scaffold

**Branch**: `002-web-scaffold` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-web-scaffold/spec.md`

## Summary

Establish the Phase II monorepo foundation for sorted by adding a Next.js (App Router, TypeScript) frontend under `apps/web` and a Python FastAPI backend under `services/api`. The feature proves end-to-end wiring before implementing auth, database, or task CRUD. Core requirements: both services start cleanly, `/api/*` requests proxy/rewrite from Next.js to FastAPI in local development, and no committed secrets.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.13+ (backend)
**Primary Dependencies**: Next.js 16+ (App Router), FastAPI, uvicorn
**Storage**: N/A (no database or persistence in this feature)
**Testing**: N/A (no tests required for scaffolding feature)
**Target Platform**: Local development (future: Vercel + cloud backend)
**Project Type**: Web application with monorepo structure
**Performance Goals**: Health endpoint responds within 200ms
**Constraints**: No committed secrets, environment configuration required, smallest viable change
**Scale/Scope**: Foundation feature; developer experience validation, no production users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution Requirements (from `.specify/memory/constitution.md`)

**Phase II Constraints Section**:
- Frontend: Next.js 16+ with App Router ✅
- Backend: FastAPI with Python ✅
- Monorepo with clear separation of phases ✅
- Configuration: Environment variables for all sensitive data ✅

**Code Standards**:
- Async-first design (FastAPI routing) ✅
- Security by default (no secrets, env config) ✅
- Readability over cleverness (minimal scaffolding) ✅

### Gate Status
✅ **PASSED**: All Phase II constraints satisfied. No constitution violations detected.

### Architectural Decision Check
This feature establishes the Phase II monorepo layout and wiring pattern. The following decisions have architectural significance:

1. **Monorepo layout** (`apps/web` + `services/api`) - This pattern will persist across all Phase II+ features
2. **Next.js ownership of `/api/*` proxy/rewrite** - Establishes that the browser uses a single origin while FastAPI owns the API surface
3. **Environment-based service wiring** - Establishes the pattern for all cross-service communication

📋 Architectural decision detected: Monorepo structure with Next.js proxy/rewrite pattern — Document reasoning and tradeoffs? Run `/sp.adr monorepo-web-scaffold`

## Project Structure

### Documentation (this feature)

```text
specs/002-web-scaffold/
├── spec.md              # Feature requirements
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── health.yaml      # Health endpoint OpenAPI contract
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Phase I: In-Memory Console App (preserve intact)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Phase II: Monorepo Layout
apps/
└── web/                    # Next.js 16+ App Router frontend
    ├── app/
    │   ├── api/
    │   │   └── [...path*]/   # Next.js middleware for /api/* proxy/rewrite
    │   ├── layout.tsx
    │   └── page.tsx          # Minimal home page
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    └── .env.local            # API_BASE_URL configuration

services/
└── api/                    # FastAPI backend
    ├── api/
    │   └── main.py           # FastAPI app with health endpoint
    ├── pyproject.toml        # Python 3.13+ dependencies
    └── .env                  # PORT configuration

# Root level configuration
.env.example                # Environment variable templates
```

**Structure Decision**: Monorepo layout preserving Phase I (`src/`) while adding Phase II structure (`apps/web/`, `services/api/`). This layout maintains phase boundaries and supports parallel development of both console and web applications.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This field remains empty.

---
