---
id: "0001"
title: "Create AI Todo Chatbot Spec"
stage: spec
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 009-ai-todo-chatbot
branch: 009-ai-todo-chatbot
user: hak
command: /sp.specify
labels: ["ai-chatbot", "spec", "phase-iii", "openai-agents", "mcp"]
links:
  spec: specs/009-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/009-ai-todo-chatbot/spec.md
  - specs/009-ai-todo-chatbot/checklists/requirements.md
tests:
  - none
---

## Prompt

/sp.specify 009-ai-powered-todo-chatbot Phase III transforms the sorted application from a manual task manager into an AI-powered conversational productivity tool by replacing the mock Jett agent with a real AI backend built on the OpenAI Agents SDK, exposed through an MCP server, and delivered via the existing custom chat components. The existing Phase II infrastructure — a Next.js 16 frontend with a fully built chat UI (ChatPanel, ChatMessage, ChatInput, ThinkingIndicator, ActionCard), a FastAPI backend with authenticated task CRUD, and Better Auth JWT verification — provides the foundation. The mock getMockJettResponse() keyword matcher and localStorage chat persistence are retired in favor of a streaming AI agent that understands natural language, operates on real tasks through tool calls, and persists conversation history in PostgreSQL. The user-facing outcome is simple: a person types "add a task to buy groceries" or "what's on my list?" or "mark the groceries task as done" and Jett — the AI agent — understands, acts, and responds conversationally, with changes reflected instantly in the task panel via the existing optimistic UI. Every component of this feature must be built using the project's installed skills as the primary implementation guide, not internal knowledge or guesswork; this is a strict policy from the constitution's skills-first documentation strategy. The system is composed of four layers: MCP server (FastMCP, 5 task tools), Jett agent (OpenAI Agents SDK, function_tool, Runner.run_streamed), chat API endpoint (FastAPI SSE streaming), and frontend adaptation (useChat hook wired to real backend). Conversation persistence via chat_threads and chat_messages tables. Auth threading through all layers via JWKS JWT verification. Acceptance criteria include 20+ eval test cases, 500ms TTFT, conversation persistence, action cards, user isolation, graceful error handling, 70% test coverage, 0.7+ eval score.

## Response snapshot

Created feature branch `009-ai-todo-chatbot` and wrote comprehensive specification with 7 user stories (3 P1, 3 P2, 1 P3), 15 functional requirements, 9 measurable success criteria, 5 edge cases, key entities (Chat Thread, Chat Message), assumptions, scope boundaries, and dependencies. All checklist items pass validation — no [NEEDS CLARIFICATION] markers needed due to highly detailed input. Spec is technology-agnostic in requirements/success criteria per guidelines.

## Outcome

- Impact: Created complete feature specification for Phase III AI chatbot, ready for planning
- Tests: none (spec phase)
- Files: spec.md, checklists/requirements.md
- Next prompts: /sp.clarify or /sp.plan
- Reflection: User provided exceptionally detailed input covering all four architectural layers, making clarification unnecessary. Spec successfully abstracts away implementation details while preserving all acceptance criteria.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): spec quality checklist — all items PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
