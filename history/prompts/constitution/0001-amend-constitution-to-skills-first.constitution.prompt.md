---
id: "0001"
title: "Amend constitution to skills-first"
stage: constitution
date: 2026-01-11
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 002-web-scaffold
user: "codeWithHak <huzairahmedkhan@gmail.com>"
command: /sp.constitution
labels: ["constitution","workflow","skills","context7"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - /home/hak/projects/sorted/.specify/memory/constitution.md
tests:
  - "none (documentation change)"
---

## Prompt

```text
just change this a bit in the constitution: "Never rely on internal training data. Always fetch official documentation via Context 7 MCP Server before implementing any library (OpenAI SDKs, Better Auth, Dapr, Kafka, etc.). This ensures current, accurate information rather than outdated internal knowledge." there is no mention of skills, instruct in the constitutin to look for skills first like if we are building routes in fastapi look for a similar skill that is built for it, if we are building next js frontend looks for a similar skill built for it if we are building an agent look for a skill like openai-agents or similar then built the feature using that skill, same with frontend-design, agents-architecture, web search, memory or context management of agents etc  always look for skills first if not then go look at context7 docs.
```

## Response snapshot

- Updated `.specify/memory/constitution.md` Documentation Strategy to be **skills-first**, then fall back to **Context7** official docs when no suitable skill exists.
- Bumped constitution version to **1.1.0** (material workflow policy expansion) and updated Last Amended date to **2026-01-11**.
- Added a new Sync Impact Report entry describing the policy shift and template validation.

## Outcome

- ✅ Impact: Constitution now explicitly prioritizes using existing skills before consulting Context7 docs.
- 🧪 Tests: Not applicable.
- 📁 Files: Updated `.specify/memory/constitution.md` only.
- 🔁 Next prompts: Continue normal SDD workflow (spec → plan → tasks → implement) with skills-first policy.
- 🧠 Reflection: Keeping this rule in Workflow Policies helps enforce consistent tool selection during implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a short checklist line to future specs reminding “skills-first, then Context7” (optional).
