# Data Model: AI-Powered Todo Chatbot

**Feature**: 009-ai-todo-chatbot
**Date**: 2026-02-08

## New Entities

### ChatThread

A conversation container scoped to a single user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique thread identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owning user (user isolation) |
| title | String(200) | NOT NULL | Auto-generated from first message |
| created_at | DateTime | NOT NULL, auto | Thread creation timestamp |
| updated_at | DateTime | NOT NULL, auto | Last activity timestamp |

**Indexes**:
- `ix_chat_threads_user_updated` on (`user_id`, `updated_at` DESC) — for listing threads by recency

**Relationships**:
- Belongs to `User` (many-to-one)
- Has many `ChatMessage` (one-to-many)

---

### ChatMessage

An individual message within a thread.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique message identifier |
| thread_id | UUID | FK → chat_threads.id, NOT NULL | Parent thread |
| role | String(20) | NOT NULL, enum: user/assistant | Message sender role |
| content | Text | NOT NULL | Message text content |
| tool_calls | JSON | NULL | Tool call metadata (for assistant messages) |
| created_at | DateTime | NOT NULL, auto | Message timestamp |

**Indexes**:
- `ix_chat_messages_thread_created` on (`thread_id`, `created_at`) — for loading messages in order
- `ix_chat_messages_thread_created_desc` on (`thread_id`, `created_at` DESC) — for loading last N messages

**Relationships**:
- Belongs to `ChatThread` (many-to-one)

---

## Existing Entities (Unchanged)

### Task (existing)

No schema changes. Tasks are read/modified by the agent tools using the existing CRUD functions. The agent passes `user_id` from its context to scope all queries.

### User (existing)

No schema changes. `chat_threads.user_id` references `users.id` via foreign key.

---

## State Transitions

### ChatThread Lifecycle

```
[Created] → [Active] → [Archived (future)]
```

- **Created**: Thread created on first user message. Title auto-generated.
- **Active**: Messages can be added. `updated_at` refreshed on each new message.
- **Archived**: Future feature (out of scope for Phase III).

### ChatMessage Lifecycle

Messages are immutable once created. No update or delete operations.

---

## Query Patterns

| Operation | Query | Frequency |
|-----------|-------|-----------|
| List user threads | `WHERE user_id = ? ORDER BY updated_at DESC` | On page load |
| Load thread messages | `WHERE thread_id = ? ORDER BY created_at ASC` | On page load, thread switch |
| Load last N messages | `WHERE thread_id = ? ORDER BY created_at DESC LIMIT 50` | On each chat request |
| Create thread | `INSERT chat_threads (...)` | On first message |
| Create message | `INSERT chat_messages (...)` | On each user/assistant message |
| Update thread title | `UPDATE chat_threads SET title = ? WHERE id = ?` | On first message |
| Update thread timestamp | `UPDATE chat_threads SET updated_at = ? WHERE id = ?` | On each message |

---

## Validation Rules

- `ChatThread.title`: 1-200 characters, auto-generated (not user-editable in Phase III)
- `ChatMessage.role`: Must be one of `"user"` or `"assistant"`
- `ChatMessage.content`: Non-empty string
- `ChatMessage.tool_calls`: Valid JSON or NULL
- User isolation: All thread queries MUST filter by `user_id`
