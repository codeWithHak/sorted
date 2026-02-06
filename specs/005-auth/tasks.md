# Tasks: Authentication

**Input**: Design documents from `/specs/005-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure environment for both frontend and backend auth

- [x] T001 Install Better Auth and pg dependencies in apps/web/package.json
- [x] T002 [P] Add PyJWT[crypto] dependency to services/api/pyproject.toml
- [x] T003 [P] Add BETTER_AUTH_SECRET, BETTER_AUTH_URL, and auth DATABASE_URL to apps/web/.env
- [x] T004 [P] Add JWKS_URL and CORS_ORIGINS to services/api/.env

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before ANY user story can work

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Configure Better Auth server with JWT plugin, email/password provider, and pg database adapter in apps/web/src/lib/auth.ts
- [x] T006 Create Better Auth client with jwtClient plugin in apps/web/src/lib/auth-client.ts
- [x] T007 Create Better Auth catch-all API route handler in apps/web/src/app/api/auth/[...all]/route.ts
- [x] T008 Generate and apply Better Auth database migration to Neon (creates account, session, verification, jwks tables; modifies user table) using npx @better-auth/cli generate
- [x] T009 Update User SQLModel in services/api/src/api/models/user.py to match Better Auth schema (add name, email_verified, image, updated_at; remove hashed_password)
- [x] T010 Implement JWT verification module using PyJWKClient and PyJWT in services/api/src/api/auth/jwt.py
- [x] T011 [P] Create get_current_user FastAPI dependency that extracts user identity from verified JWT in services/api/src/api/auth/dependencies.py
- [x] T012 [P] Create services/api/src/api/auth/__init__.py exporting auth dependencies
- [x] T013 Update Settings in services/api/src/api/config.py to add jwks_url and cors_origins fields
- [x] T014 Add CORS middleware to FastAPI app in services/api/src/api/main.py with configurable origins from settings

**Checkpoint**: Auth infrastructure ready — Better Auth serves /api/auth/* endpoints, FastAPI can verify JWTs and extract user identity. User story implementation can begin.

---

## Phase 3: User Story 1 — New User Creates an Account (Priority: P1)

**Goal**: A new visitor can sign up with email and password, get automatically signed in, and land on the dashboard.

**Independent Test**: Navigate to /auth/signup, fill in email + password (min 8 chars), submit. Verify redirect to /dashboard with active session. Verify JWKS endpoint at /api/auth/jwks returns keys.

### Implementation for User Story 1

- [x] T015 [US1] Create sign-up page with email, name, and password form fields, client-side validation (email format, password min 8 chars), and Better Auth signUp.email call in apps/web/src/app/auth/signup/page.tsx
- [x] T016 [US1] Create placeholder dashboard page that displays the authenticated user's name and email in apps/web/src/app/dashboard/page.tsx
- [x] T017 [US1] Add redirect logic to sign-up page: on success redirect to /dashboard; on duplicate email show error with link to /auth/signin in apps/web/src/app/auth/signup/page.tsx

**Checkpoint**: A new user can create an account, be automatically signed in, and see the dashboard. Independently testable.

---

## Phase 4: User Story 2 — Returning User Signs In (Priority: P1)

**Goal**: A registered user can sign in with email and password and access the dashboard.

**Independent Test**: Sign in with valid credentials for an existing account. Verify redirect to /dashboard. Verify incorrect credentials show generic "Invalid email or password" message.

### Implementation for User Story 2

- [x] T018 [US2] Create sign-in page with email and password form, client-side validation, and Better Auth signIn.email call in apps/web/src/app/auth/signin/page.tsx
- [x] T019 [US2] Add generic error handling to sign-in page: show "Invalid email or password" for all auth failures (no account enumeration) in apps/web/src/app/auth/signin/page.tsx
- [x] T020 [P] [US2] Add navigation links between sign-up and sign-in pages (cross-link in both apps/web/src/app/auth/signup/page.tsx and apps/web/src/app/auth/signin/page.tsx)

**Checkpoint**: Both sign-up and sign-in flows work end-to-end. Users can create accounts and sign back in. Independently testable.

---

## Phase 5: User Story 3 — Authenticated Requests Are Verified (Priority: P1)

**Goal**: The frontend fetches a JWT and attaches it to backend API requests. The backend verifies the JWT and identifies the user.

**Independent Test**: Sign in, then make an authenticated request to the backend (e.g., GET /health with Bearer token). Verify 200. Make a request without a token — verify 401. Make a request with an expired/invalid token — verify 401.

### Implementation for User Story 3

- [x] T021 [US3] Create API client utility that fetches JWT via authClient.token() and attaches it as Authorization: Bearer header to all backend requests in apps/web/src/lib/api-client.ts
- [x] T022 [US3] Add a protected test endpoint to FastAPI (e.g., GET /auth/me) that uses get_current_user dependency and returns the authenticated user's id and email in services/api/src/api/main.py
- [x] T023 [US3] Wire dashboard page to call the protected /auth/me endpoint using the API client and display the result in apps/web/src/app/dashboard/page.tsx

**Checkpoint**: Full auth loop verified — frontend signs in, gets JWT, calls backend, backend verifies JWT and returns user-specific data. Independently testable.

---

## Phase 6: User Story 4 — User Signs Out (Priority: P2)

**Goal**: A signed-in user can click sign out, which clears the session and redirects to sign-in.

**Independent Test**: Sign in, click sign out, verify redirect to /auth/signin. Try accessing /dashboard — verify redirect to sign-in. Try calling backend with the old JWT after session is terminated.

### Implementation for User Story 4

- [x] T024 [US4] Add sign-out button to the dashboard page that calls authClient.signOut() and redirects to /auth/signin in apps/web/src/app/dashboard/page.tsx
- [x] T025 [US4] Add user-facing navigation header with user email display and sign-out button to the authenticated layout in apps/web/src/app/dashboard/layout.tsx

**Checkpoint**: Users can sign out. Session is cleared. Subsequent access to protected pages requires re-authentication. Independently testable.

---

## Phase 7: User Story 5 — Unauthenticated Visitors Are Redirected (Priority: P2)

**Goal**: Unauthenticated visitors who navigate directly to protected pages are redirected to sign-in. After signing in, they return to their original destination.

**Independent Test**: Open /dashboard in a private browser window (not signed in). Verify redirect to /auth/signin. Sign in. Verify redirect back to /dashboard (not the default landing page).

### Implementation for User Story 5

- [x] T026 [US5] Add server-side session check to dashboard layout that redirects unauthenticated visitors to /auth/signin with a callbackUrl query parameter in apps/web/src/app/dashboard/layout.tsx
- [x] T027 [US5] Update sign-in page to read callbackUrl from query params and redirect there after successful sign-in instead of default /dashboard in apps/web/src/app/auth/signin/page.tsx
- [x] T028 [P] [US5] Update sign-up page to also support callbackUrl redirect after successful sign-up in apps/web/src/app/auth/signup/page.tsx

**Checkpoint**: Protected routes are fully guarded. Redirect-after-login works. All 5 user stories are complete and independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T029 [P] Update landing page (apps/web/src/app/page.tsx) with links to sign-in and sign-up pages
- [x] T030 [P] Add startup validation to FastAPI: fail fast if JWKS_URL is not configured in services/api/src/api/config.py
- [ ] T031 Verify CORS works end-to-end: frontend on port 3000 calls backend on port 8000 with Bearer token
- [ ] T032 Run quickstart.md validation: follow all setup steps on a clean environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (sign-up) and US2 (sign-in) can proceed in parallel
  - US3 (JWT verification) depends on US1 or US2 (needs an authenticated user)
  - US4 (sign-out) depends on US1 or US2 (needs a signed-in user)
  - US5 (route protection) depends on US2 (needs sign-in page for redirects)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Sign-up)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (Sign-in)**: Can start after Phase 2 — Can run in parallel with US1
- **US3 (JWT Verification)**: Depends on US1 or US2 being complete (needs authenticated session to fetch JWT)
- **US4 (Sign-out)**: Depends on US1 or US2 being complete (needs sign-in to test sign-out)
- **US5 (Route Protection)**: Depends on US2 (redirects to sign-in page)

### Within Each User Story

- Models/config before services
- Services before UI pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002, T003, T004 can all run in parallel (different files, no dependencies)
- T011 and T012 can run in parallel (different files within backend auth module)
- US1 and US2 can run in parallel after Phase 2 (different pages, independent flows)
- T020 (cross-links) can run in parallel with other US2 tasks
- T028 (callbackUrl for signup) can run in parallel with T026, T027
- T029 and T030 can run in parallel (different services)

---

## Parallel Example: Phase 2 Foundation

```bash
# After T005-T008 complete sequentially (auth config → schema):

