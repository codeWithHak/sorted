---

description: "Task list for Web Monorepo Scaffold feature implementation"
---

# Tasks: Web Monorepo Scaffold

**Input**: Design documents from `/specs/002-web-scaffold/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature primarily uses manual smoke tests (dev servers + curl/browser) as defined in quickstart.md. No automated test tasks are included unless explicitly added later for CI.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase I (existing)**: `src/`, `tests/` at repository root — DO NOT MODIFY
- **Phase II (this feature)**: `apps/web/`, `services/api/`

---

## Phase 1: Setup (Monorepo Foundation)

**Purpose**: Create directory structure and initialize projects

- [ ] T001 Create `apps/` and `services/` directories at repository root
- [ ] T002 [P] Initialize Next.js project in `apps/web` with App Router and TypeScript
- [ ] T003 [P] Initialize Python FastAPI project in `services/api` with `uv` and separate `pyproject.toml`
- [ ] T004 [P] Create `apps/web/.env.example` with `API_BASE_URL=http://localhost:8000` (no secrets committed)
- [ ] T005 [P] Create `services/api/.gitignore` for Python artifacts (`.venv/`, `__pycache__/`, etc.)

---

## Phase 2: Foundational (Service Scaffolding)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Implement `services/api/src/api/main.py` with FastAPI app skeleton and async health handler returning `{ "status": "ok" }`
- [ ] T007 [P] Configure `services/api/pyproject.toml` with FastAPI dependency and uvicorn dev server
- [ ] T008 [P] Configure `apps/web/tsconfig.json` for TypeScript with Next.js App Router paths
- [ ] T009 [P] Configure `apps/web/next.config.ts` with `rewrites()` to forward `/api/:path*` → `${API_BASE_URL}/:path*`
- [ ] T010 [P] Create `apps/web/app/page.tsx` with minimal home page (e.g., heading "sorted" and brief status message)
- [ ] T011 [P] Add `dev` script to `apps/web/package.json` for Next.js dev server on port 3000

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Run both services locally (Priority: P1) 🎯 MVP

**Goal**: Start the web frontend and API backend as separate local processes and confirm both are reachable.

**Independent Test**: Start each dev server and load the web home page in a browser.

### Manual Verification for User Story 1

- [ ] T012 [US1] Start API server from repo root: `cd services/api && uv run uvicorn api.main:app --reload --port 8000`
- [ ] T013 [US1] Verify API health directly: `curl -sS http://localhost:8000/health` returns `{"status":"ok"}` (acceptance scenario 2)
- [ ] T014 [US1] Start web server from repo root: `cd apps/web && export API_BASE_URL="http://localhost:8000" && npm run dev`
- [ ] T015 [US1] Verify web home page loads in browser at http://localhost:3000 (acceptance scenario 1)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Call API through Next.js origin (Priority: P1)

**Goal**: Call the API health endpoint from the browser via the Next.js origin path `/api/health`, proving the proxy/rewrite wiring.

**Independent Test**: With both servers running, request `/api/health` from the browser (or curl against the Next.js origin) and receive the API health payload.

### Manual Verification for User Story 2

- [ ] T016 [US2] With both servers running, request proxy path: `curl -sS http://localhost:3000/api/health`
- [ ] T017 [US2] Verify response matches API health contract: `{"status":"ok"}` (acceptance scenario 1)
- [ ] T018 [US2] Verify no `/api/*` route handlers exist in `apps/web/app/api/` (FR-004 check)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Minimal, stable health contract (Priority: P2)

**Goal**: Have a stable health response contract so future features can depend on a known "API is up" check.

**Independent Test**: Call the health endpoint directly on the API service and confirm it returns the expected JSON shape.

### Contract Validation for User Story 3

- [ ] T019 [P] [US3] Verify `services/api/src/api/main.py` health response matches `specs/002-web-scaffold/contracts/health.openapi.yaml`
- [ ] T020 [P] [US3] Verify response includes required field `status` with value `"ok"` (acceptance scenario 1)
- [ ] T021 [P] [US3] Verify OpenAPI contract matches implementation (status code 200, JSON content-type)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Documentation

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Update `CLAUDE.md` to reflect Phase II technologies (Next.js 16+ App Router, FastAPI, ports 3000/8000)
- [ ] T023 [P] Create `apps/web/README.md` with web dev server startup instructions
- [ ] T024 [P] Create `services/api/README.md` with API dev server startup instructions
- [ ] T025 Run quickstart.md validation end-to-end (all three steps pass)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 P1 → US2 P1 → US3 P2)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 services running but tests independently
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Validates existing contract, no new implementation

### Within Each Phase

- Setup tasks marked [P] can run in parallel
- Foundational tasks marked [P] can run in parallel
- Within US3, contract validation tasks marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

### Parallel Opportunities

```bash
# Phase 1 - Run all in parallel:
T002 (Initialize Next.js)
T003 (Initialize FastAPI)
T004 (.env.example)
T005 (.gitignore)

# Phase 2 - Run all in parallel:
T007 (services/api/pyproject.toml)
T008 (apps/web/tsconfig.json)
T009 (apps/web/next.config.ts)
T010 (apps/web/app/page.tsx)
T011 (apps/web/package.json dev script)

# Phase 3 - Sequential verification (servers must be running):
T012 (Start API)
T013 (Verify API health)
T014 (Start web)
T015 (Verify web home)

# Phase 5 - Contract validation in parallel:
T019 (Verify main.py matches contract)
T020 (Verify status field)
T021 (Verify OpenAPI contract)

# Phase 6 - Run all in parallel:
T022 (CLAUDE.md)
T023 (apps/web/README.md)
T024 (services/api/README.md)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (start both services, verify independently)
4. Complete Phase 4: User Story 2 (verify proxy wiring `/api/health`)
5. **STOP and VALIDATE**: Follow quickstart.md end-to-end
6. Demo/validate complete foundation slice

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Validate
3. Add User Story 2 → Test independently → Validate
4. Add User Story 3 → Validate contract
5. Polish and documentation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 verification
   - Developer B: User Story 2 verification
   - Developer C: User Story 3 contract validation
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable via quickstart.md
- Manual smoke tests are sufficient for this foundation slice; automated tests are optional
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Environment variables are server-side only (`API_BASE_URL` in `apps/web`), no `NEXT_PUBLIC_*` variables