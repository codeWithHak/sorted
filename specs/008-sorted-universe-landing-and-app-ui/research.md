# Research: Sorted Universe Landing & App UI

**Feature**: `008-sorted-universe-landing-and-app-ui`
**Date**: 2026-02-07

## R1: Animation Library Selection

**Decision**: Framer Motion (motion/react)

**Rationale**: The spec requires six distinct animation states including staggered batch task creation (100ms delay per card), animated strikethrough drawing across text, scale+opacity entrance transitions, and layout-shift-free glow effects. CSS transitions handle simple hover/opacity well, but the batch stagger pattern — where N task cards animate in sequentially with programmatic delay — requires either manual JS timing or a declarative animation library. Framer Motion's `staggerChildren` in `variants` handles this natively. Additionally, `AnimatePresence` provides clean exit animations when tasks are removed or reordered, which CSS cannot achieve.

**Alternatives considered**:
- **CSS-only (transitions + keyframes)**: Handles hover states, simple fades, and the amber glow well. Cannot do dynamic stagger delays (the delay must be per-element based on index), animated strikethrough drawing (requires `clip-path` or SVG animation with JS timing), or exit animations for removed DOM elements.
- **React Spring**: Similar capability to Framer Motion but less ergonomic for the stagger pattern. Framer Motion's variant propagation through parent/child is cleaner for our section→card hierarchy.
- **GSAP**: Overkill for this use case; designed for complex timeline-based animations. Adds significant bundle size.

**Impact**: ~15KB gzipped added to bundle. Mitigated by dynamic import — Framer Motion is only loaded in authenticated app routes, not the landing page (landing page uses CSS-only animations for performance).

## R2: Chat Message Persistence Strategy

**Decision**: localStorage with JSON serialization

**Rationale**: The spec requires chat history to persist across sessions (FR-029) but explicitly states the AI backend is out of scope — chat uses mock responses until Phase III. localStorage provides simple persistence without any backend changes, and the data structure is designed for easy migration to server-side storage when the Phase III backend is connected.

**Alternatives considered**:
- **IndexedDB**: More robust for large datasets, but overkill for a chat history that will be mock-only. Adds complexity with async API. Can be migrated to later if volume becomes an issue.
- **Session Storage**: Doesn't persist across tabs/sessions — violates FR-029.
- **Server-side (API endpoint)**: Out of scope — would require backend modifications explicitly excluded by the spec.

**Storage design**:
- Key: `sorted-chat-{userId}` (namespaced per user)
- Value: JSON array of `ChatMessage` objects
- Max messages: 200 (oldest pruned first to prevent localStorage bloat)
- Migration path: Phase III backend can read localStorage on first load, POST to server, then clear localStorage

## R3: Landing Page Demo Implementation

**Decision**: CSS animation + React state machine (no backend, no video)

**Rationale**: The spec requires a 15-second auto-playing scripted demo that loops seamlessly (FR-008). A video embed would be heavy and hard to maintain. Instead, the demo is a self-contained React component that renders a miniaturized split-view with actual chat bubbles and task cards, driven by a state machine that advances through scripted steps with timed delays. All animations use CSS transitions (no Framer Motion on the landing page for performance).

**Implementation approach**:
1. `LiveDemo` component contains a `useEffect` with `setTimeout` chain
2. Steps: idle → greeting appears → typing animation → user message appears → thinking dots → Jett response → task cards stagger in (CSS `animation-delay`) → completion check → fade reset → loop
3. Each step is a state change that triggers CSS transitions on child elements
4. The demo container is lazy-loaded (Intersection Observer) to avoid blocking initial render

**Alternatives considered**:
- **Video/GIF**: Heavy asset, hard to update, doesn't match the app's actual styling
- **Framer Motion**: Adds to landing page bundle; CSS animations are sufficient for the scripted sequence since the steps are predetermined (not dynamic like the real app)
- **Lottie**: Designed for vector animation, not UI component rendering

## R4: Task Grouping Strategy (Today / Upcoming / Completed)

**Decision**: Client-side grouping based on existing `created_at`, `completed`, and a future `due_date` field

**Rationale**: The spec requires tasks grouped under "Today," "Upcoming," and "Completed" sections (FR-017). The current Task model has `completed` (boolean) and `created_at`/`updated_at` (timestamps) but no `due_date`. Grouping logic:
- **Completed**: `completed === true` (regardless of date)
- **Today**: `completed === false` AND (`due_date` is today OR `due_date` is null AND `created_at` is today)
- **Upcoming**: `completed === false` AND `due_date` is in the future

Since the backend doesn't have `due_date` yet, the initial implementation treats all non-completed tasks as "Today" tasks. When `due_date` is added to the backend (Phase V per constitution), the grouping logic will naturally start working with real dates. The grouping function is isolated in `useTasks.ts` for easy updates.

**Alternatives considered**:
- **Backend grouping (server-side query)**: Would require API changes (out of scope)
- **Manual user-assigned sections**: Not specified; adds UI complexity without spec backing

## R5: Mobile Tab Persistence

**Decision**: React state with URL hash for active tab

**Rationale**: When switching between Chat and Tasks tabs on mobile (FR-037), both panels must maintain their state. Both panels are always mounted (but only the active one is visible via CSS `display: none`/`block`), so React state is preserved during tab switches. The active tab is reflected in the URL hash (`#chat` or `#tasks`) so the user's last active tab persists on page reload.

**Alternatives considered**:
- **Conditional rendering (unmount inactive tab)**: Loses state — chat scroll position and in-progress task edits would reset on tab switch
- **React portal**: Overcomplicated for this use case

## R6: Color System Migration (Zinc → Stone)

**Decision**: Global find-and-replace of `zinc` → `stone` in Tailwind classes, plus custom CSS properties for amber accent

**Rationale**: Tailwind CSS 4 includes `stone` as a built-in color palette (warm gray, unlike zinc which is cool/blue-gray). The migration is a systematic replacement:
- `zinc-50` → `stone-50`, `zinc-100` → `stone-100`, etc.
- `dark:` variants are removed — the spec defines a light-only design ("Light + Warm" mood)
- Amber accent is used via standard Tailwind `amber-500`, `orange-500` classes
- Custom warm shadow: defined as a CSS custom property `--shadow-warm: 0 1px 3px 0 rgb(120 113 108 / 0.1), 0 1px 2px -1px rgb(120 113 108 / 0.1)` (stone-500 at 10% opacity)

**No dark mode**: The spec explicitly defines a "Light + Warm" aesthetic. Dark mode classes from the current codebase will be removed. This is a deliberate design decision, not an oversight.

## R7: Framer Motion + prefers-reduced-motion

**Decision**: Global `ReducedMotion` provider wrapping the app, with conditional variant resolution

**Rationale**: FR-035 requires all animations to respect `prefers-reduced-motion`. Framer Motion's built-in `useReducedMotion()` hook returns a boolean. We create a custom `useReducedMotion` hook that reads this value, and all animated components check it before applying scale/translate transitions — falling back to opacity-only. This is enforced at the component level (each animated component checks), not globally, because some components use CSS animations (not Framer Motion) and need their own reduced-motion handling via `@media (prefers-reduced-motion: reduce)`.
