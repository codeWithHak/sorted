# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `009-ai-todo-chatbot` | **Date**: 2026-02-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-ai-todo-chatbot/spec.md`

## Summary

Replace the mock Jett keyword matcher with a real AI agent powered by the OpenAI Agents SDK. The agent understands natural language, operates on real tasks through 5 function tools (add, list, complete, update, delete), streams responses via SSE, and persists conversations in PostgreSQL. The existing chat UI components are reused unchanged — only the data/hook layer is rewired.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK (`openai-agents`), `sse-starlette`, SQLModel, Next.js 16+, React 19
**Storage**: Neon Serverless PostgreSQL (existing + 2 new tables: `chat_threads`, `chat_messages`)
**Testing**: pytest + pytest-asyncio (backend), 20+ agent evaluation test cases
**Target Platform**: Linux server (backend), web browser (frontend)
**Project Type**: Web application (monorepo: `apps/web/` + `services/api/`)
**Performance Goals**: <500ms time-to-first-token for streamed responses
**Constraints**: API key server-side only; user isolation on all queries; last 50 messages as context window
**Scale/Scope**: Single-user conversations, ~100 tasks per user, ~50 messages per thread context

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Phase III tech stack (OpenAI Agents SDK, MCP tools pattern) | PASS | Using `openai-agents` as mandated |
| Async-first design | PASS | All I/O is async (agent, DB, SSE streaming) |
| Security by default | PASS | JWT auth on all endpoints, user isolation on all queries, API key server-side only |
| Spec-driven development | PASS | Full spec at spec.md, plan here, tasks via /sp.tasks |
| Readability over cleverness | PASS | Standard patterns: function tools, async generators, typed events |
| Skills-first documentation | PASS | Research used scaffolding-openai-agents, building-mcp-servers, tool-design, scaffolding-fastapi skills |
| No premature optimization | PASS | No caching, no token pruning beyond 50-message window |
| Smallest viable diff | PASS | Only new files + one hook replacement; no UI changes |

**Post-Phase 1 re-check**: All gates still pass. The design adds 2 database tables, 1 new router, 1 agent module, and 1 frontend hook replacement. No existing code is modified except `main.py` (add router import) and `models/__init__.py` (add chat model imports).

## Project Structure

### Documentation (this feature)

```text
specs/009-ai-todo-chatbot/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   ├── chat-api.md      # Phase 1: Chat REST + SSE API
│   └── agent-tools.md   # Phase 1: Agent tool interfaces
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
services/api/
├── src/api/
│   ├── agent/                    # NEW: AI agent module
│   │   ├── __init__.py
│   │   ├── context.py            # ChatContext dataclass
│   │   ├── tools.py              # 5 @function_tool implementations
│   │   ├── jett.py               # Agent instance + system prompt
│   │   └── guardrails.py         # Input/output guardrails
│   ├── models/
│   │   ├── __init__.py           # MODIFY: add ChatThread, ChatMessage imports
│   │   └── chat.py               # NEW: ChatThread + ChatMessage SQLModel
│   ├── schemas/
│   │   └── chat.py               # NEW: Chat request/response Pydantic models
│   ├── routers/
│   │   └── chat.py               # NEW: POST /chat, GET /chat/threads, GET /chat/threads/{id}/messages
│   ├── main.py                   # MODIFY: add chat_router import
│   ├── config.py                 # MODIFY: add openai_api_key field
│   └── database.py               # MODIFY: import chat models in lifespan
└── tests/
    ├── test_chat.py              # NEW: Chat endpoint tests
    └── test_agent_tools.py       # NEW: Agent tool unit tests

apps/web/
├── src/
│   ├── lib/
│   │   ├── sse-client.ts         # NEW: SSE parser + streaming fetch client
│   │   └── mock/
│   │       └── jett-responses.ts # RETIRE: no longer imported
│   └── hooks/
│       └── useChat.ts            # MODIFY: replace mock with real SSE streaming
```

**Structure Decision**: Extends the existing monorepo structure. New `agent/` package under `services/api/src/api/` contains all AI-specific code (agent, tools, guardrails, context). New chat models, schemas, and router follow the same pattern as existing task CRUD.

## Complexity Tracking

No constitution violations. All new code follows existing patterns.

## Architecture Overview

```
[Browser] ──POST /chat──► [FastAPI chat router]
                              │
                              ├─ Verify JWT (existing get_current_user)
                              ├─ Load thread + last 50 messages from DB
                              ├─ Create RunContextWrapper[ChatContext]
                              ├─ Runner.run_streamed(jett_agent, input=messages, context=ctx)
                              │
                              │  ┌─────────────────────────────┐
                              │  │ Jett Agent (OpenAI)         │
                              │  │  - System prompt            │
                              │  │  - 5 function tools         │
                              │  │  - Input/output guardrails  │
                              │  └──────────┬──────────────────┘
                              │             │
                              │  ┌──────────▼──────────────────┐
                              │  │ Tool Execution (same proc)  │
                              │  │  - add_task → DB INSERT     │
                              │  │  - list_tasks → DB SELECT   │
                              │  │  - complete_task → DB UPDATE │
                              │  │  - update_task → DB UPDATE  │
                              │  │  - delete_task → DB UPDATE  │
                              │  └─────────────────────────────┘
                              │
                              ├─ Stream SSE events: text_token, task_action
                              ├─ Persist user + assistant messages to DB
                              └─ Send stream_end event
```

## Key Design Decisions

### 1. Agent tools as @function_tool (not separate MCP transport)

The OpenAI Agents SDK uses `@function_tool` for tool registration. Since the agent and tools run in the same process as FastAPI, there's no need for MCP stdio/HTTP transport between them. The tools follow MCP design principles (naming, descriptions, actionable errors) but are registered directly on the agent. A separate MCP server can be added later if external clients (e.g., Claude Desktop) need access.

### 2. Stateless agent, database-backed context

The agent is stateless per request. On each chat message:
1. Load last 50 messages from `chat_messages` table
2. Convert to OpenAI message format
3. Pass to `Runner.run_streamed()` as `input`
4. After completion, persist new user + assistant messages

This means conversations survive server restarts without any in-memory state.

### 3. SSE event protocol

Five event types bridge the agent's behavior to the frontend:
- `stream_start`: metadata (thread_id, message_id) — frontend hides thinking indicator
- `text_token`: incremental text — frontend appends to current message
- `task_action`: task was modified — frontend builds ActionCard + refreshes task panel
- `stream_end`: response complete — frontend finalizes message
- `error`: something went wrong — frontend shows user-friendly message

### 4. Standalone database sessions for tools

Agent tools can't use FastAPI's dependency-injected sessions (they run outside the request context). Instead, tools create standalone sessions using the existing `get_session_factory()`:

```python
async with get_session_factory()() as session:
    # ... database operations ...
    await session.commit()
```

### 5. Thread title auto-generation

On the first message in a new thread, the agent generates a 3-5 word title. This happens inline during the response — no separate API call or model invocation. The system prompt instructs the agent to output a title as a structured prefix in its first response, which the chat router extracts and stores.

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OpenAI API latency causing >500ms TTFT | Medium | High (UX) | Streaming mitigates perceived latency; thinking indicator provides immediate feedback |
| Agent hallucinating task operations | Low | High (trust) | Output guardrail checks that claimed operations match actual tool calls |
| Token costs on long conversations | Low | Medium (cost) | 50-message context window limits input tokens; can be tuned down |
| Agent failing to resolve ambiguous references | Medium | Low (UX) | Agent instructed to ask for clarification; graceful fallback |
