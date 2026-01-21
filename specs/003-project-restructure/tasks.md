# Tasks: Project Restructure for Phase 2

**Input**: Design documents from `/specs/003-project-restructure/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), quickstart.md (complete)

**Tests**: NOT requested - this is a file operations task with manual verification only.

**Organization**: Tasks grouped by user story priority (P1 first, then P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Pre-Restructure Verification)

**Purpose**: Verify current state before making changes

- [X] T001 Verify `001-console-app` branch exists and is functional by checking out and running `python -m src.main`
- [X] T002 [P] Document current root directory contents with `ls -la` for comparison
- [X] T003 [P] Verify `apps/web/` builds successfully with `npm run build` in apps/web/
- [X] T004 [P] Verify `services/api/` starts successfully with uvicorn in services/api/

**Checkpoint**: Baseline established - all systems working before restructure

---

## Phase 2: User Story 1 - Clean Project Structure (Priority: P1) 🎯 MVP

**Goal**: Remove CLI artifacts so developers see only web project structure at root

**Independent Test**: Run `ls` at root - should NOT show `src/` or `tests/` directories

### Implementation for User Story 1

- [X] T005 [US1] Remove `src/` directory using `git rm -rf src/`
- [X] T006 [P] [US1] Remove `tests/` directory using `git rm -rf tests/`
- [X] T007 [P] [US1] Remove `uv.lock` file using `git rm uv.lock`
- [X] T008 [P] [US1] Remove `.venv/` directory using `rm -rf .venv/`
- [X] T009 [US1] Update `pyproject.toml` to minimal workspace coordinator (remove CLI config, keep UV workspace)

**Checkpoint**: Root directory clean - no CLI artifacts visible

---

## Phase 3: User Story 2 - Frontend Development Works (Priority: P1)

**Goal**: Verify Next.js frontend remains functional after restructure

**Independent Test**: Run `npm run build` in `apps/web/` - should exit 0

### Implementation for User Story 2

- [X] T010 [US2] Verify frontend builds with `npm run build` in apps/web/
- [X] T011 [US2] Verify frontend dev server starts with `npm run dev` in apps/web/

**Checkpoint**: Frontend fully functional

---

## Phase 4: User Story 3 - Backend API Works (Priority: P1)

**Goal**: Verify FastAPI backend remains functional after restructure

**Independent Test**: Start uvicorn in `services/api/` - should start without import errors

### Implementation for User Story 3

- [X] T012 [US3] Run `uv sync` in services/api/ to ensure dependencies installed
- [X] T013 [US3] Start FastAPI server with `uvicorn main:app --port 8000` in services/api/
- [X] T014 [US3] Verify health endpoint responds at http://localhost:8000/health

**Checkpoint**: Backend fully functional

---

## Phase 5: User Story 4 - CLI Preserved in Branch (Priority: P2)

**Goal**: Verify CLI application remains accessible in dedicated branch

**Independent Test**: Check out `001-console-app` branch, run `python -m src.main`

### Implementation for User Story 4

- [X] T015 [US4] Switch to `001-console-app` branch with `git checkout 001-console-app`
- [X] T016 [US4] Verify `src/` and `tests/` directories exist with `ls`
- [X] T017 [US4] Verify CLI runs with `python -m src.main`
- [X] T018 [US4] Return to restructure branch with `git checkout 003-project-restructure`

**Checkpoint**: CLI preserved and accessible

---

## Phase 6: User Story 5 - Git History Preserved (Priority: P2)

**Goal**: Verify restructuring uses additive commits, not history rewriting

**Independent Test**: Run `git log --oneline` - should show standard commits for deletions

### Implementation for User Story 5

- [ ] T019 [US5] Verify `git log --oneline | head -10` shows deletion commits (not rebase markers)
- [ ] T020 [US5] Verify `git diff 002-web-scaffold..003-project-restructure --stat` shows expected file removals

**Checkpoint**: Git history intact and traceable

---

## Phase 7: Polish & Commit

**Purpose**: Final commit and validation

- [ ] T021 Stage `pyproject.toml` changes with `git add pyproject.toml`
- [ ] T022 Create commit with descriptive message per quickstart.md
- [ ] T023 Run all verification checks from quickstart.md Post-Implementation section
- [ ] T024 Update spec status from "Draft" to "Complete" in specs/003-project-restructure/spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - establishes baseline
- **Phase 2 (US1)**: Depends on Phase 1 - the actual restructure
- **Phase 3 (US2)**: Depends on Phase 2 - verify frontend after restructure
- **Phase 4 (US3)**: Depends on Phase 2 - verify backend after restructure
- **Phase 5 (US4)**: Depends on Phase 2 - verify CLI branch preserved
- **Phase 6 (US5)**: Depends on Phase 7 (needs commit) - verify git history
- **Phase 7 (Polish)**: Depends on Phases 2-5 completion

### User Story Dependencies

- **US1 (Clean Structure)**: Independent - core restructure task
- **US2 (Frontend Works)**: Depends on US1 completion
- **US3 (Backend Works)**: Depends on US1 completion, can parallel with US2
- **US4 (CLI Preserved)**: Depends on US1 completion, can parallel with US2/US3
- **US5 (Git History)**: Depends on commit in Phase 7

### Parallel Opportunities

**Within Phase 1:**
- T002, T003, T004 can run in parallel

**Within Phase 2 (US1):**
- T006, T007, T008 can run in parallel after T005

**After Phase 2:**
- US2, US3, US4 can all run in parallel (different verification domains)

---

## Parallel Example: Phase 1 Setup

```bash
# Launch these tasks together:
Task: "Document current root directory contents with ls -la"
Task: "Verify apps/web/ builds successfully with npm run build"
Task: "Verify services/api/ starts successfully with uvicorn"
```

## Parallel Example: Phase 2 Deletions

```bash
# After T005 completes, launch these together:
Task: "Remove tests/ directory using git rm -rf tests/"
Task: "Remove uv.lock file using git rm uv.lock"
Task: "Remove .venv/ directory using rm -rf .venv/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify baseline)
2. Complete Phase 2: US1 (remove CLI artifacts)
3. **STOP and VALIDATE**: Verify root directory is clean
4. Commit changes

### Incremental Delivery

1. Setup + US1 → Clean structure (MVP!)
2. US2 → Verify frontend works
3. US3 → Verify backend works
4. US4 → Verify CLI branch
5. US5 + Polish → Final commit and validation

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 24 |
| Phase 1 (Setup) | 4 tasks |
| Phase 2 (US1 - Clean Structure) | 5 tasks |
| Phase 3 (US2 - Frontend) | 2 tasks |
| Phase 4 (US3 - Backend) | 3 tasks |
| Phase 5 (US4 - CLI Branch) | 4 tasks |
| Phase 6 (US5 - Git History) | 2 tasks |
| Phase 7 (Polish) | 4 tasks |
| Parallel Opportunities | 8 tasks marked [P] |
| MVP Scope | Phase 1 + Phase 2 (US1) |

---

## Notes

- No code changes required - only file deletions and config updates
- All verification is manual (no automated tests for file operations)
- Each user story can be validated independently
- MVP is achieved after completing US1 (clean project structure)
- Commit after all deletions and pyproject.toml update complete
