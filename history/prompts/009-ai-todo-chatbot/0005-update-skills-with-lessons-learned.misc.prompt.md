---
id: "0005"
title: "Update Skills with Lessons Learned"
stage: misc
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 009-ai-todo-chatbot
branch: 009-ai-todo-chatbot
user: hak
command: skill-update
labels: ["skills", "lessons-learned", "openai-agents", "pydantic-settings", "tool-design"]
links:
  spec: specs/009-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - ~/.claude/skills/scaffolding-openai-agents/SKILL.md
  - ~/.claude/skills/tool-design/SKILL.md
  - ~/.claude/skills/pydantic-settings-management/SKILL.md
tests:
  - n/a (documentation-only changes)
---

## Prompt

if you think any info should be added into our skills like, openai agents skill or better auth skill or any skill could be improved with your current info improve that skill.

## Response snapshot

Updated 3 skills with battle-tested lessons from the 009-ai-todo-chatbot implementation:

**scaffolding-openai-agents** — Added 7 new sections:
1. OPENAI_API_KEY + pydantic-settings pitfall (os.environ bridge)
2. Streaming event types (RawResponsesStreamEvent vs RunItemStreamEvent)
3. FastAPI SSE streaming endpoint (sse-starlette EventSourceResponse)
4. Testable tool pattern (_impl separation from @function_tool)
5. RunContextWrapper construction for tests
6. Standalone DB sessions for tools (outside FastAPI DI)
7. Agent error response format (with suggestion field)

**tool-design** — Added OpenAI Agents SDK section:
1. Error response design with suggestion fields for agent recovery
2. Context tracking pattern for output guardrail verification
3. Tool count guidance for CRUD agents (5 tools sweet spot)

**pydantic-settings-management** — Added pitfall section:
1. Third-party SDK env var bridge pattern
2. Updated troubleshooting table with new row

## Outcome

- Impact: Knowledge capture — 3 skills enriched with production-proven patterns from Phase III implementation
- Tests: n/a (documentation-only)
- Files: 3 skill files modified
- Next prompts: None — skills are now up to date
- Reflection: The pydantic-settings → os.environ pitfall is the highest-value addition — it caused a real debugging session and affects any project using pydantic-settings with third-party SDKs.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Validate skill improvements by using them in the next feature implementation
