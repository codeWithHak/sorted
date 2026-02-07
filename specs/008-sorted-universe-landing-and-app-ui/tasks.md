# Tasks: Sorted Universe Landing & App UI

**Input**: Design documents from `/specs/008-sorted-universe-landing-and-app-ui/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the spec. Tests are omitted. Visual/manual testing per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `apps/web/src/` (Next.js App Router)
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create shared type definitions, utility hooks, and agent data that all stories depend on.

- [x] T001 Install Framer Motion dependency via `npm install motion@latest` in `apps/web/`
- [x] T002 [P] Create chat message type definitions in `apps/web/src/lib/types/chat.ts` per contracts/chat-types.ts
- [x] T003 [P] Create agent type definitions in `apps/web/src/lib/types/agent.ts` per contracts/agent-types.ts
- [x] T004 [P] Update task type definitions to add `created_by` and `agent_id` fields in `apps/web/src/lib/types/task.ts` per contracts/task-types.ts — extend existing Task interface with TaskCardData, GroupedTasks, and TaskCreator types
- [x] T005 [P] Create agent roster data file with Jett (active) and 3-4 placeholder agents (coming_soon) in `apps/web/src/data/agents.ts` — include Jett's lore content (origin narrative, abilities as character sheet entries)
- [x] T006 [P] Create `useMediaQuery` hook for responsive breakpoint detection (1024px) in `apps/web/src/hooks/useMediaQuery.ts`
- [x] T007 [P] Create `useReducedMotion` hook for prefers-reduced-motion detection in `apps/web/src/hooks/useReducedMotion.ts` — wraps matchMedia query, returns boolean

---

## Phase 2: Foundational — Brand & Color System (US6, Priority: P1)

**Purpose**: Migrate the entire color system from zinc to stone/amber. This MUST complete before any user story implementation because all new components depend on the correct color tokens.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

**Goal**: Every UI surface uses warm stone tones. Amber appears only during agent activity. Dark mode is removed.

**Independent Test**: Load any page — verify stone tones throughout, no zinc classes remain, no dark mode variants, warm shadows.

- [x] T008 [US6] Update global CSS in `apps/web/src/globals.css` — remove dark mode media query, update CSS custom properties to use stone palette (#FFFFFF background, stone-900 foreground), add custom warm shadow property (`--shadow-warm`), add `@media (prefers-reduced-motion: reduce)` base rule
- [x] T009 [US6] Update root layout metadata in `apps/web/src/app/layout.tsx` — change title to "sorted", update description to "A universe of agents that work for you.", keep Geist font configuration unchanged
- [x] T010 [US6] Create SortedLogo component in `apps/web/src/components/brand/SortedLogo.tsx` — lowercase "sorted" text in stone-900 with small amber dot as logo mark, `isPulsing` prop for amber dot pulse animation when agent is active, size variants (sm, md, lg)
- [x] T011 [US6] Migrate auth pages from zinc to stone in `apps/web/src/app/auth/signin/page.tsx` and `apps/web/src/app/auth/signup/page.tsx` — replace all `zinc-*` classes with `stone-*` equivalents, remove all `dark:*` variant classes

**Checkpoint**: Brand foundation complete — all existing pages use stone palette, logo component ready for use across all surfaces.

---

## Phase 3: User Story 1 — Landing Page (Priority: P1) 🎯 MVP

**Goal**: Visitor arrives at the landing page and immediately understands the Sorted Universe concept. Five sections: navbar, hero, Meet Jett (with auto-playing demo), How It Works, Vision. Fully responsive.

**Independent Test**: Load `/` on desktop (1440px) and mobile (375px). Verify all five sections render. Confirm auto-play demo loops without user interaction. Check navbar is sticky with backdrop blur. Verify "Meet your first agent" smooth-scrolls to the demo section.

### Implementation for User Story 1

- [x] T012 [P] [US1] Create landing page Navbar component in `apps/web/src/components/brand/Navbar.tsx` — sticky, backdrop-blur, white/80 background, SortedLogo on left, "Sign in" text link and "Get Started" amber rounded-full button on right, no border-bottom
- [x] T013 [P] [US1] Create HeroSection component in `apps/web/src/components/landing/HeroSection.tsx` — headline "A universe of agents that work for you." in text-5xl/6xl stone-900 tight tracking, subtitle in text-lg stone-500, agent visual showing Jett lit with amber glow and 3-4 dimmed silhouettes, "Meet your first agent" CTA that smooth-scrolls to Meet Jett section
- [x] T014 [P] [US1] Create HowItWorksSection component in `apps/web/src/components/landing/HowItWorksSection.tsx` — three columns with amber-filled icons (chat icon, sparkle/bolt icon, checkbox icon), headings ("Talk naturally", "Jett takes action", "Stay on track"), one-line descriptions, responsive single-column on mobile
- [x] T015 [P] [US1] Create VisionSection component in `apps/web/src/components/landing/VisionSection.tsx` — headline "Jett is just the first.", 3-4 greyed-out agent silhouette cards with "coming soon" labels and role names (calendar, notes, habits), subtle amber glow on hover, accompanying text about the universe
- [x] T016 [P] [US1] Create Footer component in `apps/web/src/components/landing/Footer.tsx` — minimal, SortedLogo on left, navigation links (About, GitHub, Sign in) center/right, light warm aesthetic, no "built with AI" badge
- [x] T017 [US1] Create LiveDemo component in `apps/web/src/components/landing/LiveDemo.tsx` — self-contained scripted 15-second auto-playing demo using CSS animations + React state machine: idle → Jett greeting → user message types out ("plan my morning") → amber thinking dots → Jett response → 3 task cards stagger in with CSS animation-delay → one card checkbox completes → soft fade → loop. Lazy-load via Intersection Observer. Rounded-2xl container with warm shadow and stone-200 border. Simplified chat-only view below 640px.
- [x] T018 [US1] Create MeetJettSection component in `apps/web/src/components/landing/MeetJettSection.tsx` — transition line "Every universe starts somewhere. Meet Jett — your task agent." in stone-500, LiveDemo embed, lore teaser text ("Built to cut through the noise. You speak chaos. Jett returns order."), two CTAs: "Get Started with Jett" (amber primary) and "Read Jett's story" (text link secondary)
- [x] T019 [US1] Replace landing page in `apps/web/src/app/page.tsx` — compose all sections: Navbar, HeroSection, MeetJettSection, HowItWorksSection, VisionSection, Footer. Use semantic HTML sections with proper IDs for smooth-scroll targeting. Ensure images use next/image for performance.

**Checkpoint**: Landing page fully functional. Visitor can discover the Sorted Universe, watch the auto-playing demo, and navigate to sign up.

---

## Phase 4: User Story 2 — Task Panel & Split-View Layout (Priority: P1)

**Goal**: Authenticated user sees a split-view layout with task panel on the right (60%). Tasks display as cards grouped under collapsible Today/Upcoming/Completed sections. Full CRUD via card interactions (checkbox toggle, hover edit/delete, inline editing).

**Independent Test**: Log in, create tasks manually, complete tasks, edit details, delete tasks. Verify card layout with correct grouping, hover lift animation, completion strikethrough, and empty state.

### Implementation for User Story 2

- [x] T020 [P] [US2] Create TaskCheckbox component in `apps/web/src/components/tasks/TaskCheckbox.tsx` — custom rounded checkbox (not browser default), fills with amber on completion, animated fill transition, proper ARIA label via prop
- [x] T021 [P] [US2] Create TaskCard component in `apps/web/src/components/tasks/TaskCard.tsx` — rounded-xl, white bg, stone-200 border, warm shadow, custom TaskCheckbox, title in stone-900 medium weight, description preview (stone-500, max 2 lines truncated), footer with creator attribution (amber sparkle + "Added by Jett" for agent, nothing for manual) and relative timestamp (stone-400), hover: translate-y -1px + border stone-300 + edit/delete controls appear, completion strikethrough animation (left-to-right 200ms) using Framer Motion, click-to-expand for editing, `isHighlighted` prop for amber flash from action card clicks
- [x] T022 [P] [US2] Create TaskSection component in `apps/web/src/components/tasks/TaskSection.tsx` — collapsible section with title header ("Today", "Upcoming", "Completed"), collapse/expand toggle, renders TaskCard list, Completed section visually de-emphasized (reduced opacity), supports Framer Motion AnimatePresence for card entrance/exit
- [x] T023 [P] [US2] Create TaskEmptyState component in `apps/web/src/components/tasks/TaskEmptyState.tsx` — friendly prompt "No tasks yet. Ask Jett to help you get started!" with visual hint pointing toward chat panel, "Add a task" button for manual creation
- [x] T024 [US2] Create `useTasks` hook in `apps/web/src/hooks/useTasks.ts` — extract task fetching/CRUD logic from current `apps/web/src/app/dashboard/page.tsx`, add client-side grouping into Today/Upcoming/Completed (per research R4), optimistic toggle with debounce, task create/update/delete, `highlightTask(id)` method for cross-panel linking, `refreshTasks()` for re-fetch
- [x] T025 [US2] Create TaskPanel component in `apps/web/src/components/tasks/TaskPanel.tsx` — container for TaskSections (Today, Upcoming, Completed), "New Task" button, receives `agentState` prop for glow animation, `highlightedTaskId` prop for cross-panel linking, scrollable overflow, uses TaskEmptyState when no tasks exist
- [x] T026 [P] [US2] Create AppHeader component in `apps/web/src/components/layout/AppHeader.tsx` — full-width header spanning above panels, SortedLogo with amber dot (pulsing when agent active) on left, user avatar/email and settings icon (placeholder) on right, subtle stone-100 background, sidebar toggle button
- [x] T027 [P] [US2] Create SplitView component in `apps/web/src/components/layout/SplitView.tsx` — left panel (40% width) and right panel (60% width) separated by stone-200 vertical divider, accepts `leftPanel` and `rightPanel` as React nodes, `isMobile` prop to switch rendering mode
- [x] T028 [US2] Restyle TaskForm component in `apps/web/src/components/tasks/TaskForm.tsx` — migrate from zinc to stone palette, update button styles to match new design system, remove dark mode classes
- [x] T029 [US2] Restyle TaskModal component in `apps/web/src/components/tasks/TaskModal.tsx` — migrate from zinc to stone palette, update backdrop and modal card styling, warm shadow, remove dark mode classes
- [x] T030 [US2] Replace dashboard layout in `apps/web/src/app/dashboard/layout.tsx` — new layout with AppHeader, AgentSidebar (collapsed by default), and content area. Remove old header with sign-out button. Use `useMediaQuery` to detect desktop vs mobile.
- [x] T031 [US2] Replace dashboard page in `apps/web/src/app/dashboard/page.tsx` — orchestrate SplitView with ChatPanel (placeholder/empty for now) on left and TaskPanel on right, wire up `useTasks` hook, `useAgentState` hook, `highlightedTaskId` state, responsive layout switching at 1024px breakpoint
- [x] T032 [US2] Remove old task components no longer used: `apps/web/src/components/tasks/FilterBar.tsx`, `apps/web/src/components/tasks/TaskList.tsx`, `apps/web/src/components/tasks/TaskItem.tsx`, `apps/web/src/components/tasks/EmptyState.tsx`, `apps/web/src/components/tasks/Pagination.tsx`, `apps/web/src/components/tasks/DeleteConfirm.tsx`

**Checkpoint**: Task panel fully functional with card UI, grouped sections, CRUD operations, and split-view layout. Chat panel shows placeholder for now.

---

## Phase 5: User Story 3 — Chat Panel with Jett (Priority: P1)

**Goal**: User converses with Jett in the chat panel. Messages render with distinct styling (user right-aligned stone-100, Jett left-aligned with amber border). Action cards show inline task summaries with cross-panel linking. Chat history persists via localStorage. Empty state shows greeting + suggestion chips. Mock Jett responses until Phase III.

**Independent Test**: Open chat panel, verify empty state with Jett greeting and suggestion chips. Send a message, verify user message styling. Verify mock Jett response with amber border. Click a suggestion chip. Reload page, verify chat history persists.

### Implementation for User Story 3

- [x] T033 [P] [US3] Create localStorage chat persistence utility in `apps/web/src/lib/chat-storage.ts` — `loadMessages(userId)`, `saveMessages(userId, messages)`, `clearMessages(userId)` functions, namespaced key `sorted-chat-{userId}`, max 200 messages (prune oldest), JSON serialization
- [x] T034 [P] [US3] Create mock Jett response handler in `apps/web/src/lib/mock/jett-responses.ts` — async function that takes user message and returns a ChatMessage with optional ActionCardData, pattern matching for keywords ("plan", "add", "list", "complete", "delete") to generate contextual mock responses, simulated delay (1-2s) for thinking state, returns action cards when task operations are detected
- [x] T035 [P] [US3] Create ChatEmptyState component in `apps/web/src/components/chat/ChatEmptyState.tsx` — centered greeting from Jett ("Hey! I'm Jett. Tell me what you need to get done."), 2-3 suggestion chips below ("Plan my day", "Add a task", "What's on my list?") as clickable stone-100 rounded-full pills, `onSuggestionClick` callback
- [x] T036 [P] [US3] Create ChatInput component in `apps/web/src/components/chat/ChatInput.tsx` — pinned to bottom, stone-50 background, stone-300 border, rounded-xl, placeholder "Ask Jett to plan your day...", amber arrow send button that pulses subtly when user begins typing (CSS animation), Enter to send, Shift+Enter for newline, `disabled` prop for when Jett is thinking, proper ARIA label
- [x] T037 [P] [US3] Create ActionCard component in `apps/web/src/components/chat/ActionCard.tsx` — amber-50 background, amber left border (2px), action type summary (e.g., "Created 3 tasks"), bulleted list of task titles as clickable links, `onTaskClick(taskId)` callback for cross-panel scrolling
- [x] T038 [US3] Create ChatMessage component in `apps/web/src/components/chat/ChatMessage.tsx` — user messages: right-aligned, stone-100 background, rounded bubble with sharp bottom-right corner; Jett messages: left-aligned, white background, thin amber-200 left border (2px); renders ActionCard inline when message has actionCard data; timestamp display
- [x] T039 [US3] Create `useChat` hook in `apps/web/src/hooks/useChat.ts` — manages chat message state, loads from localStorage on mount via chat-storage utility, `sendMessage(content)` that adds user message then calls mock Jett handler and appends response, `isThinking` state (true during mock delay), `clearHistory()`, auto-save to localStorage on message changes
- [x] T040 [US3] Create ChatPanel component in `apps/web/src/components/chat/ChatPanel.tsx` — container rendering ChatEmptyState when no messages or ChatMessage list when messages exist, ChatInput pinned to bottom, auto-scroll to latest message, receives messages/isThinking/onSendMessage/onTaskClick/onSuggestionClick as props
- [x] T041 [US3] Wire ChatPanel into dashboard page in `apps/web/src/app/dashboard/page.tsx` — integrate `useChat` hook, pass ChatPanel as left panel to SplitView, connect `onTaskClick` to `highlightTask` from useTasks for cross-panel linking, connect suggestion chips to sendMessage

**Checkpoint**: Full chat-to-task workflow operational. User sends message → mock Jett responds → action card shows tasks → clicking task name scrolls task panel. Chat history persists on reload.

---

## Phase 6: User Story 4 — Agent Animation System (Priority: P2)

**Goal**: Six distinct animation states make Jett feel alive: thinking (amber pulsing dots), acting (task panel amber glow), task appearance (scale+opacity), task completion (checkbox fill + strikethrough), batch creation (staggered entrance), idle (no amber). All respect prefers-reduced-motion.

**Independent Test**: Trigger each animation state via chat interaction. Enable prefers-reduced-motion in OS settings and verify all animations resolve instantly with opacity-only changes.

### Implementation for User Story 4

- [x] T042 [P] [US4] Create ThinkingIndicator component in `apps/web/src/components/chat/ThinkingIndicator.tsx` — trio of amber dots that pulse with staggered timing (CSS keyframe animation), appears in chat panel where Jett's response will render, respects prefers-reduced-motion (static dots when enabled)
- [x] T043 [US4] Create `useAgentState` hook in `apps/web/src/hooks/useAgentState.ts` — tracks AgentActivityState (idle/thinking/acting), `setThinking()` when user sends message, `setActing(taskIds)` when Jett modifies tasks, `setIdle()` when all actions complete, `activeAgentId` set to "jett" during activity
- [x] T044 [US4] Add amber glow acting animation to TaskPanel in `apps/web/src/components/tasks/TaskPanel.tsx` — when `agentState.status === "acting"`, apply soft amber box-shadow (`0 0 20px rgba(amber-500, 0.2)`) to panel edge that fades in/out smoothly via CSS transition, must not cause layout shift (box-shadow only)
- [x] T045 [US4] Add entrance animation to TaskCard in `apps/web/src/components/tasks/TaskCard.tsx` — when `isNewFromAgent` prop is true, animate from opacity-0 scale-95 to opacity-100 scale-100 over 300ms ease-out using Framer Motion `motion.div`, brief amber background highlight that fades to white over 500ms. Reduced motion: opacity-only transition.
- [x] T046 [US4] Add batch stagger animation to TaskSection in `apps/web/src/components/tasks/TaskSection.tsx` — when multiple new agent-created cards appear, use Framer Motion `variants` with `staggerChildren: 0.1` (100ms delay between each card entrance). Reduced motion: all appear simultaneously with opacity fade.
- [x] T047 [US4] Wire agent state into dashboard page in `apps/web/src/app/dashboard/page.tsx` — connect `useAgentState` to chat flow: set thinking when message sent, set acting when mock response includes tasks, set idle after animations complete. Pass `agentState` to TaskPanel and SortedLogo (for pulse).
- [x] T048 [US4] Add SortedLogo pulse sync in `apps/web/src/app/dashboard/layout.tsx` — when `agentState.status !== "idle"`, pass `isPulsing={true}` to SortedLogo in AppHeader to sync amber dot pulse with agent activity

**Checkpoint**: All six animation states functional. Agent feels alive during activity, calm during idle. Animations degrade gracefully with reduced motion.

---

## Phase 7: User Story 5 — Mobile Responsive Design (Priority: P2)

**Goal**: Below 1024px, split view becomes tabbed interface with Chat and Tasks bottom tabs. Amber badge on Tasks tab when new tasks created from Chat. Chat input stays above virtual keyboard. Landing page fully responsive.

**Independent Test**: Resize to 375px. Verify bottom tab bar appears. Switch between tabs. Create tasks from chat, verify Tasks tab badge pulses. Check chat input stays visible when keyboard would appear.

### Implementation for User Story 5

- [x] T049 [P] [US5] Create MobileTabBar component in `apps/web/src/components/mobile/MobileTabBar.tsx` — fixed bottom bar with two tabs: "Chat" (speech bubble icon) and "Tasks" (checkbox icon), active tab uses amber accent color, `taskBadgeCount` prop drives amber pulsing badge on Tasks tab, `onTabChange` callback, proper ARIA labels for tab navigation
- [x] T050 [P] [US5] Create MobileNotificationPill component in `apps/web/src/components/mobile/MobileNotificationPill.tsx` — floating amber pill at top of view ("3 tasks added by Jett"), appears when switching to Tasks tab after new activity, dismissible on tap, auto-dismiss after 5 seconds, slide-in animation
- [x] T051 [US5] Update SplitView component for mobile mode in `apps/web/src/components/layout/SplitView.tsx` — when `isMobile` is true, render both panels always-mounted but show/hide via CSS display, add MobileTabBar at bottom, track active tab in URL hash (#chat/#tasks), handle tab badge count from agentState
- [x] T052 [US5] Add mobile virtual keyboard handling to ChatInput in `apps/web/src/components/chat/ChatInput.tsx` — use `visualViewport` API to detect keyboard open/close, adjust input positioning to stay above keyboard, prevent scroll-out-of-view behavior on mobile
- [x] T053 [US5] Integrate mobile notification pill into dashboard in `apps/web/src/app/dashboard/page.tsx` — track `pendingMobileNotifications` count, show MobileNotificationPill when switching to Tasks tab with pending count > 0, reset count on dismiss or tab view

**Checkpoint**: Mobile experience complete. Tab switching preserves state, badge notifications work, chat input stays accessible.

---

## Phase 8: User Story 7 — Jett Lore Page (Priority: P3)

**Goal**: Dedicated lore page accessible from sidebar showing Jett's origin narrative, abilities as game character sheet, and ambient amber pulse. Distinct darker atmosphere styling.

**Independent Test**: Navigate to `/dashboard/jett` via sidebar link. Verify darker background, amber accent text, origin narrative, abilities in character sheet format, and amber pulse behind icon.

### Implementation for User Story 7

- [x] T054 [US7] Create Jett lore page in `apps/web/src/app/dashboard/jett/page.tsx` — distinct darker background (stone-900 or stone-800), amber accent text for headings, Jett's origin narrative from agent data ("Built to cut through the noise..."), abilities rendered as character sheet (ability name, description, icon in card format — not bullet list), subtle animated amber pulse behind Jett icon using CSS keyframes, "Back to dashboard" navigation link

**Checkpoint**: Lore page accessible and atmospheric. Jett feels like a character, not just a tool.

---

## Phase 9: User Story 8 — Agent Sidebar (Priority: P3)

**Goal**: Collapsible left sidebar with agent roster. Jett has amber active indicator. Future agents appear as greyed silhouettes with role labels. Sidebar hidden by default, togglable.

**Independent Test**: Click sidebar toggle in header. Verify Jett appears with amber indicator. Verify 2-3 greyed-out agents with role labels are non-interactive. Collapse sidebar and verify content expands.

### Implementation for User Story 8

- [x] T055 [P] [US8] Create AgentItem component in `apps/web/src/components/sidebar/AgentItem.tsx` — active agents: name, role, amber indicator dot; coming_soon agents: greyed silhouette, role label, "coming soon" sublabel, cursor-default (non-interactive), no click handler
- [x] T056 [US8] Create AgentSidebar component in `apps/web/src/components/sidebar/AgentSidebar.tsx` — collapsible panel, renders AgentItem list from agent roster data, "About Jett" link navigating to `/dashboard/jett` lore page, collapse/expand toggle with smooth transition, hidden by default on smaller desktops
- [x] T057 [US8] Integrate AgentSidebar into dashboard layout in `apps/web/src/app/dashboard/layout.tsx` — add sidebar to layout, wire collapse state to AppHeader toggle button, ensure sidebar doesn't shift main content (uses absolute/fixed positioning or flex), hide on mobile viewports

**Checkpoint**: Sidebar functional. Universe extensibility concept is visually communicated.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility audit, performance optimization, cleanup.

- [x] T058 Add ARIA labels and keyboard navigation to all custom interactive components: TaskCheckbox (`apps/web/src/components/tasks/TaskCheckbox.tsx`), ChatInput (`apps/web/src/components/chat/ChatInput.tsx`), ActionCard links (`apps/web/src/components/chat/ActionCard.tsx`), MobileTabBar tabs (`apps/web/src/components/mobile/MobileTabBar.tsx`), TaskSection collapse toggles, sidebar toggle
- [x] T059 Add visible focus indicators using amber outline to all focusable elements across components — consistent `focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2` ring
- [x] T060 Verify WCAG 2.1 AA contrast ratios (4.5:1 minimum) across all text/background combinations — audit stone-500 on white, stone-400 on white, amber-500 on white, stone-900 on stone-50, and adjust if needed
- [x] T061 Lazy-load LiveDemo component on landing page using Intersection Observer and dynamic import to keep main bundle lean — verify Lighthouse performance score >= 90
- [x] T062 Final zinc-to-stone audit — search entire `apps/web/src/` for any remaining `zinc` class references and replace with `stone` equivalents, search for any remaining `dark:` class references and remove them
- [x] T063 Run quickstart.md validation — verify all routes load correctly, split view renders at 1024px+, mobile tabs at <1024px, demo auto-plays, chat persists on reload, all animation states trigger

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational / Brand (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 Landing Page (Phase 3)**: Depends on Phase 2 (brand/logo components)
- **US2 Task Panel (Phase 4)**: Depends on Phase 2 (color system)
- **US3 Chat Panel (Phase 5)**: Depends on Phase 4 (needs SplitView and TaskPanel to wire into)
- **US4 Animations (Phase 6)**: Depends on Phase 4 + Phase 5 (needs TaskPanel and ChatPanel for animation targets)
- **US5 Mobile (Phase 7)**: Depends on Phase 4 + Phase 5 (needs both panels to wrap in tabs)
- **US7 Lore Page (Phase 8)**: Depends on Phase 2 only (standalone page, can start early)
- **US8 Sidebar (Phase 9)**: Depends on Phase 4 (needs dashboard layout in place)
- **Polish (Phase 10)**: Depends on all desired stories being complete

### User Story Dependencies

- **US6 Brand (P1)**: Foundation — no story dependencies, blocks everything
- **US1 Landing (P1)**: Depends on US6 only — can run in parallel with US2
- **US2 Task Panel (P1)**: Depends on US6 only — can run in parallel with US1
- **US3 Chat Panel (P1)**: Depends on US2 (needs dashboard + SplitView wired up)
- **US4 Animations (P2)**: Depends on US2 + US3 (enhances both panels)
- **US5 Mobile (P2)**: Depends on US2 + US3 (wraps both panels in tabs)
- **US7 Lore Page (P3)**: Depends on US6 only — highly independent, can start early
- **US8 Sidebar (P3)**: Depends on US2 (needs dashboard layout)

### Within Each User Story

- Types/data before hooks
- Hooks before components
- Atomic components before composite containers
- Containers before page integration
- Page integration last

### Parallel Opportunities

- T002, T003, T004, T005, T006, T007 (Phase 1) — all different files, can run in parallel
- T012, T013, T014, T015, T016 (US1 atomic components) — all different files
- T020, T021, T022, T023, T026, T027 (US2 atomic components) — all different files
- T033, T034, T035, T036, T037 (US3 utilities + atomic components) — all different files
- T042 (US4) can start as soon as US3 ChatPanel exists
- US1 and US2 can run entirely in parallel after Phase 2
- US7 (lore page) can start immediately after Phase 2, independent of everything else

---

## Parallel Example: Phase 1 Setup

```bash
# All can run simultaneously (different files):
Task T002: "Create chat types in apps/web/src/lib/types/chat.ts"
Task T003: "Create agent types in apps/web/src/lib/types/agent.ts"
Task T004: "Update task types in apps/web/src/lib/types/task.ts"
Task T005: "Create agent roster data in apps/web/src/data/agents.ts"
Task T006: "Create useMediaQuery hook in apps/web/src/hooks/useMediaQuery.ts"
Task T007: "Create useReducedMotion hook in apps/web/src/hooks/useReducedMotion.ts"
```

## Parallel Example: User Story 1 (Landing Page)

```bash
# All section components can be built simultaneously:
Task T012: "Create Navbar in apps/web/src/components/brand/Navbar.tsx"
Task T013: "Create HeroSection in apps/web/src/components/landing/HeroSection.tsx"
Task T014: "Create HowItWorksSection in apps/web/src/components/landing/HowItWorksSection.tsx"
Task T015: "Create VisionSection in apps/web/src/components/landing/VisionSection.tsx"
Task T016: "Create Footer in apps/web/src/components/landing/Footer.tsx"
# Then sequentially: T017 (LiveDemo) → T018 (MeetJettSection) → T019 (page assembly)
```

## Parallel Example: User Story 2 (Task Panel)

```bash
# All atomic components can be built simultaneously:
Task T020: "Create TaskCheckbox in apps/web/src/components/tasks/TaskCheckbox.tsx"
Task T021: "Create TaskCard in apps/web/src/components/tasks/TaskCard.tsx"
Task T022: "Create TaskSection in apps/web/src/components/tasks/TaskSection.tsx"
Task T023: "Create TaskEmptyState in apps/web/src/components/tasks/TaskEmptyState.tsx"
Task T026: "Create AppHeader in apps/web/src/components/layout/AppHeader.tsx"
Task T027: "Create SplitView in apps/web/src/components/layout/SplitView.tsx"
# Then sequentially: T024 (useTasks) → T025 (TaskPanel) → T028-T031 (integration)
```

---

## Implementation Strategy

### MVP First (Landing Page + Task Panel)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Brand/Color System (T008-T011)
3. Complete Phase 3: Landing Page US1 (T012-T019)
4. **STOP and VALIDATE**: Visitor experience complete
5. Complete Phase 4: Task Panel US2 (T020-T032)
6. **STOP and VALIDATE**: Core app functional with new UI

### Incremental Delivery

1. Setup + Brand → Color system live
2. Add Landing Page (US1) → First impressions ready → Demo-able
3. Add Task Panel (US2) → Core app functional → Deploy/Demo (MVP!)
4. Add Chat Panel (US3) → Agentic interaction enabled
5. Add Animations (US4) → "Wow factor" layer
6. Add Mobile (US5) → All devices supported
7. Add Lore + Sidebar (US7, US8) → Universe polish
8. Polish (Phase 10) → Accessibility + performance finalized

### Suggested Commit Points

- After Phase 2 (brand migration): `feat(web): Migrate color system from zinc to stone/amber`
- After Phase 3 (landing): `feat(web): Add universe-first landing page with Jett demo`
- After Phase 4 (task panel): `feat(web): Implement card-based task panel with split-view layout`
- After Phase 5 (chat): `feat(web): Add chat panel with mock Jett responses`
- After Phase 6 (animations): `feat(web): Implement agent animation system`
- After Phase 7 (mobile): `feat(web): Add mobile responsive tabbed interface`
- After Phases 8+9 (lore+sidebar): `feat(web): Add Jett lore page and agent sidebar`

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are under `apps/web/src/` — no backend changes
- Framer Motion only loaded in authenticated routes (dynamic import for bundle optimization)
- Auth pages (signin/signup) migrated to stone in Phase 2 but not redesigned — follow-up if needed
