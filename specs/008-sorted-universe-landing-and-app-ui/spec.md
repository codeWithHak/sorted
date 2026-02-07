# Feature Specification: Sorted Universe Landing & App UI

**Feature Branch**: `008-sorted-universe-landing-and-app-ui`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Transform the existing minimal todo application into the Sorted Universe platform with a new brand identity, agent-first landing page, split-view application layout, card-based task UI, chat panel for Jett (the first AI agent), expressive animations, agent lore page, and full mobile responsive design."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Discovers the Sorted Universe (Priority: P1)

A first-time visitor arrives at the landing page and immediately understands what Sorted is: a universe of AI agents that work for you. They see the hero headline, the visual showing Jett as the active agent with dimmed future-agent silhouettes, and a clear call-to-action. They scroll down and watch an auto-playing demo of Jett creating tasks from a chat message. The demo loops seamlessly, showing the chat-to-task workflow without requiring any interaction. The visitor clicks "Get Started with Jett" to sign up, or "Read Jett's story" to learn more about the agent.

**Why this priority**: The landing page is the primary acquisition surface. If visitors don't understand the product and feel compelled to sign up, nothing else matters. This is the first impression and must communicate the universe concept clearly.

**Independent Test**: Can be fully tested by loading the landing page on desktop and mobile, verifying all five sections render correctly (navbar, hero, Meet Jett with demo, How It Works, Vision), and confirming the auto-play demo loops without user interaction.

**Acceptance Scenarios**:

1. **Given** a visitor loads the landing page on desktop (1440px), **When** the page finishes loading, **Then** the navbar with "sorted" logo (including amber dot), "Sign in" link, and "Get Started" button is visible and sticky on scroll with backdrop blur.
2. **Given** the landing page has loaded, **When** the visitor views the hero section, **Then** they see "A universe of agents that work for you." as the headline, the subtitle text, the agent visual with Jett lit up and 3-4 dimmed silhouettes, and a "Meet your first agent" button.
3. **Given** the visitor scrolls to the Meet Jett section, **When** the demo container becomes visible, **Then** an auto-playing 15-second scripted interaction begins after a 1-second delay showing: a greeting from Jett, a typed user message, thinking animation, staggered task card creation, and a completion animation — then loops with a soft fade.
4. **Given** the visitor views the How It Works section, **When** they read the three columns, **Then** they see "Talk naturally," "Jett takes action," and "Stay on track" with amber icons and stone-toned text.
5. **Given** the visitor views the Vision section, **When** they see the agent placeholder cards, **Then** 3-4 greyed-out agent silhouettes are visible with "coming soon" labels, and each shows a subtle amber glow on hover.
6. **Given** a visitor loads the landing page on mobile (375px), **When** the page renders, **Then** the hero visual stacks vertically, How It Works columns become a single column, and the demo scales proportionally (or shows a simplified chat-only view below 640px).

---

### User Story 2 - Authenticated User Manages Tasks via Split-View Application (Priority: P1)

An authenticated user enters the application and sees a split-view layout: a chat panel on the left (40% width) and a task panel on the right (60% width). They can interact with tasks directly on the task panel — adding, editing, completing, and deleting tasks using card-based UI with custom checkboxes. The task panel groups tasks under "Today," "Upcoming," and "Completed" collapsible sections. Each task card shows the title, optional description preview, creator attribution, and relative timestamp.

**Why this priority**: The task management UI is the core application experience. Users must be able to manage their tasks effectively whether or not the AI agent is active. The split-view layout establishes the foundation for the agentic workspace.

**Independent Test**: Can be fully tested by logging in, creating tasks manually on the task panel, completing tasks, editing task details, and verifying the card layout, grouping, hover effects, and completion animations all work correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user on desktop (1024px+), **When** they enter the application, **Then** they see a split-view with chat panel (left 40%) and task panel (right 60%) separated by a subtle stone-200 divider, with a full-width header above showing the "sorted" logo with amber dot and user avatar.
2. **Given** the task panel is visible, **When** tasks exist, **Then** tasks are displayed as cards with rounded-xl corners, white background, stone-200 border, warm shadow, grouped under collapsible "Today," "Upcoming," and "Completed" section headers.
3. **Given** a task card is displayed, **When** the user views it, **Then** the card shows a custom rounded checkbox, task title in stone-900 medium weight, optional description preview (max 2 lines, truncated), and a footer with creator attribution and relative timestamp.
4. **Given** a task card exists, **When** the user hovers over it, **Then** the card lifts slightly (translate-y -1px) and its border transitions to stone-300, and edit/delete controls appear.
5. **Given** a task card exists, **When** the user clicks the custom checkbox, **Then** the checkbox fills with amber and the title receives an animated strikethrough that draws across from left to right over 200ms.
6. **Given** the Completed section contains tasks, **When** the user views the section, **Then** completed tasks appear visually de-emphasized (reduced opacity or muted colors) so active tasks draw the eye.
7. **Given** an authenticated user, **When** they click a task card, **Then** the card expands for editing, allowing the user to modify task details.

