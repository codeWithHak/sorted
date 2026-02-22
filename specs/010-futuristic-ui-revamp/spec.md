# Feature Specification: Futuristic UI Revamp — Dark Universe Theme

**Feature Branch**: `010-futuristic-ui-revamp`
**Created**: 2026-02-22
**Status**: Completed
**Input**: User description: "Completely revamp the site's frontend UI from the warm stone-and-amber palette to a Dark Universe theme with emerald accents, futuristic glassmorphism, animated effects, new button components, agent character cards with portraits, and a cinematic agent lore page."

## Summary

This spec documents a comprehensive visual overhaul of the Sorted landing page and agent system. The previous warm stone/amber light-mode design was replaced with a dark, futuristic aesthetic inspired by modern SaaS products (Linear, Vercel, Raycast). The core theme shifted to a near-black background (#050505) with emerald (#059669) as the primary accent color, glassmorphism surfaces, and subtle radial glow effects throughout.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Experiences the Dark Universe Landing Page (Priority: P1)

A first-time visitor arrives at the landing page and immediately feels the premium, futuristic aesthetic. The dark background, animated GlitchyOrb in the hero, emerald-accented text, and smooth scroll animations create a compelling first impression. They see the headline, scroll through the agent showcase with character portraits, read Jett's section, and understand Sorted is a universe of AI agents.

**Why this priority**: The landing page is the primary acquisition surface. The old stone/amber theme felt outdated; this revamp ensures the first impression matches modern SaaS standards.

**Acceptance Scenarios**:

1. **Given** a visitor loads the landing page, **When** the page finishes loading, **Then** they see a dark (#050505) background with an animated GlitchyOrb centerpiece, emerald-accented headline "Building the Future of Work", and two CTA buttons (primary emerald "Meet Your Agents" and ghost "Get Started").
2. **Given** the page has loaded, **When** the visitor scrolls to the Agent Showcase section, **Then** they see horizontally scrollable agent cards with full-bleed character portraits, glass-morphism card styling, emerald/cyan/violet/lime accent glows per agent, and "Deploy" or "Standby" buttons.
3. **Given** the visitor views an available agent card (Jett), **When** they look at the card actions, **Then** they see a "Deploy Jett" primary button and a "Read story →" link.
4. **Given** the visitor scrolls to the How It Works section, **When** it becomes visible, **Then** they see three steps with emerald accent icons on a dark glass background.
5. **Given** the visitor scrolls to the Meet Jett section, **When** it becomes visible, **Then** they see Jett's portrait, role description, a "Get Started with Jett" primary button, and a "Read Jett's story →" link.

---

### User Story 2 — Visitor Reads Jett's Lore Page (Priority: P2)

A visitor clicks "Read story →" from the agent showcase or "Read Jett's story →" from the Meet Jett section and navigates to `/agents/jett`. They see a cinematic single-screen layout with Jett's portrait on the left, identity (name, role, tagline) and origin story on the right, and a "Get Started with Jett" CTA — all fitting within a single viewport without scrolling.

**Why this priority**: The lore page reinforces agent identity and the Universe concept. It's a portfolio differentiator that makes agents feel like characters, not features.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/agents/jett`, **When** the page loads, **Then** they see a single-screen (100vh) layout with Jett's portrait image on the left and text content on the right — no scrolling required.
2. **Given** the lore page has loaded, **When** the visitor reads the right column, **Then** they see the name "Jett" (large heading), "Task Agent" (mono subheading), the tagline in italic, an "Origin" section with the full origin story, and a "Get Started with Jett" RadialGlowButton.
3. **Given** the lore page, **When** the visitor clicks "← Back", **Then** they navigate back to the homepage.
4. **Given** the page is accessed directly at `/agents/jett`, **When** it renders, **Then** it does NOT use the dashboard layout (no sidebar, no header, no overflow restrictions).

---

### User Story 3 — Authenticated User Sees Updated Agent Sidebar (Priority: P2)

An authenticated user on the dashboard sees the agent sidebar with updated agent names (Jett, Yamal, Drago, Iori) and portrait thumbnails instead of colored letter icons. Active agents show full-color portraits; coming-soon agents show grayscale faded portraits.

**Why this priority**: The sidebar is a persistent visual element in the dashboard. Outdated amber icons and wrong agent names undermine the cohesive Dark Universe brand.

**Acceptance Scenarios**:

1. **Given** an authenticated user views the sidebar, **When** Jett is listed, **Then** Jett's portrait (/jett.jpg) is displayed in a 32×32 rounded container with an emerald active indicator dot.
2. **Given** the sidebar lists coming-soon agents, **When** the user sees Yamal, Drago, Iori, **Then** each shows a grayscale portrait at 30% opacity, their correct names, and "coming soon" label.
3. **Given** the sidebar, **When** the user clicks "About Jett →", **Then** they navigate to `/agents/jett`.

---

### User Story 4 — New Button Component (RadialGlowButton) (Priority: P1)

All CTA buttons across the site use the new RadialGlowButton component with three distinct variants: Primary (emerald glow, main CTA), Ghost (transparent outline, secondary CTA), and Standby (muted, disabled). Buttons have hover scale, glow intensification, and active press-down animations.

**Why this priority**: The buttons are the primary interactive elements across the entire site. Consistent, premium-feeling buttons are essential for the Dark Universe theme.

**Acceptance Scenarios**:

1. **Given** any primary CTA button on the site, **When** the user views it, **Then** it renders as a RadialGlowButton with emerald radial gradient background, rounded corners, and soft emerald glow shadow.
2. **Given** a primary RadialGlowButton, **When** the user hovers, **Then** the button scales up 3%, the glow intensifies, and the background gradient brightens.
3. **Given** a ghost variant button, **When** the user hovers, **Then** the border brightens to emerald, a subtle box-shadow appears, and the text turns white.
4. **Given** a standby variant button, **When** the user views it, **Then** it appears muted with no interactivity — communicating "unavailable".
5. **Given** an `href` prop, **When** the button renders, **Then** it wraps in a Next.js `<Link>` component for client-side navigation.

---

### Edge Cases

- What happens when the lore page image fails to load? The layout still displays correctly with alt text and the text column remains readable.
- What happens on mobile viewports for the lore page? The layout stacks vertically (portrait above, text below) with adjusted sizing.
- What happens when auth page buttons are encountered? They retain the existing solid emerald style — not replaced with RadialGlowButton, as simpler buttons are more appropriate for form submissions.

---

## Changes Made *(implementation record)*

### Design System — Dark Universe Theme

#### [MODIFY] [globals.css](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/app/globals.css)

Complete color system rewrite from warm stone/amber to Dark Universe:

| Token | Old Value | New Value |
|---|---|---|
| `--background` | `#ffffff` | `#050505` |
| `--foreground` | stone-900 | `#ffffff` |
| `--accent-primary` | amber-500 | `#059669` (emerald) |
| `--accent-cyan` | — | `#06b6d4` |
| `--accent-violet` | — | `#8b5cf6` |
| `--accent-lime` | — | `#84cc16` |
| `--glass-bg` | — | `rgba(255,255,255,0.05)` |
| `--glass-border` | stone-200 | `rgba(255,255,255,0.1)` |

Added glassmorphism utilities, animation keyframes (float, pulse-glow, slow-spin, drift-up), `@media (prefers-reduced-motion)` support, and RadialGlowButton interaction styles for hover/active states.

---

### New Components

#### [NEW] [RadialGlowButton.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/brand/RadialGlowButton.tsx)

Replacement for `CyberButton`. Three variants:
- **Primary**: Emerald radial gradient, glow shadow, hover scale/intensify
- **Ghost**: Transparent with subtle border, hover emerald wash
- **Standby**: Muted/disabled appearance

API: `variant`, `size` (sm/md/lg), `href`, `onClick`, `disabled`, `type`, `className`. Wraps in `<Link>` when `href` is provided.

#### [NEW] [GlitchyOrb.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/effects/GlitchyOrb.tsx)

Animated hero centerpiece with glitch effects, canvas-based particle system, and emerald/cyan glow.

#### [NEW] [AuraGradient.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/effects/AuraGradient.tsx)

Ambient background gradient effect for sections.

#### [NEW] [DottedGlobe.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/effects/DottedGlobe.tsx)

Three.js dotted globe visualization.

#### [NEW] [GridBackground.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/effects/GridBackground.tsx)

Subtle grid pattern background with emerald-tinted lines.

---

### Modified Landing Page Components

#### [MODIFY] [HeroSection.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/landing/HeroSection.tsx)

Complete rewrite from light amber hero to dark cinematic layout:
- Animated GlitchyOrb as centerpiece
- "Building the Future of Work" headline with emerald gradient text
- Two CTAs: `RadialGlowButton primary` ("Meet Your Agents") and `ghost` ("Get Started")
- Scroll-triggered reveal animations via Intersection Observer

#### [MODIFY] [AgentShowcase.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/landing/AgentShowcase.tsx)

Complete rewrite from simple agent list to horizontally scrollable card carousel:
- Full-bleed character portrait images per agent
- Glassmorphism card containers with per-agent accent glow colors
- Chevron scroll controls
- Ability tags in monospaced pill badges
- `Deploy` (primary) or `Standby` buttons per agent
- "Read story →" link on Jett's card
- Agent names updated: Aria→Yamal, Flux→Drago, Pulse→Iori

#### [MODIFY] [HowItWorksSection.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/landing/HowItWorksSection.tsx)

Rewritten from light background to dark glass cards with emerald step indicators.

#### [MODIFY] [MeetJettSection.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/landing/MeetJettSection.tsx)

Updated with RadialGlowButton and emerald theme. Links updated to `/agents/jett`.

#### [MODIFY] [Navbar.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/brand/Navbar.tsx)

CyberButton replaced with RadialGlowButton (primary variant) for "Get Started" CTA.

---

### New Pages

#### [NEW] [agents/jett/page.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/app/agents/jett/page.tsx)

Cinematic agent lore page at `/agents/jett` (moved OUT of `/dashboard/jett` to escape the dashboard layout wrapper):
- Single 100vh layout: portrait left, content right
- Jett portrait image (380px wide on desktop) with emerald ambient glow
- Name, role, tagline, origin story, RadialGlowButton CTA
- Back link to homepage

#### [DELETE] [dashboard/jett/page.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/app/dashboard/jett/page.tsx)

Removed — replaced by `/agents/jett` route to avoid dashboard layout constraints (flex h-screen, overflow-hidden, sidebar).

---

### Data & Type Updates

#### [MODIFY] [agents.ts](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/data/agents.ts)

- Jett `accentColor`: amber → emerald
- Added `portrait` field to all agents (/jett.jpg, /aria.jpg, /flux.jpg, /pulse.jpg)
- Renamed agents: Aria→Yamal, Flux→Drago, Pulse→Iori
- Updated IDs accordingly: aria→yamal, flux→drago, pulse→iori

#### [MODIFY] [agent.ts](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/lib/types/agent.ts)

Added `portrait?: string` field to the `Agent` interface.

---

### Sidebar Updates

#### [MODIFY] [AgentItem.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/sidebar/AgentItem.tsx)

- Replaced amber letter-icon (`bg-amber-500` + first letter) with actual portrait images via Next.js `<Image>`
- Active agents: full-color 32×32 portrait with emerald active dot
- Coming-soon agents: grayscale + 30% opacity portrait
- Fallback to emerald letter icon if no portrait set

#### [MODIFY] [AgentSidebar.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/components/sidebar/AgentSidebar.tsx)

Updated "About Jett" link from `/dashboard/jett` to `/agents/jett`.

---

### Auth Pages

#### [UNCHANGED] [signin/page.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/app/auth/signin/page.tsx)
#### [UNCHANGED] [signup/page.tsx](file:///wsl.localhost/Ubuntu-24.04/home/hak/projects/sorted/apps/web/src/app/auth/signup/page.tsx)

**Decision**: Auth page buttons were deliberately left unchanged. The solid emerald fill with clip-path chamfer is more appropriate for form submit buttons than the RadialGlowButton, which is designed for marketing CTAs.

---

## Design System Reference

### Color Palette

```
Background:         #050505 (near-black)
Foreground:         #FFFFFF
Muted text:         #A8A29E

Emerald (primary):  #059669 (--accent-primary)
Emerald bright:     #34D399 (shine/highlight)
Emerald deep:       #047857 (shadows/depth)

Cyan (secondary):   #06B6D4 (--accent-cyan)
Violet (tertiary):  #8B5CF6 (--accent-violet)
Lime (quaternary):  #84CC16 (--accent-lime)

Glass BG:           rgba(255,255,255, 0.05)
Glass border:       rgba(255,255,255, 0.10)
Glass border hover: rgba(255,255,255, 0.20)
```

### Agent Accent Map

| Agent | Role | Accent | Portrait |
|---|---|---|---|
| **Jett** | Task Agent | Emerald `#059669` | `/jett.jpg` |
| **Yamal** | Calendar Agent | Cyan `#06B6D4` | `/aria.jpg` |
| **Drago** | Notes Agent | Violet `#8B5CF6` | `/flux.jpg` |
| **Iori** | Habits Agent | Lime `#84CC16` | `/pulse.jpg` |

### Button Variants

| Variant | Use Case | Visual |
|---|---|---|
| `primary` | Main CTAs | Emerald radial gradient, glow shadow |
| `ghost` | Secondary CTAs | Transparent, subtle border, emerald hover |
| `standby` | Unavailable actions | Muted, no interaction |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero amber/orange (`amber-500`, `bg-amber-*`) color references remain in any landing page or agent component.
- **SC-002**: All CTA buttons across the landing page use RadialGlowButton with correct variants (primary for main CTAs, ghost for secondary, standby for unavailable).
- **SC-003**: The Jett lore page at `/agents/jett` renders all content within a single viewport (100vh) without scrolling on desktop.
- **SC-004**: Agent sidebar shows portrait images for all 4 agents with correct styling (full-color for active, grayscale for coming-soon).
- **SC-005**: Agent names in the sidebar match the showcase: Jett, Yamal, Drago, Iori.
- **SC-006**: The `globals.css` Dark Universe theme applies consistently across all landing page sections with no leftover light-mode styles.
- **SC-007**: RadialGlowButton hover, active, and disabled states function correctly without layout shifts.
- **SC-008**: All links to Jett's lore page point to `/agents/jett` (not `/dashboard/jett`) and render outside the dashboard layout.

---

## Assumptions

- Character portrait images (`/jett.jpg`, `/aria.jpg`, `/flux.jpg`, `/pulse.jpg`) exist in the `/public` directory.
- The dashboard layout at `/dashboard/layout.tsx` remains unchanged — the lore page was moved OUT rather than modifying the dashboard wrapper.
- Auth pages (signin/signup) intentionally retain their existing button styles.
- The agent renaming (Aria→Yamal, Flux→Drago, Pulse→Iori) is final.
- No backend changes were made — this feature is entirely frontend.

## Scope Boundaries

### In Scope

- Complete color system transition from stone/amber to Dark Universe (emerald/dark)
- New RadialGlowButton component replacing CyberButton across all landing components
- New visual effects components (GlitchyOrb, AuraGradient, DottedGlobe, GridBackground)
- HeroSection complete rewrite with animated orb and gradient text
- AgentShowcase rewrite as horizontal card carousel with portraits
- Agent lore page moved to `/agents/jett` with cinematic layout
- Agent renaming and portrait addition to data layer and sidebar
- Sidebar AgentItem portrait images replacing letter icons

### Out of Scope

- Auth page button redesign (deliberately unchanged)
- Dashboard layout modifications
- New agent lore pages for Yamal, Drago, Iori (only Jett has lore content)
- Backend changes
- Mobile-specific optimizations beyond existing responsive classes
- New landing page sections or content additions
- CyberButton component deletion (kept for potential future use)
