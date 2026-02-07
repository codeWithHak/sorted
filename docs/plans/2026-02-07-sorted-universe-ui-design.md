# Sorted Universe — UI Design Document

**Date:** 2026-02-07
**Status:** Approved (brainstorming complete)
**Branch:** 007-frontend-task-ui

---

## 1. Product Vision

Sorted is not a todo app. Sorted is a **universe of AI agents that work for you**.

A calm, intelligent space where specialized agents each handle a domain of your life — tasks, calendar, notes, habits, finances. Each agent has its own name, origin story, personality, and MCP tools. They all live inside the Sorted universe.

**Jett** is the first agent. Jett handles tasks.

---

## 2. Brand Identity

### Tagline
**"A universe of agents that work for you."**

### Visual Mood
Light + Warm. Sophisticated but approachable. The AI feels friendly and alive, not cold or intimidating.

### Color System

| Token            | Value                          | Usage                                    |
|------------------|--------------------------------|------------------------------------------|
| Base             | `#FFFFFF` (white)              | Page backgrounds                         |
| Surface          | `stone-50`, `stone-100`        | Cards, input fields, chat bubbles        |
| Text Primary     | `stone-900`                    | Headlines, body text                     |
| Text Secondary   | `stone-500`                    | Subtitles, metadata, timestamps          |
| Accent           | `amber-500` → `orange-500`    | AI activity, CTAs, agent identity        |
| Borders          | `stone-200`                    | Card borders, dividers                   |
| Shadows          | `shadow-stone-200/50`          | Warm shadows, no harsh black             |
| Agent Glow       | `amber-500/20`                 | Shimmer effect when agent is active      |

### Typography
- Headlines: Tight tracking, medium weight, `stone-900`. Not all-caps.
- Body: Regular weight, `stone-700` or `stone-500`.
- Agent text: Same font but with amber accent elements (left border on messages).
- Font: Geist Sans (already in use).

### Logo Concept
"sorted" in lowercase, `stone-900`, with a small amber dot as the logo mark — like a glowing period. The dot subtly pulses in the app when an agent is active.

---

## 3. Agent: Jett

### Identity
- **Name:** Jett
- **Role:** Task agent — the first agent in the Sorted universe
- **Personality:** Fast, reliable, action-oriented. Friendly but concise. Gets things done without unnecessary chatter.
- **Color:** Amber/Orange (inherited from the Sorted accent palette)

### Origin Lore

> Jett was built for one reason — to fight entropy.
>
> Every day, your thoughts scatter. Tasks pile up. Plans dissolve into chaos. You start the morning with clarity and end the day wondering what happened. That disorder has a name in the Sorted universe — **noise**.
>
> Jett was forged to cut through the noise. Not by thinking for you, but by catching what your mind throws out — fragments, ideas, half-plans — and turning them into structure.
>
> You speak chaos. Jett returns order.

### Lore Page Design
- Accessible via "About Jett" link in the app sidebar or settings
- Slightly different atmosphere from the main UI — darker background, amber accent text
- Like entering Jett's own space
- Content: origin text, capabilities written as "abilities" (like a character sheet), animated amber pulse behind Jett's icon

---

## 4. App Layout — The Split View

### Desktop (≥ 1024px)

```
+----------------------------------------------------------+
|  [sorted ●]                     [avatar]  [settings]      |
+---------------------------+------------------------------+
|                           |                              |
|    CHAT PANEL (40%)       |    TASK PANEL (60%)          |
|                           |                              |
|  Jett: "Hey! What do     |   [ Today ]                  |
|  you need to get done?"   |   +------------------------+|
|                           |   | ○ Buy groceries        ||
|  You: "I need to prep     |   |   Added by Jett        ||
|  for the meeting tmrw"    |   +------------------------+|
|                           |   +------------------------+|
|  Jett: "Created 3 tasks   |   | ○ Review slide deck    ||
|  for your meeting prep."  |   |   Added by Jett        ||
|  [amber shimmer on panel] |   +------------------------+|
|                           |   +------------------------+|
|  [...................]    |   | ✓ Send agenda email     ||
|  Ask Jett to plan your    |   |   Completed             ||
|  day...                   |   +------------------------+|
+---------------------------+------------------------------+
```

- **Chat Panel (left, ~40%):** Conversation with Jett
- **Task Panel (right, ~60%):** Live task list that reacts to agent actions
- Panels are separated by a subtle `stone-200` divider
- Task panel border gets an amber glow when Jett is working