---

### User Story 3 - User Converses with Jett in the Chat Panel (Priority: P1)

An authenticated user types a message to Jett in the chat panel. The chat renders user messages right-aligned with stone-100 background and Jett's messages left-aligned with a thin amber-200 left border. When no messages exist, the chat panel shows an empty state with a greeting from Jett and suggestion chips. Chat history persists across sessions.

**Why this priority**: The chat panel is the primary agentic interaction surface. Even before the AI backend is connected (Phase III), the chat UI, message rendering, empty state, and input behavior must be fully built with correct data contracts.

**Independent Test**: Can be fully tested by opening the chat panel, verifying the empty state greeting and suggestion chips render, typing and sending messages, confirming message styling (user vs. Jett), and reloading to verify chat history persists.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no chat history, **When** they view the chat panel, **Then** they see a centered greeting from Jett ("Hey! I'm Jett. Tell me what you need to get done.") with 2-3 suggestion chips below ("Plan my day", "Add a task", "What's on my list?").
2. **Given** the chat panel is active, **When** the user types a message and presses Enter, **Then** the message appears right-aligned with stone-100 background and rounded bubble shape with a sharp bottom-right corner.
3. **Given** Jett responds to a message, **When** the response renders, **Then** it appears left-aligned with white background and a thin amber-200 left border (2px).
4. **Given** Jett performs an action (creating/updating/completing tasks), **When** the response renders, **Then** an inline action card appears with amber-50 background, amber left border, a summary of the action (e.g., "Created 3 tasks"), and a bulleted list of task titles.
5. **Given** an action card with task names, **When** the user clicks a task name, **Then** the task panel scrolls to that specific card and briefly highlights it with an amber flash.
6. **Given** the chat input bar, **When** the user views it, **Then** it is pinned to the bottom of the chat panel with stone-50 background, stone-300 border, rounded-xl shape, and placeholder text "Ask Jett to plan your day..."
7. **Given** the chat input, **When** the user presses Enter, **Then** the message sends; **When** the user presses Shift+Enter, **Then** a newline is inserted.
8. **Given** a user has previous chat history, **When** they return to the application, **Then** previous conversation messages are visible in the chat panel.

---

### User Story 4 - User Experiences Agent Animations (Priority: P2)

When Jett is processing a request, the user sees a thinking indicator (amber pulsing dots). While Jett is modifying tasks, the task panel border glows softly with amber. When new tasks appear, they animate in with scale and opacity transitions. When multiple tasks are created at once, they stagger in one by one. When Jett is idle, no amber appears in the animation system — the interface is calm stone tones only.

**Why this priority**: The animation system is what differentiates Sorted from a static task app. It makes the AI agent feel alive and present. However, the application is fully functional without animations, making this a P2 that enhances the P1 stories.

**Independent Test**: Can be fully tested by triggering each animation state (thinking, acting, task appearance, task completion, batch creation, idle) and verifying the correct visual behavior occurs, including that animations respect the prefers-reduced-motion system setting.

**Acceptance Scenarios**:

1. **Given** Jett is processing a request, **When** the thinking state activates, **Then** a trio of amber dots pulses in the chat panel where Jett's response will appear.
2. **Given** Jett is actively creating or modifying tasks, **When** the acting state activates, **Then** the task panel's edge gets a soft amber glow (box-shadow) that fades in and out smoothly.
3. **Given** Jett creates a single task, **When** the task card appears, **Then** it animates from opacity-0 scale-95 to opacity-100 scale-100 over 300ms with ease-out, accompanied by a brief amber background highlight that fades to white over 500ms.
4. **Given** Jett creates multiple tasks at once, **When** the cards appear, **Then** they stagger in one by one with a 100ms delay between each card's entrance animation.
5. **Given** Jett marks a task complete, **When** the completion animation triggers, **Then** the checkbox fills with amber and the title strikethrough draws from left to right over 200ms.
6. **Given** Jett is idle (no active request), **When** the user views the interface, **Then** no amber is present in any animation element — only calm stone tones.
7. **Given** a user has prefers-reduced-motion enabled, **When** any animation would trigger, **Then** all transitions resolve instantly with opacity-only changes (no scale/translate).

