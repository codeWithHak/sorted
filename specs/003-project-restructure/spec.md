# Feature Specification: Project Restructure for Phase 2 Web Application

**Feature Branch**: `003-project-restructure`
**Created**: 2026-01-20
**Status**: Draft
**Input**: Restructure sorted project to cleanly separate Phase 1 CLI from Phase 2 web application, establishing a clean monorepo foundation.

## Overview

The sorted project requires restructuring to cleanly separate Phase 1 (CLI application) from Phase 2 (web application) while establishing a maintainable monorepo foundation. The current state mixes CLI artifacts at the repository root (`src/`, `tests/`, CLI-focused `pyproject.toml`) alongside the nascent web structure (`apps/web/`, `services/api/`), creating confusion about which code belongs to which phase and making it difficult to run, test, or deploy either application independently.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Clones Clean Web Project (Priority: P1)

A new developer joining the Phase 2 web development effort clones the repository and immediately understands the project structure. They see `apps/web/` for the frontend and `services/api/` for the backend without encountering orphaned CLI code or confusing root-level Python files that aren't part of the web stack.

**Why this priority**: This is the primary goal of the restructuring - enabling focused web development without legacy confusion.

**Independent Test**: Clone the repository on branch `003-project-restructure` (or main after merge), verify no `src/` or `tests/` directories exist at root, and confirm the project structure is self-explanatory for web development.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository on the restructured branch, **When** a developer runs `ls` at root, **Then** they see `apps/`, `services/`, `specs/`, `history/`, `.specify/` but NOT `src/` or `tests/` directories.
2. **Given** a fresh clone, **When** a developer examines `pyproject.toml`, **Then** it contains no CLI entry points or CLI-specific dependencies.

---

### User Story 2 - Frontend Development Works (Priority: P1)

A frontend developer can start the Next.js development server and build the web application without any interference from CLI-related configurations or dependencies.

**Why this priority**: Verifying existing functionality isn't broken is equally critical to removing legacy code.

**Independent Test**: Navigate to `apps/web/`, run `npm run dev` and `npm run build`, confirm both succeed without errors.

**Acceptance Scenarios**:

1. **Given** the restructured repository, **When** a developer runs `npm run dev` in `apps/web/`, **Then** the Next.js development server starts successfully on port 3000.
2. **Given** the restructured repository, **When** a developer runs `npm run build` in `apps/web/`, **Then** the build completes without errors.

---

### User Story 3 - Backend API Works (Priority: P1)

A backend developer can start the FastAPI server without import errors or missing dependencies caused by the restructuring.

**Why this priority**: The API service must remain functional after removing root-level Python code.

**Independent Test**: Navigate to `services/api/`, start the server with uvicorn, confirm it starts without errors.

**Acceptance Scenarios**:

1. **Given** the restructured repository, **When** a developer starts the FastAPI server, **Then** the server starts successfully on port 8000.
2. **Given** the running API server, **When** a health check endpoint is called, **Then** it returns a successful response.

---

### User Story 4 - CLI Preserved in Branch (Priority: P2)

A developer who needs to work on or reference the CLI application can check out the `001-console-app` branch and find a fully functional CLI application, unaffected by the restructuring.

**Why this priority**: Preserving Phase 1 work is important but secondary to enabling Phase 2 development.

**Independent Test**: Check out `001-console-app` branch, verify `src/` and `tests/` exist, run the CLI application.

**Acceptance Scenarios**:

1. **Given** the `001-console-app` branch, **When** a developer runs `python -m src.main`, **Then** the CLI application starts normally.
2. **Given** the `001-console-app` branch, **When** a developer examines the root directory, **Then** `src/` and `tests/` directories are present.

---

### User Story 5 - Git History Preserved (Priority: P2)

The restructuring maintains full git history with additive commits, allowing developers to trace the evolution of the project and understand why files were removed.

**Why this priority**: Traceability and auditability support long-term maintainability.

**Independent Test**: Run `git log` and verify restructuring changes appear as standard commits, not as a rewritten history.

**Acceptance Scenarios**:

1. **Given** the restructured branch, **When** a developer runs `git log --oneline`, **Then** the commit history shows additive commits for file deletions (not rebased or force-pushed history).
2. **Given** the restructured branch, **When** a developer runs `git diff 002-web-scaffold..003-project-restructure`, **Then** the diff shows only the intended removals and modifications.

---

### Edge Cases

- What happens if a developer accidentally tries to run CLI commands on the restructured branch? They receive a clear "command not found" or "module not found" error rather than cryptic failures.
- What if shared SpecKit artifacts reference CLI-specific paths? The `.specify/`, `specs/`, and `history/` directories must remain unchanged and functional.
- What if the root `.venv/` contains CLI-specific packages? The decision to remove or retain `.venv/` is left to implementation; if retained, it should only contain packages needed by `services/api/`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Repository MUST NOT contain `src/` directory at root level after restructuring
- **FR-002**: Repository MUST NOT contain `tests/` directory at root level after restructuring
- **FR-003**: Root `pyproject.toml` MUST NOT contain CLI entry points (no `[project.scripts]` section with CLI commands)
- **FR-004**: Root `pyproject.toml` MUST NOT contain CLI-specific dependencies (if any existed)
- **FR-005**: `apps/web/` MUST remain fully functional (npm run dev, npm run build)
- **FR-006**: `services/api/` MUST remain fully functional (uvicorn startup without import errors)
- **FR-007**: `.specify/` directory MUST remain unchanged
- **FR-008**: `specs/` directory MUST remain unchanged (except for addition of this feature's spec)
- **FR-009**: `history/` directory MUST remain unchanged
- **FR-010**: Git history MUST be preserved through additive commits (no rebase, no force-push)
- **FR-011**: `001-console-app` branch MUST remain unaffected and fully functional

### Scope Boundaries

**In Scope:**
- Removing root-level `src/` directory
- Removing root-level `tests/` directory
- Updating root `pyproject.toml` to remove CLI configuration
- Verifying `apps/web/` functionality
- Verifying `services/api/` functionality
- Optionally removing or updating root `.venv/` directory

**Out of Scope:**
- Modifying any code within `apps/web/`
- Modifying any code within `services/api/`
- Modifying the `001-console-app` branch
- Altering `.specify/`, `specs/`, or `history/` directories
- Introducing new features or dependencies
- Changing the fundamental monorepo structure (`apps/` + `services/`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Running `ls` at repository root shows zero `src/` or `tests/` directories
- **SC-002**: Root `pyproject.toml` contains zero CLI entry points and zero CLI-specific dependencies
- **SC-003**: `npm run build` in `apps/web/` completes with exit code 0
- **SC-004**: FastAPI server in `services/api/` starts without import errors
- **SC-005**: `git log` shows restructuring as standard commits (deletions tracked, not rewritten)
- **SC-006**: Checking out `001-console-app` yields working CLI with `python -m src.main`
- **SC-007**: New developer can understand project structure within 5 minutes of cloning (qualitative)

## Assumptions

- The CLI code in `src/` has no dependencies that are required by the web application
- The `001-console-app` branch contains a complete, working copy of the CLI application
- The root `pyproject.toml` is primarily for CLI configuration and can be simplified or removed
- The web application (`apps/web/`) and API service (`services/api/`) have their own dependency management and don't rely on root-level Python configuration
