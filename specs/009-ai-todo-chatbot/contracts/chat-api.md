# API Contract: Chat Endpoints

**Feature**: 009-ai-todo-chatbot
**Date**: 2026-02-08

## POST /chat

Send a message and receive a streaming SSE response.

**Authentication**: Bearer JWT (existing `get_current_user`)

### Request

```json
{
  "message": "add a task to buy groceries",
  "thread_id": "uuid-or-null"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | yes | User's natural language message (1-2000 chars) |
| thread_id | string (UUID) | no | Existing thread ID. If null, creates a new thread. |

### Response: `200 OK` — `text/event-stream`

SSE stream with the following event types:

#### `stream_start`
```
event: stream_start
data: {"thread_id": "abc-123", "message_id": "msg-456", "timestamp": "2026-02-08T10:00:00Z"}
```

#### `text_token`
```
event: text_token
data: {"token": "I'll", "index": 0}
```

#### `task_action`
```
event: task_action
data: {"action_type": "created", "task_id": "task-789", "task_title": "Buy groceries", "task_count": 1}
```

`action_type` is one of: `created`, `updated`, `completed`, `deleted`

#### `stream_end`
```
event: stream_end
data: {"message_id": "msg-456", "finish_reason": "stop", "full_text": "Done! I created..."}
```

`finish_reason` is one of: `stop`, `error`, `max_tokens`

#### `error`
```
event: error
data: {"code": "RATE_LIMITED", "message": "Please try again in a moment.", "retryable": true}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 401 | Missing or invalid JWT |
| 422 | Invalid request body (empty message, message too long) |

---

## GET /chat/threads

List the authenticated user's conversation threads.

**Authentication**: Bearer JWT

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number (1-based) |
| per_page | int | 20 | Results per page (1-50) |

### Response: `200 OK`

```json
{
  "data": [
    {
      "id": "abc-123",
      "title": "Grocery shopping tasks",
      "created_at": "2026-02-08T10:00:00Z",
      "updated_at": "2026-02-08T10:05:00Z",
      "message_count": 12
    }
  ],
  "total": 5,
  "page": 1,
  "per_page": 20,
  "total_pages": 1
}
```

---

## GET /chat/threads/{thread_id}/messages

Retrieve messages for a specific conversation thread.

**Authentication**: Bearer JWT

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| thread_id | UUID | Thread ID |

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number (1-based) |
| per_page | int | 50 | Results per page (1-100) |

### Response: `200 OK`

```json
{
  "data": [
    {
      "id": "msg-001",
      "role": "user",
      "content": "add a task to buy groceries",
      "action_card": null,
      "created_at": "2026-02-08T10:00:00Z"
    },
    {
      "id": "msg-002",
      "role": "assistant",
      "content": "Done! I created a task for you.",
      "action_card": {
        "action_type": "created",
        "task_count": 1,
        "tasks": [{"id": "task-789", "title": "Buy groceries"}]
      },
      "created_at": "2026-02-08T10:00:01Z"
    }
  ],
  "total": 2,
  "page": 1,
  "per_page": 50,
  "total_pages": 1
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 401 | Missing or invalid JWT |
| 404 | Thread not found or belongs to another user |

---

## SSE Event Type Reference

| Event | When Emitted | Frontend Action |
|-------|-------------|-----------------|
| `stream_start` | First event in every stream | Hide thinking indicator, init message |
| `text_token` | Each token from AI response | Append token to current message |
| `task_action` | Agent modifies a task | Build action card, trigger task panel refresh |
| `stream_end` | Response complete | Finalize message, persist if needed |
| `error` | Any error during streaming | Show error message, stop thinking indicator |