# These can run in parallel:
Task T011: "Create get_current_user dependency in services/api/src/api/auth/dependencies.py"
Task T012: "Create __init__.py in services/api/src/api/auth/__init__.py"
Task T013: "Update Settings in services/api/src/api/config.py"
```

## Parallel Example: User Stories 1 & 2

```bash
# After Phase 2 completes, launch both in parallel:

# Developer A — US1:
Task T015: "Create sign-up page in apps/web/src/app/auth/signup/page.tsx"
Task T016: "Create dashboard page in apps/web/src/app/dashboard/page.tsx"

# Developer B — US2:
Task T018: "Create sign-in page in apps/web/src/app/auth/signin/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 3)

1. Complete Phase 1: Setup (install deps, configure env)
2. Complete Phase 2: Foundational (Better Auth config, JWT verification, CORS)
3. Complete Phase 3: US1 — Sign-up flow
4. Complete Phase 4: US2 — Sign-in flow
5. Complete Phase 5: US3 — JWT verification loop
6. **STOP and VALIDATE**: Full auth loop works end-to-end
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US1 (sign-up) → Test independently → Users can create accounts
3. Add US2 (sign-in) → Test independently → Users can sign back in
4. Add US3 (JWT verification) → Test independently → Backend knows who the user is (MVP!)
5. Add US4 (sign-out) → Test independently → Users can sign out securely
6. Add US5 (route protection) → Test independently → Protected routes guarded
7. Polish → Production-ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Better Auth manages user/account/session/verification/jwks tables — do not modify these tables outside of Better Auth
- The `/health` endpoint remains public (no auth required)
