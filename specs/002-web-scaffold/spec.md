# Feature Specification: Web Monorepo Scaffold

**Feature Branch**: `002-web-scaffold`
**Created**: 2026-01-10
**Status**: Draft
**Input**: User description: "Establish the Phase II monorepo foundation for sorted by adding a Next.js (App Router, TypeScript) frontend under apps/web and a Python FastAPI backend under services/api, wired together in local development via a /api/* proxy/rewrite to FastAPI. Prove end-to-end wiring before auth, DB, or task CRUD."

## Clarifications

### Session 2026-01-14

- Q: Should the FastAPI health endpoint be `/api/health` or `/health`? → A: FastAPI serves health at `GET /api/health`.
- Q: When FastAPI is down, what should `/api/health` return? → A: A 502/connection error from the proxy (no masking).

## User Scenarios & Testing *(mandatory)*


### User Story 1 - Run both services locally (Priority: P1)

As a developer, I can start the web frontend and API backend as separate local processes and confirm both are reachable.

**Why this priority**: Without both processes starting cleanly, there is no foundation to build Phase II features.

**Independent Test**: Start each dev server and load the web home page in a browser.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** I start the web dev server, **Then** the home page renders successfully.
2. **Given** a fresh clone of the repository, **When** I start the API dev server, **Then** the health endpoint returns a successful response.

---

### User Story 2 - Call API through Next.js origin (Priority: P1)

As a developer, I can call the API health endpoint from the browser via the Next.js origin path `/api/health`, proving the proxy/rewrite wiring from Next.js to FastAPI.

**Why this priority**: This validates the core architectural decision that FastAPI owns `/api/*` while the browser uses a single origin.

**Independent Test**: With both servers running, request `/api/health` from the browser (or curl against the Next.js origin) and receive the API’s health payload.

**Acceptance Scenarios**:

1. **Given** the web and API dev servers are running, **When** I request `GET /api/health` against the Next.js origin, **Then** I receive a successful response sourced from the FastAPI backend.

---

### User Story 3 - Minimal, stable health contract (Priority: P2)

As a developer, I have a stable health response contract so future features can depend on a known “API is up” check.

**Why this priority**: A stable health response provides a predictable smoke test for local dev and CI.

**Independent Test**: Call the health endpoint directly on the API service and confirm it returns the expected JSON shape.

**Acceptance Scenarios**:

1. **Given** the API dev server is running, **When** I request the health endpoint directly on the API service, **Then** I receive a JSON response that includes a clear status indicator.

---

### Edge Cases

- If the API server is not running, requesting `/api/health` from the web origin fails clearly (502/connection error) rather than returning a misleading success.
- If the API base URL environment configuration is missing or invalid, the failure is obvious to the developer (misconfiguration causes `/api/health` calls to fail).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST include a Phase II monorepo layout with `apps/web` and `services/api` while keeping existing Phase I code under `src/` intact.
- **FR-002**: The frontend MUST be a Next.js App Router application in `apps/web` and MUST render a minimal home page.
- **FR-003**: The backend MUST be a FastAPI service in `services/api` and MUST expose a health endpoint at `GET /api/health` that returns a stable JSON response.
- **FR-004**: FastAPI MUST be the owner of `/api/*` routes; the frontend MUST NOT implement `/api/*` route handlers for this feature.
- **FR-005**: The frontend MUST proxy/rewrite requests from `/api/:path*` (on the web origin) to the FastAPI service in local development.
- **FR-006**: The FastAPI target base URL for the proxy/rewrite MUST be configurable via environment variables (not hardcoded).
- **FR-007**: The repository MUST NOT commit secrets; sensitive values (present or future, e.g., auth secrets, database URLs) MUST be provided through environment configuration.

### Key Entities *(include if feature involves data)*

- **Service**: A runnable component of the system (web frontend, API backend) that can be started independently in local development.
- **Health Check**: A stable, lightweight endpoint/response that indicates the API service is reachable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer can start the web app and load the home page successfully without code changes.
- **SC-002**: A new developer can start the API service and receive a successful health response.
- **SC-003**: With both services running, a browser request to the API health check through the web app’s origin succeeds and returns the API health payload.
- **SC-004**: The repository contains no committed secrets and uses environment configuration for cross-service wiring.

## Assumptions

- Default local development ports are acceptable (web on 3000, API on 8000).
- This feature intentionally excludes authentication, database connectivity, migrations, and task CRUD.

## Dependencies

- Constitution: `.specify/memory/constitution.md` (Phase II stack + monorepo constraints)

## Out of Scope

- Better Auth setup and login flows
- JWT verification in FastAPI
- Neon database connectivity, schema, or migrations
- Task CRUD endpoints
- Deployment to any hosting provider

## Notes

- This feature is a foundation slice; later specs will add auth, DB, API routes, and UI functionality incrementally.

---

**Ready for**: `/sp.plan` once this spec passes the requirements checklist.