---

### User Story 5 - User Navigates on Mobile (Priority: P2)

On viewports below 1024px, the split view is replaced with a tabbed interface. Two tabs appear at the bottom: "Chat" and "Tasks." The active tab uses amber accent color. When Jett creates tasks while the user is on the Chat tab, the Tasks tab receives an amber pulse badge. The chat input stays pinned above the virtual keyboard on mobile devices.

**Why this priority**: Mobile responsiveness ensures the product is usable on all devices, which is critical for a portfolio piece and for real-world usage. However, the desktop split-view experience is the primary showcase, making mobile a P2.

**Independent Test**: Can be fully tested by loading the application on a mobile viewport (375px), navigating between Chat and Tasks tabs, verifying the badge notification behavior, and confirming the chat input remains accessible when the virtual keyboard is active.

**Acceptance Scenarios**:

1. **Given** an authenticated user on a viewport below 1024px, **When** they enter the application, **Then** they see a tabbed interface with "Chat" (speech bubble icon) and "Tasks" (checkbox icon) tabs at the bottom, with the active tab using amber accent color.
2. **Given** the user is on the Chat tab, **When** Jett creates tasks, **Then** the Tasks tab icon receives an amber badge that pulses briefly.
3. **Given** the user switches to the Tasks tab after new tasks were created, **When** the tab renders, **Then** a floating amber pill appears at the top ("3 tasks added by Jett") that dismisses on tap or after 5 seconds.
4. **Given** the user is typing in the chat input on mobile, **When** the virtual keyboard appears, **Then** the chat input bar stays pinned above the keyboard and does not scroll out of view.

---

### User Story 6 - Brand Identity and Color System Applied (Priority: P1)

The entire application transitions from the current zinc/neutral palette to a warm stone-and-amber color system. The base is white with warm gray surfaces (stone-50, stone-100). The accent color is amber-500/orange-500, and it appears exclusively during agent activity. The "sorted" logo displays in lowercase stone-900 with a small amber dot as the logo mark. Borders are stone-200 (warm, not cold zinc), shadows are warm-toned.

**Why this priority**: The visual identity is foundational — every other user story depends on the correct color system being in place. Without the brand transition from zinc to stone/amber, the individual components would look inconsistent.

**Independent Test**: Can be fully tested by auditing all UI surfaces for correct color usage: stone tones for base/text/borders, amber only during agent activity, logo with amber dot on all surfaces, warm shadows throughout.

**Acceptance Scenarios**:

1. **Given** any page in the application, **When** the user views the interface at rest (no agent activity), **Then** no amber accent color is visible in the UI — only stone tones, white, and warm grays.
2. **Given** the "sorted" logo, **When** it renders on any surface (landing navbar, app header, footer), **Then** it displays in lowercase stone-900 with a small amber dot as the logo mark.
3. **Given** any border in the UI, **When** it renders, **Then** it uses stone-200 (warm tone), never zinc-200 (cold tone).
4. **Given** any shadow in the UI, **When** it renders, **Then** it uses warm-toned shadows, never harsh black.

---

### User Story 7 - User Explores Jett's Lore Page (Priority: P3)

An authenticated user clicks "About Jett" in the application sidebar to access the agent lore page. The page uses a slightly darker background with amber accent text, creating a distinct atmosphere as though the user has entered Jett's own space. The page displays Jett's origin narrative, capabilities formatted as "abilities" in a game character sheet style, and a subtle animated amber pulse behind Jett's icon.

**Why this priority**: The lore page reinforces the universe concept and Jett's identity as a character, not just a tool. It's a differentiating feature for the portfolio but is not required for core task management functionality.

**Independent Test**: Can be fully tested by navigating to the lore page via the sidebar link, verifying the darker atmosphere styling, reading the origin narrative and abilities list, and confirming the amber pulse animation behind Jett's icon.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click "About Jett" in the sidebar, **Then** they navigate to the lore page with a visually distinct darker background and amber accent text.
2. **Given** the lore page is loaded, **When** the user reads it, **Then** they see Jett's origin narrative (worldbuilding/game-character style about fighting entropy and "noise"), capabilities formatted as abilities (character sheet style, not a feature list), and a subtle animated amber pulse behind Jett's icon.
3. **Given** the lore page, **When** Jett's abilities are displayed, **Then** they are formatted as a character sheet (ability name, description, visual styling) rather than a standard feature bullet list.

