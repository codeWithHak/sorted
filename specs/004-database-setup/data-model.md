# Data Model: Database Setup

**Feature**: 004-database-setup
**Date**: 2026-02-05

## Entity Relationship Diagram

```
┌─────────────────────────────────┐
│              User               │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ email: VARCHAR(255) UNIQUE      │
│ hashed_password: VARCHAR(255)   │
│ created_at: TIMESTAMP           │
└───────────────┬─────────────────┘
                │
                │ 1:N (user owns many tasks)
                │
┌───────────────▼─────────────────┐
│              Task               │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ title: VARCHAR(200) NOT NULL    │
│ description: VARCHAR(2000)      │
│ completed: BOOLEAN DEFAULT FALSE│
│ is_deleted: BOOLEAN DEFAULT FALSE│
│ user_id: UUID (FK → User.id)    │
│ created_at: TIMESTAMP           │
└─────────────────────────────────┘
```

## Entity Definitions

### User

Represents an application user who can own and manage tasks.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Client-generated unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED | User's email address for authentication |
| hashed_password | VARCHAR(255) | NOT NULL | Bcrypt-hashed password (never stored plain) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Indexes**:
- Primary: `id`
- Unique: `email` (also serves as lookup index)

### Task

Represents a todo item owned by a specific user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Client-generated unique identifier |
| title | VARCHAR(200) | NOT NULL | Task title (required, max 200 chars) |
| description | VARCHAR(2000) | NULLABLE | Optional task description |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Task completion status |
| is_deleted | BOOLEAN | NOT NULL, DEFAULT FALSE, INDEXED | Soft delete flag |
| user_id | UUID | FOREIGN KEY, NOT NULL | Owner reference |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |

**Indexes**:
- Primary: `id`
- Foreign Key: `user_id` → `User.id`
- Index: `is_deleted` (for filtering active tasks)
- Composite Index: `(user_id, is_deleted)` (for user task lists)

## Relationships

### User → Task (One-to-Many)

- A User can have zero or more Tasks
- A Task belongs to exactly one User
- Deleting a User is out of scope (handled by auth feature later)
- Querying tasks for a user filters `is_deleted=false` by default

## Validation Rules

### User

1. `email` must be valid email format (validated at API layer)
2. `email` must be unique across all users (database constraint)
3. `hashed_password` is never exposed in API responses

### Task

1. `title` required and non-empty (API validation + DB NOT NULL)
2. `title` max 200 characters (database constraint)
3. `description` max 2000 characters (database constraint)
4. `user_id` must reference existing User (foreign key constraint)

## State Transitions

### Task.completed

```
false (pending) ──toggle──▶ true (completed)
                ◀──toggle──
```

### Task.is_deleted (Soft Delete)

```
false (active) ──delete──▶ true (deleted)
               ◀──restore── (future feature)
```

## Query Patterns

### Get Active Tasks for User
```sql
SELECT * FROM tasks
WHERE user_id = :user_id AND is_deleted = FALSE
ORDER BY created_at DESC;
```

### Get Task by ID (excluding deleted)
```sql
SELECT * FROM tasks
WHERE id = :task_id AND is_deleted = FALSE;
```

### Soft Delete Task
```sql
UPDATE tasks SET is_deleted = TRUE WHERE id = :task_id;
```

## SQLModel Implementation Notes

1. Use `sa_column=Column(PGUUID(as_uuid=True))` for native PostgreSQL UUID type
2. Use `Field(default_factory=uuid.uuid4)` for client-side UUID generation
3. Use `Field(default_factory=datetime.utcnow)` for timestamps
4. Use `Field(foreign_key="user.id")` for relationship
5. Add `__tablename__` to control table names (`users`, `tasks`)
