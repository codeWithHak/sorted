# Data Model: Sorted Universe Landing & App UI

**Feature**: `008-sorted-universe-landing-and-app-ui`
**Date**: 2026-02-07

## Overview

This feature is frontend-only. No database schema changes. All new data structures are TypeScript interfaces for client-side state management. The existing backend Task API remains unchanged.

## Entities

### ChatMessage

Represents a single message in the user–Jett conversation. Stored in localStorage.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | UUID generated client-side |
| sender | "user" \| "agent" | yes | Who sent the message |
| agentId | string \| null | no | Agent identifier (e.g., "jett") — null for user messages |
| content | string | yes | Message text content |
| timestamp | string (ISO 8601) | yes | When the message was created |
| actionCard | ActionCardData \| null | no | Inline action summary, if Jett performed actions |

**State transitions**: Created → (immutable — messages are append-only)

**Validation**:
- `content` must be non-empty after trimming
- `sender` must be one of the allowed values
- `timestamp` must be valid ISO 8601

### ActionCardData

Embedded data within a Jett message describing actions performed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| actionType | "created" \| "updated" \| "completed" \| "deleted" | yes | What Jett did |
| taskCount | number | yes | Number of tasks affected |
| tasks | ActionTaskRef[] | yes | List of affected tasks with names and IDs |

### ActionTaskRef

Reference to a task within an action card, enabling cross-panel linking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Task ID (matches backend task.id) |
| title | string | yes | Task title for display |

### Task (extended — frontend only)

Extends the existing backend `Task` interface with client-side display fields.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| id | string | yes | backend | UUID |
| title | string | yes | backend | Task title |
| description | string \| null | no | backend | Task description |
| completed | boolean | yes | backend | Completion status |
| created_at | string | yes | backend | ISO 8601 creation timestamp |
| updated_at | string | yes | backend | ISO 8601 update timestamp |
| created_by | "user" \| "agent" | yes | frontend | Creator attribution (default: "user") |
| agent_id | string \| null | no | frontend | Which agent created it (e.g., "jett") |

**Note**: `created_by` and `agent_id` are frontend-only fields. Currently all tasks are created by user (manual). When Phase III connects the AI backend, agent-created tasks will have `created_by: "agent"` and `agent_id: "jett"`. For the mock implementation, the mock Jett response handler sets these fields on tasks it "creates."

**Grouping logic** (client-side):
- **Completed**: `completed === true`
- **Today**: `completed === false` (all non-completed tasks, since `due_date` doesn't exist yet)
- **Upcoming**: Empty initially (activates when `due_date` is added in Phase V)

### Agent

Static data representing an agent in the Sorted universe.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique identifier (e.g., "jett") |
| name | string | yes | Display name (e.g., "Jett") |
| role | string | yes | Short role description (e.g., "Task Agent") |
| accentColor | string | yes | Tailwind color name (e.g., "amber") |
| status | "active" \| "coming_soon" | yes | Whether the agent is functional |
| tagline | string | yes | One-liner (e.g., "You speak chaos. Jett returns order.") |
| lore | AgentLore \| null | no | Full lore content (only for active agents) |

### AgentLore

Content for the agent lore page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| origin | string | yes | Origin narrative text (markdown) |
| abilities | AgentAbility[] | yes | List of abilities for character sheet display |

### AgentAbility

Single ability entry in the character sheet.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Ability name (e.g., "Task Capture") |
| description | string | yes | What the ability does |
| icon | string | yes | Icon identifier or emoji |

### AgentActivityState

Tracks the current agent state for driving animations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | "idle" \| "thinking" \| "acting" | yes | Current agent activity |
| activeAgentId | string \| null | no | Which agent is active |
| pendingTaskIds | string[] | no | Task IDs being created/modified (for batch animation) |

**State transitions**:
- idle → thinking (user sends message)
- thinking → acting (Jett processes and modifies tasks)
- acting → idle (all actions complete, animations finished)

## Relationships

```
User 1──* ChatMessage (via localStorage, keyed by userId)
ChatMessage 1──0..1 ActionCardData (embedded)
ActionCardData 1──* ActionTaskRef (embedded array)
ActionTaskRef *──1 Task (by task.id reference, cross-panel linking)
Agent 1──0..1 AgentLore (embedded, only for active agents)
AgentLore 1──* AgentAbility (embedded array)
```

## Storage Summary

| Entity | Storage | Persistence | Max Size |
|--------|---------|-------------|----------|
| ChatMessage | localStorage | Across sessions | 200 messages per user |
| Task | Backend API (PostgreSQL) | Server-side | Unlimited (paginated) |
| Agent | Static TypeScript data | Bundled | Fixed (5 agents) |
| AgentActivityState | React state | Session only | Single object |
