# Feature Specification: AI-Powered Todo Chatbot

**Feature Branch**: `009-ai-todo-chatbot`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Phase III — Replace mock Jett agent with real AI backend using OpenAI Agents SDK, MCP server, streaming SSE, and PostgreSQL conversation persistence"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Task Creation (Priority: P1)

A user opens the chat panel and types a natural language message like "add a task to buy groceries" or "remind me to call the dentist." The AI agent (Jett) understands the intent, creates the task in the database, and responds conversationally confirming the action. The new task appears immediately in the task panel via the existing optimistic UI, and an inline action card shows a clickable reference to the created task.

**Why this priority**: This is the core value proposition — turning natural language into real task operations. Without this, the chatbot has no utility beyond the mock keyword matcher it replaces.

**Independent Test**: Can be fully tested by sending a task creation message via the chat input and verifying (a) the agent responds with confirmation, (b) the task appears in the task panel, (c) an action card renders inline with a clickable task link.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they type "add buy milk" and press send, **Then** a new task titled "buy milk" appears in the task panel, the agent responds with a confirmation message, and an action card with the task link renders inline.
2. **Given** an authenticated user on the dashboard, **When** they type "create a task to finish the report by Friday", **Then** a task titled "finish the report by Friday" is created and confirmed by the agent.
3. **Given** an authenticated user on the dashboard, **When** they type an ambiguous message like "groceries", **Then** the agent asks for clarification rather than creating a task with a single-word title.

---

### User Story 2 - Natural Language Task Queries (Priority: P1)

A user asks "what's on my list?" or "show me my tasks" or "do I have anything to do?" and the agent retrieves and presents their current tasks in a readable, conversational format. The response lists task titles and their completion status.

**Why this priority**: Reading tasks is the complement to creating them — together they form the minimum viable conversational loop.

**Independent Test**: Can be tested by creating a few tasks, then asking the agent to list them and verifying the response accurately reflects the database state.

**Acceptance Scenarios**:

1. **Given** a user with 3 active tasks, **When** they type "what's on my list?", **Then** the agent responds listing all 3 tasks with their titles and completion status.
2. **Given** a user with no tasks, **When** they type "show my tasks", **Then** the agent responds indicating there are no tasks and suggests creating one.
3. **Given** a user with both completed and incomplete tasks, **When** they type "what do I still need to do?", **Then** the agent responds listing only incomplete tasks.

---

### User Story 3 - Natural Language Task Completion (Priority: P1)

A user types "mark the groceries task as done" or "I finished buying milk" or "complete the first one" and the agent identifies the correct task, marks it complete, and confirms the action. The task panel updates immediately. Multi-turn context resolution works — "complete the first one" refers to the task mentioned in a previous exchange.

**Why this priority**: Task completion closes the productivity loop. Multi-turn context resolution is what differentiates a real AI agent from a keyword matcher.

**Independent Test**: Can be tested by creating a task, then asking the agent to complete it using various phrasings, and verifying the task panel reflects the change.

**Acceptance Scenarios**:

1. **Given** a user with a task "buy groceries", **When** they type "mark groceries as done", **Then** the task is marked complete, the task panel updates, and the agent confirms with an action card.
2. **Given** a previous exchange where the agent listed 3 tasks, **When** the user types "complete the first one", **Then** the agent correctly resolves "the first one" to the first task from the previous listing and marks it complete.
3. **Given** a user types "done with something" that matches multiple tasks, **When** the agent cannot determine which task, **Then** it asks for clarification listing the matching options.

---

### User Story 4 - Streaming Responses (Priority: P2)

When the user sends a message, the response streams in token-by-token in real time rather than appearing all at once. The thinking indicator shows while waiting for the first token, then disappears as text begins rendering. This creates a responsive, conversational feel.

**Why this priority**: Streaming is essential for perceived responsiveness — without it, users stare at a thinking indicator for seconds. It differentiates the real agent from the mock's artificial delay.

**Independent Test**: Can be tested by sending a message and observing that (a) the thinking indicator appears immediately, (b) response text begins appearing within 500ms, (c) tokens render incrementally.

**Acceptance Scenarios**:

1. **Given** a user sends a message, **When** the backend begins generating a response, **Then** the thinking indicator appears within 100ms of pressing send and the first token renders within 500ms.
2. **Given** a streaming response in progress, **When** the agent is mid-sentence, **Then** tokens appear incrementally (not in large chunks) creating a typing effect.