---

### User Story 8 - Agent Sidebar and Universe Extensibility (Priority: P3)

The application includes a collapsible left sidebar containing the agent roster. Jett is listed with an amber active indicator. Future agents appear as greyed silhouettes, communicating the universe's extensibility. The sidebar is the extension point for adding new agents in the future.

**Why this priority**: The sidebar establishes the multi-agent universe concept visually and architecturally, but only Jett is functional in this phase. It's a scaffolding element for future features.

**Independent Test**: Can be fully tested by opening the sidebar, verifying Jett appears with an amber active indicator, confirming greyed-out agent silhouettes are visible, and toggling the sidebar collapse/expand.

**Acceptance Scenarios**:

1. **Given** an authenticated user on desktop, **When** they open the sidebar, **Then** they see an agent roster with Jett listed with an amber active indicator and 2-3 greyed-out agent silhouettes.
2. **Given** the sidebar is open, **When** the user views the greyed-out agents, **Then** each shows a role label (e.g., calendar, notes, habits) and is clearly non-interactive (no click handler, cursor default).
3. **Given** the sidebar, **When** the user clicks the collapse control, **Then** the sidebar collapses and the main content expands to fill the space.

---

### Edge Cases

- What happens when the live demo embed on the landing page fails to load or play? The demo container should show a static screenshot of the split-view interface as a fallback, preserving the visual impact.
- What happens when the chat panel has an extremely long conversation history? The chat panel should virtualize or paginate messages to prevent performance degradation, loading the most recent messages first with a "load more" scroll-to-top trigger.
- What happens when the user rapidly creates and completes tasks while animations are still playing? Animation queue should be managed so that new animations don't conflict with in-progress ones — new entries are appended to the stagger queue rather than interrupting.
- What happens when the user resizes the browser window across the 1024px breakpoint while using the application? The layout should transition smoothly between split-view and tabbed modes without losing chat or task state.
- What happens when agent-created and manually-created tasks are mixed in the same section? Both display correctly with agent-created tasks showing the amber sparkle icon and "Added by Jett" attribution, while manual tasks show no icon.
- What happens when the user has no tasks at all? The task panel shows an empty state with a friendly prompt (e.g., "No tasks yet. Ask Jett to help you get started!" with a visual hint pointing to the chat panel).

## Requirements *(mandatory)*

### Functional Requirements

**Brand & Design System**

