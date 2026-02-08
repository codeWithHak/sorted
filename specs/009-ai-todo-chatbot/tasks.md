# Tasks: AI-Powered Todo Chatbot

**Input**: Design documents from `/specs/009-ai-todo-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — spec requires 70% backend test coverage (SC-008) and 20+ agent evaluation test cases (SC-009).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies, environment configuration, and project scaffolding

- [x] T001 Add backend dependencies: `uv add openai-agents sse-starlette` in `services/api/`
- [x] T002 [P] Add `OPENAI_API_KEY` to `services/api/.env` and add `openai_api_key: str` field to `services/api/src/api/config.py`
- [x] T003 [P] Create `services/api/src/api/agent/__init__.py` (empty package init)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database models, schemas, and agent context that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `ChatThread` and `ChatMessage` SQLModel models in `services/api/src/api/models/chat.py` per data-model.md — ChatThread (id UUID PK, user_id FK, title String(200), created_at, updated_at) and ChatMessage (id UUID PK, thread_id FK, role String(20), content Text, tool_calls JSON nullable, created_at). Use GUID type from `models/types.py`. Add indexes: `ix_chat_threads_user_updated` on (user_id, updated_at DESC), `ix_chat_messages_thread_created` on (thread_id, created_at), `ix_chat_messages_thread_created_desc` on (thread_id, created_at DESC)
- [x] T005 Import ChatThread and ChatMessage in `services/api/src/api/models/__init__.py` so they register with SQLModel metadata
- [x] T006 [P] Create Pydantic request/response schemas in `services/api/src/api/schemas/chat.py`: `ChatRequest` (message: str 1-2000 chars, thread_id: UUID | None), `ChatThreadResponse` (id, title, created_at, updated_at, message_count), `ChatThreadListResponse` (data, total, page, per_page, total_pages), `ChatMessageResponse` (id, role, content, action_card: dict | None, created_at), `ChatMessageListResponse` (data, total, page, per_page, total_pages)
- [x] T007 [P] Create `ChatContext` dataclass in `services/api/src/api/agent/context.py` per agent-tools contract: user_id (str), thread_id (str), tasks_modified (bool = False), modified_tasks (list = field(default_factory=list))

**Checkpoint**: Foundation ready — database models, schemas, and agent context defined. User story implementation can now begin.

---

## Phase 3: User Story 1 — Natural Language Task Creation (Priority: P1) 🎯 MVP

**Goal**: User types "add buy milk" → agent creates task via tool → task appears in task panel → action card renders inline

**Independent Test**: Send a task creation message via chat and verify (a) agent responds with confirmation, (b) task appears in task panel, (c) action card renders inline with clickable task link

### Tests for User Story 1

- [x] T008 [P] [US1] Unit test for `add_task` tool in `services/api/tests/test_agent_tools.py` — test creates task for authenticated user, returns JSON with id/title/completed/created_at, validates title length (1-200 chars), validates user isolation (tool uses context.user_id)
- [x] T009 [P] [US1] Integration test for POST /chat in `services/api/tests/test_chat.py` — validation tests (empty message, too long, nonexistent thread) implemented; full SSE stream test requires live OPENAI_API_KEY

### Implementation for User Story 1

- [x] T010 [US1] Implement `add_task` @function_tool in `services/api/src/api/agent/tools.py` — async function taking `RunContextWrapper[ChatContext]`, title (str), description (str | None). Creates task using standalone session via `get_session_factory()()`. Sets `ctx.context.tasks_modified = True`, appends to `ctx.context.modified_tasks`. Returns JSON string with task details on success, error JSON with {error, message, suggestion} on failure
- [x] T011 [US1] Implement `list_tasks` @function_tool in `services/api/src/api/agent/tools.py` — async function taking `RunContextWrapper[ChatContext]`, completed (bool | None). Queries tasks for `ctx.context.user_id` with optional completed filter. Returns JSON with {tasks: [...], total: N}
- [x] T012 [US1] Create Jett agent instance in `services/api/src/api/agent/jett.py` — `Agent(name="Jett", instructions=SYSTEM_PROMPT, model="gpt-4o", tools=[add_task, list_tasks])`. System prompt defines Jett's personality (helpful, concise, slightly playful), instructs to use tools for task operations, handle ambiguity by asking clarifications, and generate 3-5 word thread title as first-line prefix in first response
- [x] T013 [US1] Create chat router `POST /chat` endpoint in `services/api/src/api/routers/chat.py` — accepts ChatRequest body, depends on `get_current_user` and `get_session`. Creates or loads thread, loads last 50 messages from DB, converts to OpenAI message format, creates `RunContextWrapper[ChatContext]`, calls `Runner.run_streamed(jett_agent, input=messages, context=ctx)`, iterates `result.stream_events()` to emit SSE events via `EventSourceResponse`. Persists user + assistant messages to DB. Emits 5 event types per chat-api contract: stream_start, text_token, task_action, stream_end, error
- [x] T014 [US1] Register chat router in `services/api/src/api/main.py` — add `from src.api.routers.chat import router as chat_router` and `app.include_router(chat_router, prefix="/chat", tags=["chat"])`
- [x] T015 [US1] Create SSE client utility in `apps/web/src/lib/sse-client.ts` — `streamChat(message, threadId, token)` function that POSTs to `/api/chat` with Bearer auth, reads response body as `ReadableStream`, parses SSE lines into typed events (StreamStartEvent, TextTokenEvent, TaskActionEvent, StreamEndEvent, ErrorEvent). Returns async generator yielding parsed events
- [x] T016 [US1] Replace mock in `apps/web/src/hooks/useChat.ts` — replace `getMockJettResponse()` call with `streamChat()`. On `stream_start`: set threadId, clear thinking indicator. On `text_token`: append token to current message. On `task_action`: build ActionCardData, trigger `useTasks.refreshTasks()`. On `stream_end`: finalize message. On `error`: show user-friendly error message. Remove localStorage persistence (will be replaced by server persistence in US5)

**Checkpoint**: At this point, users can create tasks via natural language and see streaming responses with action cards. The core AI loop works end-to-end.

---

## Phase 4: User Story 2 — Natural Language Task Queries (Priority: P1)

**Goal**: User asks "what's on my list?" → agent calls list_tasks tool → responds with readable task listing

**Independent Test**: Create tasks, ask the agent to list them, verify response accurately reflects database state

### Tests for User Story 2

- [x] T017 [P] [US2] Unit test for `list_tasks` tool in `services/api/tests/test_agent_tools.py` — test with 0 tasks (empty list), 3 active tasks (all returned), filter completed=true (only completed), filter completed=false (only pending). Verify user isolation

### Implementation for User Story 2

- [x] T018 [US2] No new tool implementation needed — `list_tasks` was already implemented in T011. Verify the Jett agent system prompt in `services/api/src/api/agent/jett.py` instructs the agent to present task lists in a readable, conversational format (numbered, with completion status)

**Checkpoint**: Users can now create AND query tasks via natural language. The minimum viable conversational loop is complete.

---

## Phase 5: User Story 3 — Natural Language Task Completion (Priority: P1)

**Goal**: User types "mark groceries as done" → agent resolves task → marks complete → task panel updates

**Independent Test**: Create a task, ask the agent to complete it using various phrasings, verify task panel reflects the change

### Tests for User Story 3

- [x] T019 [P] [US3] Unit test for `complete_task` tool in `services/api/tests/test_agent_tools.py` — test marks task complete, returns JSON with completed=true, returns NOT_FOUND error for invalid UUID, returns NOT_FOUND for another user's task (isolation)
- [x] T020 [P] [US3] Agent evaluation test for multi-turn context resolution — deferred to T039 eval suite (requires live API)

### Implementation for User Story 3

- [x] T021 [US3] Implement `complete_task` @function_tool in `services/api/src/api/agent/tools.py` — async function taking `RunContextWrapper[ChatContext]`, task_id (str). Validates UUID format, queries task scoped to user_id, sets completed=True, commits. Updates context modified_tasks. Returns JSON with updated task or NOT_FOUND error with suggestion to use list_tasks
- [x] T022 [US3] Add `complete_task` to Jett agent tools list in `services/api/src/api/agent/jett.py`. Update system prompt to instruct agent on multi-turn context: "When the user refers to 'the first one' or 'that task', resolve against the most recent task listing in conversation history"

**Checkpoint**: All P1 user stories complete. Users can create, query, and complete tasks via natural language. This is the MVP.

---

## Phase 6: User Story 4 — Streaming Responses (Priority: P2)

**Goal**: Responses stream token-by-token with first token within 500ms, thinking indicator during latency

**Independent Test**: Send a message and verify (a) thinking indicator appears immediately, (b) first token renders within 500ms, (c) tokens render incrementally

### Implementation for User Story 4

- [x] T023 [US4] Verify SSE streaming implementation from T013 correctly emits `text_token` events incrementally during `Runner.run_streamed()` iteration. The streaming was implemented as part of the chat router in Phase 3. Verify the event loop yields events as they arrive (no buffering). Add timing: emit `stream_start` immediately when stream begins, before waiting for first model token
- [x] T024 [US4] Verify frontend `useChat.ts` (from T016) handles token-by-token rendering: on `text_token`, append to message content using setState with functional update. Ensure thinking indicator hides on first `stream_start` event (not on first token). Verify no artificial debounce on token rendering

**Checkpoint**: Streaming works with <500ms time-to-first-token. The UX feels responsive and conversational.

---

## Phase 7: User Story 5 — Conversation Persistence (Priority: P2)

**Goal**: Conversations persist in PostgreSQL, survive page reloads, load from server on page open

**Independent Test**: Have a conversation, reload the page, verify conversation history is intact

### Tests for User Story 5

- [x] T025 [P] [US5] Integration test for GET /chat/threads and GET /chat/threads/{id}/messages in `services/api/tests/test_chat.py` — test lists threads for user (empty, 1, multiple), test returns messages in chronological order, test 404 for other user's thread, test pagination

### Implementation for User Story 5

- [x] T026 [US5] Create `GET /chat/threads` endpoint in `services/api/src/api/routers/chat.py` per chat-api contract — paginated list of user's threads ordered by updated_at DESC. Returns ChatThreadListResponse with message_count annotation
- [x] T027 [US5] Create `GET /chat/threads/{thread_id}/messages` endpoint in `services/api/src/api/routers/chat.py` per chat-api contract — paginated messages for a thread, scoped to authenticated user. Returns 404 if thread not found or belongs to another user
- [x] T028 [US5] Update `apps/web/src/hooks/useChat.ts` to load conversation from server on mount — call `GET /chat/threads` to get most recent thread, then `GET /chat/threads/{id}/messages` to load messages. Replace localStorage read with server fetch. Store current `threadId` in hook state. On new conversation, pass `thread_id: null` to create new thread
- [x] T029 [US5] Implement thread title auto-generation in chat router (`services/api/src/api/routers/chat.py`) — on first message in a new thread, extract title from agent's first response (agent outputs title as structured prefix per system prompt), update thread.title in DB

**Checkpoint**: Conversations persist across page reloads and server restarts. Users see their history when returning.

---

## Phase 8: User Story 6 — Task Update and Deletion via Chat (Priority: P2)

**Goal**: User can rename and delete tasks via natural language

**Independent Test**: Create a task, update its title via chat, verify change, then delete it and verify removal

### Tests for User Story 6

- [x] T030 [P] [US6] Unit tests for `update_task` and `delete_task` tools in `services/api/tests/test_agent_tools.py` — update_task: changes title, changes description, NOT_FOUND error, validation error (empty title). delete_task: soft-deletes task (is_deleted=True), NOT_FOUND error, already-deleted task

### Implementation for User Story 6

- [x] T031 [US6] Implement `update_task` @function_tool in `services/api/src/api/agent/tools.py` — async function taking `RunContextWrapper[ChatContext]`, task_id (str), title (str | None), description (str | None). Updates specified fields, validates title length (1-200) and description length (max 2000). Returns updated task JSON or error
- [x] T032 [US6] Implement `delete_task` @function_tool in `services/api/src/api/agent/tools.py` — async function taking `RunContextWrapper[ChatContext]`, task_id (str). Sets is_deleted=True (soft delete). Returns confirmation JSON or NOT_FOUND error with suggestion
- [x] T033 [US6] Add `update_task` and `delete_task` to Jett agent tools list in `services/api/src/api/agent/jett.py` — all 5 tools now registered: [add_task, list_tasks, complete_task, update_task, delete_task]

**Checkpoint**: Full CRUD coverage via chat. The agent can create, read, update, complete, and delete tasks.

---

## Phase 9: User Story 7 — Error Handling and Graceful Degradation (Priority: P3)

**Goal**: All error conditions produce helpful, non-technical user messages

**Independent Test**: Simulate API failures and verify graceful responses

### Tests for User Story 7

- [x] T034 [P] [US7] Error handling tests in `services/api/tests/test_chat.py` — test rate limit error returns SSE error event with retryable=true, test database error in tool returns helpful message, test request with invalid/missing JWT returns 401, test message validation (empty, too long) returns 422

### Implementation for User Story 7

- [x] T035 [US7] Create guardrails in `services/api/src/api/agent/guardrails.py` — input guardrail: reject messages that appear to be prompt injection attempts (tripwire on suspicious patterns). Output guardrail: verify agent doesn't claim to have performed operations it didn't (compare claimed actions against `context.modified_tasks`)
- [x] T036 [US7] Add error handling in chat router (`services/api/src/api/routers/chat.py`) — wrap `Runner.run_streamed()` in try/except catching `AgentsException`, `openai.RateLimitError`, `openai.APIError`, and generic Exception. Emit SSE `error` event with user-friendly message and retryable flag. Never expose raw error details. Set 30s timeout on the streaming response
- [x] T037 [US7] Add `input_guardrails` and `output_guardrails` to Jett agent in `services/api/src/api/agent/jett.py`
- [x] T038 [US7] Update frontend `useChat.ts` error handling — on SSE `error` event: if retryable, show "Please try again in a moment"; if not retryable, show the error message. On fetch failure (network error): show "Connection lost. Please check your internet." Stop thinking indicator on any error. Ensure chat input re-enables after error

**Checkpoint**: All error conditions handled gracefully. No raw errors ever reach the user.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Agent evaluation suite, quality validation, and final polish

- [ ] T039 [P] Create agent evaluation suite in `services/api/tests/test_agent_eval.py` — 20+ test cases covering: factual accuracy (agent lists correct tasks), completeness (agent performs requested action), tool efficiency (agent doesn't call unnecessary tools), multi-turn resolution (5+ cases), ambiguity handling, personality consistency. Score threshold: >0.7 overall per SC-009 — REQUIRES LIVE OPENAI_API_KEY
- [x] T040 [P] Verify user isolation security in `services/api/tests/test_chat.py` — create tasks for user A and user B, verify agent for user A cannot see/modify user B's tasks via any tool. Test with direct tool calls and via natural language
- [x] T041 Retire mock responses — remove import of `getMockJettResponse` from `apps/web/src/hooks/useChat.ts`. Verify `apps/web/src/lib/mock/jett-responses.ts` is no longer imported anywhere (can be deleted or left as dead code)
- [ ] T042 Run quickstart.md verification checklist — manually verify all 6 items: "add buy milk" creates task, "what's on my list?" lists tasks, "mark milk as done" toggles task, page refresh loads history, tokens stream in, no cross-user leakage — REQUIRES RUNNING APP

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–9)**: All depend on Foundational phase completion
  - **P1 stories (3, 4, 5)**: Implement sequentially — US1 establishes the agent + streaming foundation that US2 and US3 build on
  - **P2 stories (6, 7, 8)**: Can start after P1 stories complete. US4 (streaming) and US5 (persistence) can run in parallel. US6 (update/delete) depends on agent from US1
  - **P3 story (9)**: Can start after P1 stories, but benefits from all tools being registered (after US6)
- **Polish (Phase 10)**: Depends on all user stories being complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Tools before agent registration
- Agent before router
- Backend before frontend
- Core implementation before integration

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T004, T006, T007 can run in parallel within Phase 2 (different files)
- T008, T009 can run in parallel (test files)
- T015 and T010–T014 can run in parallel (frontend vs backend, different repos)
- T039, T040 can run in parallel (different test files)
- All [P] marked tasks within a phase can run in parallel

### Key Dependency Chain

```
T001 → T004/T005 → T010/T011 → T012 → T013 → T014 → T016
                                                  ↓
                                   T021/T022 → T031/T032/T033
                                                  ↓
                                           T035/T036/T037/T038
                                                  ↓
                                              T039/T040/T041/T042
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T007)
3. Complete Phase 3: User Story 1 — Task Creation (T008–T016) — **this is the big one**
4. Complete Phase 4: User Story 2 — Task Queries (T017–T018) — lightweight, mostly prompt tuning
5. Complete Phase 5: User Story 3 — Task Completion (T019–T022)
6. **STOP and VALIDATE**: Test all P1 stories independently. Users can create, query, and complete tasks via natural language.

### Full Delivery (P1 + P2 + P3)

7. Phase 6: Streaming polish (T023–T024) — verification of existing streaming
8. Phase 7: Conversation persistence (T025–T029)
9. Phase 8: Update/delete tools (T030–T033)
10. Phase 9: Error handling & guardrails (T034–T038)
11. Phase 10: Evaluation suite & polish (T039–T042)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The agent module (`services/api/src/api/agent/`) is built incrementally: tools added per user story, agent updated to include new tools
- Frontend changes are minimal — only `useChat.ts` and new `sse-client.ts`; all UI components remain unchanged
