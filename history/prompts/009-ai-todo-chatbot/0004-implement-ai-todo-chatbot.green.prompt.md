---
id: "0004"
title: "Implement AI Todo Chatbot"
stage: green
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 009-ai-todo-chatbot
branch: 009-ai-todo-chatbot
user: hak
command: /sp.implement
labels: ["implementation", "ai-chatbot", "openai-agents", "sse", "streaming", "crud-tools"]
links:
  spec: specs/009-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - services/api/src/api/agent/__init__.py
  - services/api/src/api/agent/context.py
  - services/api/src/api/agent/tools.py
  - services/api/src/api/agent/jett.py
  - services/api/src/api/agent/guardrails.py
  - services/api/src/api/models/chat.py
  - services/api/src/api/models/__init__.py
  - services/api/src/api/schemas/chat.py
  - services/api/src/api/routers/chat.py
  - services/api/src/api/config.py
  - services/api/src/api/main.py
  - services/api/src/api/database.py
  - services/api/tests/test_agent_tools.py
  - services/api/tests/test_chat.py
  - apps/web/src/lib/sse-client.ts
  - apps/web/src/hooks/useChat.ts
  - apps/web/src/app/dashboard/page.tsx
tests:
  - services/api/tests/test_agent_tools.py (16 tests — all 5 tools)
  - services/api/tests/test_chat.py (11 tests — endpoints + validation)
---

## Prompt

/sp.implement (executed on feature 009-ai-todo-chatbot, implementing all tasks from tasks.md)

## Response snapshot

Implemented the full AI-powered todo chatbot across 10 phases, completing 40 of 42 tasks (2 deferred to live API testing).

**Backend (Python/FastAPI):**
- New `agent/` package: context.py (ChatContext dataclass), tools.py (5 @function_tool implementations: add_task, list_tasks, complete_task, update_task, delete_task), jett.py (Agent with system prompt, 5 tools, guardrails), guardrails.py (input injection detection + output consistency check)
- New `models/chat.py`: ChatThread and ChatMessage SQLModel entities with indexes
- New `schemas/chat.py`: Request/response Pydantic models for chat API
- New `routers/chat.py`: POST /chat (SSE streaming), GET /chat/threads (paginated), GET /chat/threads/{id}/messages (paginated)
- Modified: config.py (+openai_api_key), main.py (+chat_router), database.py (+chat model imports), models/__init__.py (+chat exports)

**Frontend (TypeScript/Next.js):**
- New `sse-client.ts`: fetch + ReadableStream SSE parser with typed events (stream_start, text_token, task_action, stream_end, error)
- Modified `useChat.ts`: Replaced getMockJettResponse() with real streamChat(). Loads history from server on mount. Token-by-token rendering. Error handling for network/API failures. onTaskAction callback triggers task panel refresh.
- Modified `dashboard/page.tsx`: Wired refreshTasks to useChat's onTaskAction

**Tests: 61 passed (27 new + 34 existing)**
- 16 agent tool tests (CRUD + validation + user isolation)
- 11 chat endpoint tests (threads, messages, validation, 404s, pagination)

## Outcome

- Impact: Full Phase III implementation — mock Jett replaced with real OpenAI Agents SDK agent, SSE streaming, PostgreSQL conversation persistence, 5 task tools, guardrails
- Tests: 61 passed (27 new), 0 failed
- Files: 17 files (10 new, 7 modified)
- Next prompts: Set OPENAI_API_KEY in .env, run T039 (eval suite) and T042 (quickstart verification) with live API
- Reflection: Implemented all 5 tools upfront rather than incrementally per user story — this was more efficient since tools share the same file and patterns. The key design decision (same-process @function_tool vs MCP transport) paid off in simplicity.

## Evaluation notes (flywheel)

- Failure modes observed: None — all tests pass on first run
- Graders run and results (PASS/FAIL): Backend tests 61/61 PASS, TypeScript compilation PASS (0 errors)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Run with live OpenAI API key to validate end-to-end streaming
