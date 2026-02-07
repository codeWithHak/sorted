---
id: "0006"
title: Brainstorm Sorted Universe UI Design
stage: misc
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 007-frontend-task-ui
branch: 007-frontend-task-ui
user: hak
command: /brainstorming
labels: ["ui-design", "brainstorming", "landing-page", "agent-jett", "sorted-universe"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - docs/plans/2026-02-07-sorted-universe-ui-design.md
tests:
  - n/a (design brainstorming, no code changes)
---

## Prompt

we have to brainstorm how we a are going to design the ui of this this product "sorted" you can read everything about it in the constitution, also i have some ideas in the @landing-page-brainstorming folder it has 2 or three landing pages, i have code for landing page 2 but tell me for this app which would look better keep in mind its not just a todo app it will have a chatbot and mcp of its own so users can chat and an agent will make todos for them, it agentic or AI Powered as you say, Agentic has a nice vibe to it what do you say lets discuss.

## Response snapshot

Conducted a full brainstorming session that evolved from a simple UI design discussion into a complete product vision pivot. Key decisions made collaboratively:

1. **Visual Mood:** Light + Warm (not dark/dramatic like the Aura reference)
2. **Core Layout:** Chat-driven, task-reactive split view — chat on left (40%), live task panel on right (60%)
3. **Accent Color:** Amber/Orange — "warm intelligence" that signals AI activity
4. **Task Style:** Cards with generous padding, agent badges, micro-interactions
5. **Agent Animations:** Expressive — amber shimmer on panel border, staggering card appearances, pulsing think indicators
6. **Agent Name:** Jett — fast, reliable, action-oriented personality
7. **Agent Lore:** Worldbuilding/game-character style origin story ("Built to cut through the noise. You speak chaos. Jett returns order.")
8. **MAJOR PIVOT — Sorted Universe:** Product reframed from "todo app with AI" to "a universe of AI agents." Jett is the first agent. Future agents handle calendar, notes, habits, etc. Each has its own name, lore, MCP tools.
9. **Landing Page:** Universe-first approach — hero introduces the universe concept, then introduces Jett with a live auto-playing demo embed
10. **Mobile:** Tabbed interface (Chat/Tasks) replacing split view, with amber badge notifications

Full design document written to `docs/plans/2026-02-07-sorted-universe-ui-design.md`.

## Outcome

- ✅ Impact: Major product vision evolution — from todo app to agentic universe platform. Complete UI design system defined.
- 🧪 Tests: n/a (design brainstorming)
- 📁 Files: Created `docs/plans/2026-02-07-sorted-universe-ui-design.md`
- 🔁 Next prompts: Implement landing page, implement split view app layout, design Jett lore page, create agent animation system
- 🧠 Reflection: The brainstorming naturally evolved from "which landing page looks better" into a fundamental product identity shift. The universe concept unlocks portfolio extensibility — each new agent is a new showcase piece.

## Evaluation notes (flywheel)

- Failure modes observed: None — collaborative brainstorming flowed well with one-question-at-a-time approach
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Begin implementing landing page with universe-first hero section