---

### User Story 5 - Conversation Persistence (Priority: P2)

Conversations persist across page reloads, browser restarts, and device switches. When a user returns to the dashboard, their previous conversations are loaded from the database. A user can have multiple conversation threads, and the chat panel loads the most recent thread by default.

**Why this priority**: Without persistence, users lose context every time they refresh. Moving from localStorage to the database enables cross-device access and eliminates data loss.

**Independent Test**: Can be tested by having a conversation, reloading the page, and verifying the conversation history is intact and loaded from the server.

**Acceptance Scenarios**:

1. **Given** a user has an active conversation with 5 messages, **When** they refresh the page, **Then** all 5 messages reload from the server with correct content and timestamps.
2. **Given** a user has no previous conversations, **When** they send their first message, **Then** a new thread is created automatically with a title derived from their first message.
3. **Given** a user has multiple conversation threads, **When** they load the dashboard, **Then** the most recent thread loads by default.

---

### User Story 6 - Task Update and Deletion via Chat (Priority: P2)

A user types "rename the groceries task to weekly shopping" or "delete the milk task" and the agent performs the operation, confirms, and the task panel updates accordingly.

**Why this priority**: Update and delete complete the full CRUD coverage, making the chat a complete replacement for manual task management.

**Independent Test**: Can be tested by creating a task, updating its title via chat, verifying the change in the task panel, then deleting it and verifying removal.

**Acceptance Scenarios**:

1. **Given** a task titled "buy milk", **When** the user types "rename buy milk to get almond milk", **Then** the task title updates in the task panel and the agent confirms.
2. **Given** a task titled "old task", **When** the user types "delete old task", **Then** the task is soft-deleted, removed from the task panel, and the agent confirms with an action card.
3. **Given** the user types "delete task XYZ" for a non-existent task, **Then** the agent responds helpfully: "I couldn't find that task. Try listing your tasks to see what's available."

---

### User Story 7 - Error Handling and Graceful Degradation (Priority: P3)

When the AI service is unavailable, rate-limited, or a tool call fails, the agent responds with a helpful, user-friendly message rather than crashing or showing raw errors. The chat remains functional and the user can retry.

**Why this priority**: Robustness is essential for trust but is less critical than core functionality for initial delivery.

**Independent Test**: Can be tested by simulating API failures and verifying the agent responds gracefully.

**Acceptance Scenarios**:

1. **Given** the AI service returns a rate limit error, **When** the user sends a message, **Then** the agent responds with a friendly retry message.
2. **Given** a tool call fails due to a database error, **When** the agent attempts to create a task, **Then** the agent informs the user that the action couldn't be completed and suggests retrying.
3. **Given** the AI service is completely unreachable, **When** the user sends a message, **Then** the thinking indicator stops within 10 seconds and a helpful error message appears.

---

### Edge Cases

- What happens when the user sends an empty message? The input prevents submission (existing behavior).
- What happens when the conversation exceeds 50 messages in a thread? Only the last 50 messages are loaded as agent context; older messages are excluded but preserved in the database.
- What happens when two browser tabs send messages to the same thread simultaneously? The backend serializes writes per thread; both messages are persisted in order.
- What happens when the user's JWT expires mid-conversation? The chat endpoint returns 401; the frontend prompts re-authentication.
- What happens when the agent's response references a task that was deleted between the query and the response? The agent handles stale references gracefully, noting the task may have changed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept natural language messages via the chat input and route them to an AI agent for interpretation and response.
- **FR-002**: The AI agent MUST be able to create, list, complete, update, and soft-delete tasks through natural language commands, operating on the authenticated user's tasks only.
- **FR-003**: System MUST stream agent responses token-by-token to the frontend via server-sent events (SSE), with first token arriving within 500ms of message submission.
- **FR-004**: System MUST persist conversation history (threads and messages) in the database, surviving page reloads, browser restarts, and server restarts.
- **FR-005**: System MUST enforce user isolation — the agent can only read and modify tasks belonging to the authenticated user, never another user's tasks.
- **FR-006**: When the agent performs a task-modifying operation (create, complete, update, delete), the system MUST emit a structured event in the SSE stream that triggers the task panel to refresh.
- **FR-007**: Action cards MUST render inline in the chat for task-modifying operations, showing clickable task references that highlight the corresponding task in the task panel.
- **FR-008**: The agent MUST support multi-turn conversation context — references like "complete the first one" or "delete that task" MUST resolve correctly based on conversation history.
- **FR-009**: System MUST auto-generate a thread title from the first user message in a new conversation.
- **FR-010**: System MUST load the last 50 messages per thread as agent context, excluding older messages while preserving them in the database.
- **FR-011**: System MUST handle AI service errors (rate limits, timeouts, unreachable API) gracefully, displaying user-friendly error messages without exposing raw error details.
- **FR-012**: System MUST expose conversation thread listing and message retrieval endpoints for loading history on page load.
- **FR-013**: The AI agent MUST NOT fabricate tasks that don't exist in the database or claim to have performed actions it didn't execute.
- **FR-014**: The agent's personality MUST be helpful, concise, and slightly playful, consistent with the "Jett" brand.
- **FR-015**: The API key for the AI service MUST be stored server-side only and never exposed to the frontend.