### Mobile (< 1024px)

Tabbed interface replacing the split view:

- **Two bottom tabs:** "Chat" and "Tasks"
- Swipe or tap to switch between them
- When Jett creates tasks from the chat tab, an amber badge pulses on the "Tasks" tab
- A floating amber pill at the top of the tasks tab: *"3 tasks added by Jett"* — dismisses on tap
- Both views are full-screen, optimized for the device

---

## 5. Component Specifications

### 5.1 Task Card

```
+------------------------------------------+
|  ○  Buy groceries for the week           |
|     Milk, eggs, bread, vegetables...     |
|                                          |
|  ✦ Added by Jett  ·  Today              |
+------------------------------------------+
```

| Element        | Style                                              |
|----------------|----------------------------------------------------|
| Card           | `bg-white`, `border border-stone-200`, `rounded-xl`, warm shadow |
| Checkbox       | Custom rounded, amber fill on complete (not browser default) |
| Title          | `stone-900`, `font-medium`, single line            |
| Description    | `stone-500`, `font-normal`, truncated to 2 lines   |
| Footer         | `stone-400`, `text-xs`, agent icon + timestamp      |
| Hover          | `translate-y: -1px`, border becomes `stone-300`     |
| Agent badge    | Small amber sparkle icon (✦) next to "Added by Jett" |
| Completed      | Checkbox fills amber, title gets smooth strikethrough |

**Task Grouping:** Cards grouped under collapsible headers — Today, Upcoming, Completed.

**Manual interaction:** Users can also add/edit/delete tasks directly on the task panel, not only through chat.

### 5.2 Chat Messages

**User messages:**
- Right-aligned
- `stone-100` background
- Rounded bubble with sharp bottom-right corner
- Text: `stone-900`

**Jett messages:**
- Left-aligned
- White background
- Thin `amber-200` left border (2px) — Jett's signature
- Text: `stone-800`

