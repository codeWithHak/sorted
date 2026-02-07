# Quickstart: Sorted Universe Landing & App UI

**Feature**: `008-sorted-universe-landing-and-app-ui`
**Date**: 2026-02-07

## Prerequisites

- Node.js 20+
- pnpm or npm
- Running backend API (FastAPI on port 8000) — only needed for task CRUD testing
- Environment file `apps/web/.env.local` configured (existing from 005-auth)

## Setup

```bash
# Switch to feature branch
git checkout 008-sorted-universe-landing-and-app-ui

# Install new dependency (Framer Motion for animations)
cd apps/web
npm install motion@latest

# Start development server
npm run dev
```

## New Dependency

| Package | Version | Purpose |
|---------|---------|---------|
| motion | latest | Animation library for staggered task card entrance, animated strikethrough, and batch creation effects. Only loaded in authenticated app routes (dynamic import). |

## Key Implementation Notes

### Color System

All `zinc-*` classes are replaced with `stone-*` equivalents. Dark mode classes (`dark:*`) are removed entirely — this is a light-only design. The amber accent color appears only during agent activity.

```
Base: white (#FFFFFF)
Surfaces: stone-50, stone-100
Text primary: stone-900
Text secondary: stone-500
Borders: stone-200
Shadows: custom warm shadow (stone-500 at 10% opacity)
Accent (agent active only): amber-500, orange-500
```

### File Changes Summary

| Action | Count | Description |
|--------|-------|-------------|
| NEW | ~25 | New components, hooks, types, data files |
| REPLACE | 3 | Landing page, dashboard page, dashboard layout |
| UPDATE | 3 | Root layout, globals.css, task types |
| REMOVE | 6 | Old task components (FilterBar, TaskList, TaskItem, EmptyState, Pagination, DeleteConfirm) |

### Auth Pages

The auth pages (`/auth/signin`, `/auth/signup`) are not modified in this feature. They'll continue to use zinc tones temporarily. A follow-up task can migrate them to the stone/amber palette.

### Testing Approach

1. **Visual**: Load landing page, check all 5 sections render; load app, check split view
2. **Responsive**: Resize browser across 1024px breakpoint; verify tab bar appears/disappears
3. **Animations**: Create tasks, complete tasks — verify card entrance/completion animations
4. **Accessibility**: Tab through all interactive elements; verify focus indicators; check contrast
5. **Chat**: Send messages, reload page — verify persistence; click task names in action cards
6. **Performance**: Run Lighthouse on landing page — target score >= 90

## Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page (universe-first, 5 sections) | REPLACE |
| `/dashboard` | Split-view app (chat + tasks) | REPLACE |
| `/dashboard/jett` | Jett lore/character page | NEW |
| `/auth/signin` | Sign in page | UNCHANGED |
| `/auth/signup` | Sign up page | UNCHANGED |