### Key Entities

- **Chat Thread**: A conversation container scoped to a single user. Has a title (auto-generated from first message), timestamps, and an ordered collection of messages. Each user can have multiple threads.
- **Chat Message**: An individual message within a thread. Has a role (user or assistant), text content, optional tool call metadata, and a timestamp. Messages are ordered chronologically within a thread.
- **Task** (existing): A todo item with title, description, completion status, and user ownership. Extended with agent interaction — tasks can be created, modified, or queried via the AI agent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create, list, complete, update, and delete tasks using natural language with at least 90% success rate for unambiguous commands (e.g., "add buy milk", "mark groceries as done").
- **SC-002**: Streamed responses begin rendering within 500ms of the user pressing send (time-to-first-token), measured across typical operations.
- **SC-003**: Conversation history persists across page reloads and server restarts with zero data loss for committed messages.
- **SC-004**: Action cards appear inline for every task-modifying operation, and clicking a task reference highlights the corresponding task in the task panel.
- **SC-005**: The agent never reveals, modifies, or acknowledges tasks belonging to other users, verified by a dedicated security test suite.
- **SC-006**: The agent responds with helpful, non-technical messages for all error conditions (API failures, rate limits, tool errors) — no raw error output ever reaches the user.
- **SC-007**: Multi-turn context resolution works correctly — references like "complete the first one" resolve to the correct task from prior conversation context, verified by at least 5 multi-turn test cases.
- **SC-008**: New backend code achieves at least 70% test coverage.
- **SC-009**: Agent quality evaluation scores above 0.7 overall across factual accuracy, completeness, and tool efficiency dimensions, measured by an evaluation suite with at least 20 test cases.

## Assumptions

- The AI service provider is available and the user has a valid API key configured server-side.
- The existing authentication and authorization flow (Better Auth JWT + JWKS verification) continues to work without modification.
- The existing task CRUD endpoints and database schema remain unchanged; new chat tables are additive only.
- The existing chat UI components (ChatPanel, ChatMessage, ChatInput, ThinkingIndicator, ActionCard) are reused without visual changes — only the data/hook layer changes.
- The AI agent and its tools run in-process with the backend (not as separate services).
- Thread title generation uses a lightweight prompt to the same AI model, not a separate agent or model.
- The last 50 messages provide sufficient context for multi-turn resolution in typical conversations.

## Scope Boundaries

### In Scope

- AI agent (Jett) with 5 task tools, streaming, personality, and guardrails
- Task tools exposing CRUD operations with user isolation
- Chat API endpoints (send message, list threads, get thread messages)
- Conversation persistence (chat_threads and chat_messages tables)
- Frontend hook replacement (useChat wired to real SSE backend instead of mock)
- Task panel synchronization via SSE events
- Error handling for AI service failures
- Agent evaluation suite with 20+ test cases

### Out of Scope

- Voice input or file attachments
- Multiple agents beyond Jett
- Real-time collaborative chat (multi-user in same thread)
- Any new UI component library or chat SDK
- Production deployment configuration
- Advanced features like recurring tasks, due dates, or priorities
- Any UI redesign beyond wiring existing components to the real backend
- Message pruning or token budget management beyond the 50-message window

## Dependencies

- AI service provider for agent inference
- Existing backend with task CRUD and JWT verification
- Existing frontend with chat UI components and optimistic task management
- PostgreSQL database for conversation persistence (additive tables only)