**Action cards (inline in Jett's messages):**

```
+------------------------------------------+
|  I've set up your meeting prep:          |
|                                          |
|  +------------------------------------+  |
|  | [amber-50 bg, amber left border]   |  |
|  |  Created 3 tasks                   |  |
|  |  · Review slide deck               |  |
|  |  · Send agenda to team             |  |
|  |  · Print handouts                  |  |
|  +------------------------------------+  |
|                                          |
|  Anything else to add?                   |
+------------------------------------------+
```

- Light amber background (`amber-50`) with amber left border
- Clicking a task name inside the action card scrolls to and highlights that card on the task panel
- Acts as a receipt: user sees exactly what Jett did

**Input bar:**
- Pinned to bottom of chat panel
- `stone-50` background, `stone-300` border, `rounded-xl`
- Placeholder: *"Ask Jett to plan your day..."*
- Amber send button (arrow icon), pulses subtly when typing begins
- Thinking state: pulsing amber dot trio

### 5.3 Agent Animation System

This is what makes the product feel alive:

| State              | Animation                                                          |
|--------------------|--------------------------------------------------------------------|
| Agent thinking     | Pulsing amber dot trio in chat (like typing indicator, but amber)  |
| Agent acting       | Task panel border gets soft amber glow (`box-shadow: 0 0 20px amber-500/20`) |
| Task appearing     | Card fades in: `opacity-0 scale-95` → `opacity-100 scale-100` over 300ms, brief amber highlight that fades |
| Task completing    | Checkbox fills amber, title gets smooth strikethrough animation    |
| Batch creation     | Cards stagger in one-by-one (100ms delay between each) — the "wow" moment |
| Agent idle         | No glow. Clean, calm interface. Amber only appears on activity.    |

### 5.4 App Shell

**Header/Navbar:**
- Left: "sorted ●" logo (amber dot)
- Right: User avatar + settings icon
- Clean, minimal, no heavy borders — just a subtle `stone-100` background or transparent

**Sidebar (optional, for future agents):**
- Left sidebar that lists available agents
- Jett is active (amber indicator), future agents are greyed silhouettes
- Collapses on mobile

---

## 6. Landing Page

### 6.1 Navbar
- Left: "sorted" logo with amber dot
- Right: "Sign in" (text link) + "Get Started" (amber filled button, `rounded-full`)
- Sticky on scroll: `backdrop-blur` + `white/80` background
- No border-bottom — floats cleanly

### 6.2 Hero Section (Universe-first)

- **Headline:** "A universe of agents that work for you."
  - `text-5xl` / `text-6xl`, `stone-900`, tight tracking, `font-semibold`
- **Subtitle:** "Sorted is a calm, intelligent space where AI agents handle what your brain shouldn't have to."
  - `text-lg`, `stone-500`
- **Visual:** Ambient animation or illustration showing multiple agent icons
  - Jett is lit up / active with amber glow
  - 3-4 other agents are soft silhouettes (coming soon energy)
  - Clean, minimal, not cluttered
- **CTA:** "Meet your first agent" (amber button, scrolls to Jett section)

### 6.3 Meet Jett Section

- **Transition line:** *"Every universe starts somewhere. Meet Jett — your task agent."*
- **Live demo embed:** Auto-playing scripted interaction in a rounded container
  - Container: `rounded-2xl`, warm shadow (`shadow-xl shadow-amber-500/5`), thin `stone-200` border
  - Shows mini split view: left chat, right tasks
  - Script (15-second loop, starts after 1s delay):
    1. Jett greets user
    2. User types "plan my morning"
    3. Jett thinks (amber pulse)
    4. 3 task cards stagger in on the right
    5. One gets checked off
    6. Soft fade reset, loop restarts
- **Lore teaser:** 2-3 lines of Jett's origin
  - *"Built to cut through the noise. You speak chaos. Jett returns order."*
- **CTAs:** "Get Started with Jett" (amber, primary) + "Read Jett's story" (text link)

### 6.4 How It Works Section

Three columns:

| Step | Icon           | Heading           | Description                                          |
|------|----------------|-------------------|------------------------------------------------------|
| 1    | Chat icon      | Talk naturally    | Tell Jett what you need in plain English.            |
| 2    | Sparkle icon   | Jett takes action | Tasks are created, organized, and updated for you.   |
| 3    | Checkbox icon  | Stay on track     | Your task list is always current. Just check things off. |

- Icons use amber fill
- Everything else in stone tones
- Clean, generous whitespace

### 6.5 Vision Section

- **Headline:** "Jett is just the first."
- 3-4 agent silhouettes with placeholder names and roles:
  - [silhouette] **???** — Calendar (coming soon)
  - [silhouette] **???** — Notes (coming soon)
  - [silhouette] **???** — Habits (coming soon)
- All greyed out, amber unlock glow on hover
- *"Each agent has its own tools, its own story, its own purpose. One universe. Your universe."*

### 6.6 Footer
- Minimal: Logo, navigation links (About, GitHub, Sign in)
- No "built with AI" badge
- Clean and light

---

## 7. Future Universe Expansion

The architecture is designed for multiple agents:

- **Each agent** gets: a name, an origin story, a color accent (within the warm palette), MCP tools, and a dedicated chat interface
- **The app sidebar** becomes an agent roster — click an agent to switch to their chat + workspace
- **The landing page** evolves: as new agents launch, they "light up" in the hero visual
- **The lore page** becomes a universe wiki — each agent has their own entry
- **Cross-agent interactions** (future): agents can reference each other's data (e.g., calendar agent knows about task due dates from Jett)

---

## 8. Design Principles

1. **Amber means alive.** The accent color only appears when an agent is active or an action is happening. At rest, the UI is calm stone tones. Amber = intelligence at work.
2. **Show, don't tell.** The live demo, the staggering cards, the shimmer — let people SEE the agent work instead of reading about it.
3. **Warm over cold.** Every shadow, border, and background leans warm (stone, not zinc/gray). The AI should feel like a companion, not a machine.
4. **Cards breathe.** Task cards have generous padding, subtle shadows, and micro-interactions. Each one feels like an object, not a row in a spreadsheet.
5. **Universe-ready.** Every design decision should accommodate future agents. Sidebar, color system, lore pages — all extensible.

---

## 9. Implementation Priority

1. **Landing page** — Universe hero + Meet Jett section + live demo
2. **App layout** — Split view (chat + task panel) with responsive mobile tabs
3. **Task cards** — New card design with agent badges and animations
4. **Chat UI** — Jett messages, action cards, input bar
5. **Agent animations** — Shimmer, stagger, thinking states
6. **Jett lore page** — Origin story, character sheet
7. **Vision section** — Future agent silhouettes on landing page

---

*This document captures the brainstorming session for the Sorted Universe UI design. All decisions were made collaboratively and approved before documentation.*
