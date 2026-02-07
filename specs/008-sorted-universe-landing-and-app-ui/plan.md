# Implementation Plan: Sorted Universe Landing & App UI

**Branch**: `008-sorted-universe-landing-and-app-ui` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-sorted-universe-landing-and-app-ui/spec.md`

## Summary

Transform the existing minimal zinc-toned todo application into the Sorted Universe platform: a warm stone/amber branded experience with an agent-first landing page, split-view application layout (chat panel + reactive task panel), card-based task UI with agent attribution, a six-state animation system, a Jett agent lore page, and responsive mobile design with tabbed navigation. This is a frontend-only transformation — no backend changes. The chat panel uses mock responses until the Phase III AI backend is connected.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16+, React 19)
**Primary Dependencies**: Next.js 16.1.2, React 19.2.3, Tailwind CSS 4, Framer Motion (new — for complex animations), better-auth ^1.4.18, Geist font (already configured)
**Storage**: Client-side localStorage for chat message persistence; existing FastAPI backend for task CRUD (unchanged)
**Testing**: Visual regression (manual), browser-based accessibility audit, Lighthouse performance scoring
**Target Platform**: Web — desktop (1024px+) and mobile (375px+)
**Project Type**: Web (frontend monorepo: `apps/web/`)
**Performance Goals**: Landing page loads < 3s on 4G; Lighthouse score >= 90; animations at 60fps
**Constraints**: No backend modifications; no new backend dependencies; chat uses mock responses until Phase III; prefers-reduced-motion must be respected
**Scale/Scope**: ~30 new/modified component files, ~5 new pages/routes, 1 design system overhaul

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | PASS | Component decomposition follows clear naming; no clever one-liners |
| Async-First Design | PASS | All API calls remain async; chat mock uses async interface for future backend swap |
| Security by Default | PASS | Frontend-only change; no new auth flows; existing Better Auth integration unchanged |
| Phase-Based Evolution | PASS | This is Phase II frontend work; no premature Phase III features (AI backend stays mock) |
| Spec-Driven Development | PASS | Full spec exists at spec.md; all tasks will reference FR-xxx requirements |

**Additional checks:**
- Monorepo structure: PASS — all changes in `apps/web/`
- No secrets committed: PASS — no new env vars with secrets
- Type hints/TypeScript: PASS — all new code will be TypeScript with strict types
- Code references: PASS — plan references existing files by path

## Project Structure

### Documentation (this feature)

```text
specs/008-sorted-universe-landing-and-app-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (TypeScript interfaces)
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   ├── page.tsx                      # Landing page (REPLACE — currently minimal)
│   ├── layout.tsx                    # Root layout (UPDATE — metadata, fonts)
│   ├── globals.css                   # Global styles (UPDATE — stone/amber tokens)
│   ├── dashboard/
│   │   ├── layout.tsx                # App layout (REPLACE — split view + sidebar)
│   │   ├── page.tsx                  # Dashboard (REPLACE — split view orchestrator)
│   │   └── jett/
│   │       └── page.tsx              # Jett lore page (NEW)
│   └── auth/                         # Auth pages (UNCHANGED)
│       ├── signin/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── brand/
│   │   ├── SortedLogo.tsx            # Logo with amber dot (NEW)
│   │   └── Navbar.tsx                # Landing page navbar (NEW)
│   ├── landing/
│   │   ├── HeroSection.tsx           # Hero with universe visual (NEW)
│   │   ├── MeetJettSection.tsx       # Live demo section (NEW)
│   │   ├── LiveDemo.tsx              # Scripted auto-play demo (NEW)
│   │   ├── HowItWorksSection.tsx     # Three columns (NEW)
│   │   ├── VisionSection.tsx         # Future agents (NEW)
│   │   └── Footer.tsx                # Minimal footer (NEW)
│   ├── chat/
│   │   ├── ChatPanel.tsx             # Chat panel container (NEW)
│   │   ├── ChatMessage.tsx           # User/Jett message rendering (NEW)
│   │   ├── ActionCard.tsx            # Inline action summary (NEW)
│   │   ├── ChatInput.tsx             # Input bar with send button (NEW)
│   │   ├── ChatEmptyState.tsx        # Greeting + suggestion chips (NEW)
│   │   └── ThinkingIndicator.tsx     # Amber pulsing dots (NEW)
│   ├── tasks/
│   │   ├── TaskPanel.tsx             # Task panel container (NEW)
│   │   ├── TaskCard.tsx              # Card-based task item (NEW — replaces TaskItem)
│   │   ├── TaskSection.tsx           # Collapsible section (Today/Upcoming/Completed) (NEW)
│   │   ├── TaskCheckbox.tsx          # Custom rounded checkbox with amber fill (NEW)
│   │   ├── TaskEmptyState.tsx        # "Ask Jett" empty state (NEW — replaces EmptyState)
│   │   ├── TaskForm.tsx              # Task create/edit form (UPDATE)
│   │   ├── TaskModal.tsx             # Modal wrapper (UPDATE — restyle)
│   │   ├── FilterBar.tsx             # REMOVE (replaced by section grouping)
│   │   ├── TaskList.tsx              # REMOVE (replaced by TaskPanel + TaskSection)
│   │   ├── TaskItem.tsx              # REMOVE (replaced by TaskCard)
│   │   ├── EmptyState.tsx            # REMOVE (replaced by TaskEmptyState)
│   │   ├── Pagination.tsx            # REMOVE (replaced by section grouping)
│   │   └── DeleteConfirm.tsx         # REMOVE (inline in TaskCard hover)
│   ├── sidebar/
│   │   ├── AgentSidebar.tsx          # Collapsible agent roster (NEW)
│   │   └── AgentItem.tsx             # Agent entry (active or silhouette) (NEW)
│   ├── mobile/
│   │   ├── MobileTabBar.tsx          # Bottom tab navigation (NEW)
│   │   └── MobileNotificationPill.tsx # "3 tasks added" floating pill (NEW)
│   └── layout/
│       ├── AppHeader.tsx             # Full-width app header (NEW)
│       └── SplitView.tsx             # 40/60 panel layout (NEW)
├── hooks/
│   ├── useChat.ts                    # Chat state management + localStorage (NEW)
│   ├── useTasks.ts                   # Task fetching, grouping, CRUD (NEW — extracted from dashboard)
│   ├── useAgentState.ts              # Agent activity tracking for animations (NEW)
│   ├── useMediaQuery.ts              # Responsive breakpoint detection (NEW)
│   └── useReducedMotion.ts           # prefers-reduced-motion detection (NEW)
├── lib/
│   ├── types/
│   │   ├── task.ts                   # Existing task types (UPDATE — add creator fields)
│   │   ├── chat.ts                   # Chat message types (NEW)
│   │   └── agent.ts                  # Agent type definitions (NEW)
│   ├── mock/
│   │   └── jett-responses.ts         # Mock Jett responses + action handling (NEW)
│   ├── chat-storage.ts               # localStorage chat persistence (NEW)
│   ├── api-client.ts                 # Existing API client (UNCHANGED)
│   ├── auth.ts                       # Server-side auth (UNCHANGED)
│   └── auth-client.ts                # Client-side auth (UNCHANGED)
└── data/
    └── agents.ts                     # Agent roster data (Jett + silhouettes) (NEW)
```

**Structure Decision**: Frontend-only transformation within the existing `apps/web/` directory. No new top-level directories. Component structure organized by domain (brand, landing, chat, tasks, sidebar, mobile, layout) rather than by type, for better co-location and discoverability.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Framer Motion dependency | Complex staggered batch animations, animated strikethrough, and per-card entrance effects with precise timing control require more than CSS transitions/keyframes | CSS-only approach was evaluated: works for simple transitions but cannot achieve staggered batch animations with dynamic delay, layout-aware exit animations, or the AnimatePresence pattern needed for task list reordering |