- **FR-001**: The application MUST use a warm stone-and-amber color system with white (#FFFFFF) base, stone-50/stone-100 surfaces, stone-900 primary text, stone-500 secondary text, stone-200 borders, and warm-toned shadows.
- **FR-002**: The amber accent color (amber-500 to orange-500) MUST appear exclusively during agent activity or agent-attributed elements — at rest, only stone tones are visible.
- **FR-003**: The "sorted" logo MUST render in lowercase stone-900 with a small amber dot as the logo mark across all surfaces (landing navbar, app header, footer).
- **FR-004**: The amber dot in the logo MUST pulse subtly when an agent is active within the application.

**Landing Page**

- **FR-005**: The landing page MUST include five sections: sticky navbar, hero, Meet Jett (with live demo), How It Works (three columns), and Vision (future agents).
- **FR-006**: The navbar MUST be sticky on scroll with backdrop-blur and semi-transparent white background, containing the logo, "Sign in" text link, and "Get Started" amber button.
- **FR-007**: The hero section MUST display the headline "A universe of agents that work for you." with a visual showing Jett as active (amber glow) and 3-4 future agent silhouettes dimmed.
- **FR-008**: The Meet Jett section MUST contain an auto-playing 15-second scripted demo that loops seamlessly, showing the chat-to-task workflow (greeting, typed message, thinking dots, staggered task creation, completion animation).
- **FR-009**: The How It Works section MUST present three columns with amber icons: "Talk naturally," "Jett takes action," and "Stay on track."
- **FR-010**: The Vision section MUST show 3-4 greyed-out agent placeholder cards with "coming soon" labels that show a subtle amber glow on hover.
- **FR-011**: The footer MUST be minimal with logo, navigation links (About, GitHub, Sign in), and no "built with AI" badge.

**Application Layout**

- **FR-012**: On desktop (1024px+), the application MUST use a split-view layout with chat panel (left 40%) and task panel (right 60%) separated by a subtle stone-200 vertical divider.
- **FR-013**: The application header MUST span the full width above both panels, showing the "sorted" logo with amber dot on the left and user avatar with settings icon on the right.
- **FR-014**: The application MUST include a collapsible left sidebar containing the agent roster with Jett as the active agent (amber indicator) and greyed-out future agent silhouettes.
- **FR-015**: The sidebar MUST be hidden by default on smaller desktops and collapsible on all desktop viewports.

**Task Panel**

- **FR-016**: Tasks MUST be displayed as cards with rounded-xl corners, generous padding, white background, stone-200 border, and warm shadow.
- **FR-017**: Task cards MUST be grouped under collapsible section headers: "Today," "Upcoming," and "Completed."
- **FR-018**: Each task card MUST display: a custom rounded checkbox (not browser default), task title (stone-900, medium weight), optional description preview (stone-500, max 2 lines truncated), and a footer with creator attribution and relative timestamp.
- **FR-019**: Agent-created tasks MUST show an amber sparkle icon and "Added by Jett" attribution in the card footer.
- **FR-020**: Task cards MUST lift slightly on hover (translate-y -1px) with border transitioning to stone-300, and show edit/delete controls on hover.
- **FR-021**: The task completion animation MUST fill the checkbox with amber and draw a strikethrough across the title from left to right over 200ms.
- **FR-022**: The task panel MUST support direct manual interaction — users can add, edit, and delete tasks without going through chat.
- **FR-023**: The task panel MUST show an empty state when no tasks exist, prompting the user to ask Jett for help.

**Chat Panel**

- **FR-024**: User messages MUST be right-aligned with stone-100 background, rounded bubble shape, and sharp bottom-right corner.
- **FR-025**: Jett's messages MUST be left-aligned with white background and a thin amber-200 left border (2px).
- **FR-026**: When Jett performs actions, responses MUST include inline action cards with amber-50 background, amber left border, action summary, and clickable task names that scroll to the corresponding task card with an amber flash highlight.
- **FR-027**: The chat input bar MUST be pinned to the bottom with stone-50 background, stone-300 border, rounded-xl shape, placeholder text "Ask Jett to plan your day...", and an amber arrow send button that pulses when the user begins typing.
- **FR-028**: Chat MUST support keyboard submission: Enter to send, Shift+Enter for newlines.
- **FR-029**: Chat history MUST persist across sessions.
- **FR-030**: The empty state MUST show a centered greeting from Jett with 2-3 suggestion chips below.

**Animation System**

- **FR-031**: The thinking state MUST display a trio of amber pulsing dots in the chat panel where Jett's response will appear.
- **FR-032**: The acting state MUST show a soft amber glow on the task panel edge that fades in and out smoothly while Jett is modifying tasks.
- **FR-033**: New task cards created by Jett MUST animate from opacity-0 scale-95 to opacity-100 scale-100 over 300ms with an amber background highlight that fades to white over 500ms.
- **FR-034**: Batch task creation MUST stagger card entrance animations with a 100ms delay between each card.
- **FR-035**: All animations MUST respect the user's prefers-reduced-motion setting, resolving instantly with opacity-only changes when reduced motion is preferred.
- **FR-036**: Animations MUST NOT cause layout shifts — glow effects MUST use box-shadow or outline, never padding/margin/border-width changes.

**Mobile Responsive Design**

- **FR-037**: On viewports below 1024px, the application MUST replace the split view with a tabbed interface using "Chat" and "Tasks" bottom tabs with amber accent on the active tab.
- **FR-038**: When tasks are created from the Chat tab, the Tasks tab MUST receive an amber badge that pulses briefly.
- **FR-039**: When switching to the Tasks tab after new activity, a floating amber pill MUST appear summarizing the changes, dismissible on tap or after 5 seconds.
- **FR-040**: The chat input bar on mobile MUST stay pinned above the virtual keyboard when active.
- **FR-041**: The landing page MUST be fully responsive: hero stacks vertically, How It Works becomes single column, and demo scales proportionally (simplified chat-only view below 640px).

**Agent Lore Page**

- **FR-042**: The Jett lore page MUST be accessible via "About Jett" in the application sidebar.
- **FR-043**: The lore page MUST use a distinct darker background with amber accent text, creating an atmosphere shift from the main application.
- **FR-044**: The lore page MUST display Jett's origin narrative, abilities formatted as a game character sheet, and a subtle animated amber pulse behind Jett's icon.

**Accessibility**

- **FR-045**: All interactive elements MUST meet WCAG 2.1 AA standards with minimum 4.5:1 contrast ratio for text.
- **FR-046**: All custom components (checkbox, chat input, action cards, tab navigation) MUST have proper ARIA labels and keyboard navigation.
- **FR-047**: All focusable elements MUST have visible focus indicators using amber outline.

### Key Entities

- **Chat Message**: Represents a single message in the conversation between a user and Jett. Key attributes: sender (user or agent), content text, timestamp, optional action card data (action type, affected task references). Persisted across sessions.
- **Task Card**: Represents a task displayed in the task panel. Key attributes: title, optional description, completion status, creator type (manual or agent), creator attribution text, creation timestamp, grouping category (today, upcoming, completed). Links to existing backend task data.
- **Agent**: Represents an AI agent in the Sorted universe. Key attributes: name, role description, accent color, active status, lore content. Only Jett is active in this phase; others are visual placeholders.
- **Action Card**: An inline element within a Jett chat message summarizing an action performed. Key attributes: action type (created, updated, completed, deleted), affected task list with names, visual styling (amber-50 background).

### Assumptions

- The existing Better Auth integration and FastAPI task CRUD endpoints remain unchanged — this feature is frontend-only.
- Chat messages will be stored client-side (local storage or similar) until the Phase III AI backend is implemented, at which point they will migrate to server-side persistence.
- The chat panel will use mock/placeholder responses from Jett until the AI backend is connected. The UI and data contracts are built to be ready for real agent integration.
- Jett's lore page content can use placeholder copy that will be refined later — the page structure and styling are the deliverable.
- The live demo on the landing page is a self-contained scripted animation, not connected to any backend.
- The existing task grouping logic (Today, Upcoming, Completed) will be determined by task due dates and completion status from the existing data model.
- The "settings icon" in the app header is a visual placeholder — settings functionality is out of scope.

### Scope Boundaries

**In Scope:**
- Complete landing page with five sections and auto-playing demo
- Application split-view layout with chat and task panels
- Brand/color system transition from zinc to stone/amber
- Card-based task UI with all specified interactions
- Chat panel UI with message styling, action cards, and empty state
- Six-state animation system
- Mobile responsive design with tabbed interface
- Agent sidebar with Jett active and future agent placeholders
- Jett lore page with character sheet styling
- Accessibility compliance (WCAG 2.1 AA)
- Chat input keyboard behavior (Enter/Shift+Enter)

**Out of Scope:**
- AI agent backend (OpenAI Agents SDK, MCP server — Phase III)
- Real-time chat message streaming from a backend
- Full lore page copywriting (structure and styling are in scope, final prose is not)
- Additional functional agents beyond Jett
- Authentication flow changes
- Backend API modifications
- Settings page functionality
- Agent switching functionality (sidebar shows roster but only Jett is interactive)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The landing page loads and renders all five sections correctly within 3 seconds on a simulated 4G connection, on both desktop (1440px) and mobile (375px) viewports.
- **SC-002**: The live demo embed auto-plays the scripted 15-second interaction without user action and loops seamlessly with no visible jump or flicker at the loop boundary.
- **SC-003**: 100% of UI surfaces use the warm stone-and-amber color system — no zinc tones remain in any user-facing element, verified by visual audit.
- **SC-004**: The amber accent color appears in zero UI elements when no agent activity is occurring, verified by screenshot comparison in idle state.
- **SC-005**: The split-view application correctly renders at 1024px+ with the 40/60 panel ratio and transitions to the tabbed mobile interface below 1024px without losing chat or task state.
- **SC-006**: All six animation states (thinking, acting, appearing, completing, batch, idle) are visually distinct and trigger at the correct times.
- **SC-007**: All animations resolve instantly (opacity-only) when prefers-reduced-motion is enabled, verified by toggling the system setting.
- **SC-008**: All custom interactive components pass an accessibility audit: minimum 4.5:1 contrast ratio, visible focus indicators, proper ARIA labels, and full keyboard navigation.
- **SC-009**: Task cards display all required elements (custom checkbox, title, description preview, footer with attribution and timestamp) and the hover lift animation triggers consistently.
- **SC-010**: Chat messages render with correct styling differentiation (user: right-aligned stone-100; Jett: left-aligned with amber-200 left border) and chat history persists after page reload.
- **SC-011**: Clicking a task name in an action card scrolls the task panel to the corresponding card and triggers a visible amber flash highlight.
- **SC-012**: On mobile viewports, the Tasks tab badge pulses with amber when tasks are created from the Chat tab, and the notification pill appears when switching tabs.
