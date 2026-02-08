# Quickstart: AI-Powered Todo Chatbot

**Feature**: 009-ai-todo-chatbot
**Date**: 2026-02-08

## Prerequisites

- Existing sorted monorepo running (web on port 3000, API on port 8000)
- Neon PostgreSQL database connected
- Better Auth configured with JWT/JWKS
- OpenAI API key

## Setup Steps

### 1. Add Backend Dependencies

```bash
cd services/api
uv add openai-agents sse-starlette
```

### 2. Configure Environment

Add to `services/api/.env`:
```
OPENAI_API_KEY=sk-...
```

Add to `services/api/src/api/config.py`:
```python
openai_api_key: str = ""  # OPENAI_API_KEY env var
```

### 3. Create Database Models

Add `ChatThread` and `ChatMessage` models in `src/api/models/chat.py`. Import them in `src/api/models/__init__.py` so they register with SQLModel metadata on startup.

### 4. Create Agent Module

Create `src/api/agent/` package:
- `context.py` — ChatContext dataclass
- `tools.py` — 5 @function_tool decorated tools (add_task, list_tasks, complete_task, update_task, delete_task)
- `jett.py` — Agent instance with system prompt, tools, and guardrails
- `guardrails.py` — Input/output guardrails

### 5. Create Chat Router

Create `src/api/routers/chat.py`:
- `POST /chat` — SSE streaming endpoint
- `GET /chat/threads` — List threads
- `GET /chat/threads/{id}/messages` — Get thread messages

Register in `main.py`: `app.include_router(chat_router)`

### 6. Update Frontend Hook

Replace `useChat` hook internals:
- Add `src/lib/sse-client.ts` — SSE parser + streaming fetch
- Update `src/hooks/useChat.ts` — Use streamChat() instead of getMockJettResponse()
- Wire `task_action` events to `useTasks.refreshTasks()`

### 7. Run and Test

```bash
# Terminal 1: Backend
cd services/api && uv run uvicorn src.api.main:app --reload

# Terminal 2: Frontend
cd apps/web && npm run dev
```

## Verification Checklist

- [ ] Send "add buy milk" → task appears in task panel + action card in chat
- [ ] Send "what's on my list?" → agent lists tasks from database
- [ ] Send "mark milk as done" → task toggles in task panel
- [ ] Refresh page → conversation history loads from database
- [ ] Check token streams in (not all at once)
- [ ] Check no other user's tasks visible
