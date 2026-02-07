---
id: "0004"
title: Implement Sorted Universe Landing and App UI
stage: green
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 008-sorted-universe-landing-and-app-ui
branch: 008-sorted-universe-landing-and-app-ui
user: hak
command: /sp.implement
labels: ["frontend", "landing-page", "chat-panel", "task-panel", "animations", "responsive"]
links:
  spec: specs/008-sorted-universe-landing-and-app-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - apps/web/src/app/globals.css
  - apps/web/src/app/layout.tsx
  - apps/web/src/app/page.tsx
  - apps/web/src/app/auth/signin/page.tsx
  - apps/web/src/app/auth/signup/page.tsx
  - apps/web/src/app/dashboard/layout.tsx
  - apps/web/src/app/dashboard/page.tsx
  - apps/web/src/app/dashboard/jett/page.tsx
  - apps/web/src/lib/types/chat.ts
  - apps/web/src/lib/types/agent.ts
  - apps/web/src/lib/types/task.ts
  - apps/web/src/lib/chat-storage.ts
  - apps/web/src/lib/mock/jett-responses.ts
  - apps/web/src/data/agents.ts
  - apps/web/src/hooks/useMediaQuery.ts
  - apps/web/src/hooks/useReducedMotion.ts
  - apps/web/src/hooks/useTasks.ts
  - apps/web/src/hooks/useChat.ts
  - apps/web/src/hooks/useAgentState.ts
  - apps/web/src/components/brand/SortedLogo.tsx
  - apps/web/src/components/brand/Navbar.tsx
  - apps/web/src/components/landing/HeroSection.tsx
  - apps/web/src/components/landing/MeetJettSection.tsx
  - apps/web/src/components/landing/LiveDemo.tsx
  - apps/web/src/components/landing/HowItWorksSection.tsx
  - apps/web/src/components/landing/VisionSection.tsx
  - apps/web/src/components/landing/Footer.tsx
  - apps/web/src/components/chat/ChatPanel.tsx
  - apps/web/src/components/chat/ChatMessage.tsx
  - apps/web/src/components/chat/ActionCard.tsx
  - apps/web/src/components/chat/ChatInput.tsx
  - apps/web/src/components/chat/ChatEmptyState.tsx
  - apps/web/src/components/chat/ThinkingIndicator.tsx
  - apps/web/src/components/tasks/TaskPanel.tsx
  - apps/web/src/components/tasks/TaskCard.tsx
  - apps/web/src/components/tasks/TaskSection.tsx
  - apps/web/src/components/tasks/TaskCheckbox.tsx
  - apps/web/src/components/tasks/TaskEmptyState.tsx
  - apps/web/src/components/tasks/TaskForm.tsx
  - apps/web/src/components/tasks/TaskModal.tsx
  - apps/web/src/components/layout/AppHeader.tsx
  - apps/web/src/components/layout/SplitView.tsx
  - apps/web/src/components/sidebar/AgentSidebar.tsx
  - apps/web/src/components/sidebar/AgentItem.tsx
tests:
  - "Build verification: npx next build — PASS (all 8 routes compile)"
  - "Zinc audit: 0 zinc references remaining in apps/web/src/"
  - "Dark mode audit: 0 dark: references remaining in apps/web/src/"
---

## Prompt

/sp.implement

## Response snapshot

Implemented all 63 tasks across 10 phases for the Sorted Universe Landing & App UI feature:

- **Phase 1 (Setup)**: Installed Framer Motion, created type definitions (chat, agent, task extensions), agent roster data, and utility hooks (useMediaQuery, useReducedMotion)
- **Phase 2 (Brand)**: Migrated color system from zinc to stone/amber, removed dark mode, updated metadata, created SortedLogo component, migrated auth pages
- **Phase 3 (Landing Page)**: Built 5-section landing page — Navbar, Hero, MeetJett with auto-playing LiveDemo, HowItWorks, Vision, Footer
- **Phase 4 (Task Panel)**: Built card-based task UI with TaskCheckbox, TaskCard, TaskSection, TaskPanel, useTasks hook, AppHeader, SplitView layout, replaced dashboard
- **Phase 5 (Chat Panel)**: Built chat system with localStorage persistence, mock Jett responses, ChatPanel, ChatMessage, ActionCard, ChatInput, ThinkingIndicator, useChat hook
- **Phase 6 (Animations)**: Created useAgentState hook, wired agent state into dashboard for amber glow and thinking indicators
- **Phase 7 (Mobile)**: Integrated mobile tab bar into SplitView with task badge notifications
- **Phase 8 (Lore Page)**: Built Jett lore page at /dashboard/jett with dark theme and character sheet
- **Phase 9 (Sidebar)**: Built collapsible AgentSidebar with AgentItem components
- **Phase 10 (Polish)**: Zero zinc references, zero dark: references, Suspense boundaries on auth pages, successful production build

## Outcome

- ✅ Impact: Complete frontend transformation from minimal todo app to Sorted Universe platform
- 🧪 Tests: Build passes (8 routes), zero zinc/dark mode references
- 📁 Files: ~45 files created/modified, 6 files removed (old task components)
- 🔁 Next prompts: Visual testing, commit and PR
- 🧠 Reflection: Large implementation completed in phases — build verification caught useRef TypeScript issue and pre-existing Suspense boundary issue

## Evaluation notes (flywheel)

- Failure modes observed: useRef strict mode requires initial value; useSearchParams needs Suspense boundary (pre-existing)
- Graders run and results (PASS/FAIL): Build PASS, zinc audit PASS, dark mode audit PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
