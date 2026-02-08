---
id: "0002"
title: "AI Chatbot Implementation Plan"
stage: plan
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 009-ai-todo-chatbot
branch: 009-ai-todo-chatbot
user: hak
command: /sp.plan
labels: ["plan", "ai-chatbot", "openai-agents", "sse", "architecture"]
links:
  spec: specs/009-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/009-ai-todo-chatbot/plan.md
  - specs/009-ai-todo-chatbot/research.md
  - specs/009-ai-todo-chatbot/data-model.md
  - specs/009-ai-todo-chatbot/quickstart.md
  - specs/009-ai-todo-chatbot/contracts/chat-api.md
  - specs/009-ai-todo-chatbot/contracts/agent-tools.md
tests:
  - none
---

## Prompt

/sp.plan (executed on feature 009-ai-todo-chatbot, spec at specs/009-ai-todo-chatbot/spec.md)

## Response snapshot

Generated complete implementation plan for AI-powered todo chatbot (Phase III). Key artifacts:

1. **research.md**: 6 research decisions covering OpenAI Agents SDK patterns, MCP tool approach (use @function_tool directly, not separate MCP transport), SSE streaming (sse-starlette + fetch/ReadableStream), conversation persistence, frontend integration, and multi-turn context. 3 parallel research agents dispatched for SDK patterns, MCP server, and SSE streaming.

2. **plan.md**: Full implementation plan with technical context, constitution check (all gates PASS), source code structure (new agent/ module, chat models, chat router, SSE client, useChat hook replacement), architecture diagram showing end-to-end flow, 5 key design decisions, and risk analysis.

3. **data-model.md**: 2 new entities (ChatThread, ChatMessage) with fields, indexes, relationships, state transitions, and query patterns.

4. **contracts/**: Chat API contract (POST /chat SSE, GET /chat/threads, GET /chat/threads/{id}/messages) with 5 SSE event types. Agent tools contract (add_task, list_tasks, complete_task, update_task, delete_task) with error format and context object.

5. **quickstart.md**: Step-by-step setup guide with verification checklist.

## Outcome

- Impact: Complete Phase 0 + Phase 1 planning artifacts for Phase III AI chatbot
- Tests: none (planning phase)
- Files: plan.md, research.md, data-model.md, quickstart.md, contracts/chat-api.md, contracts/agent-tools.md
- Next prompts: /sp.tasks to generate implementation tasks
- Reflection: Research parallelized across 3 agents (OpenAI SDK, MCP, SSE). Key decision: use @function_tool directly instead of separate MCP transport, since agent and tools share the same process. This simplifies architecture significantly.

## Evaluation notes (flywheel)

- Failure modes observed: Background research agents couldn't write PHRs (permission denied on Write in background), but returned research content successfully
- Graders run and results (PASS/FAIL): Constitution check — all 8 gates PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
