# Data Model: 005-auth Authentication

**Date**: 2026-02-06
**Feature**: 005-auth

## Entity Diagram

```
┌──────────────┐       ┌──────────────┐
│    user      │       │   account    │
├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ user_id (FK) │
│ name         │       │ id (PK)      │
│ email (UQ)   │       │ account_id   │
│ email_verified│      │ provider_id  │
│ image        │       │ password     │
│ created_at   │       │ created_at   │
│ updated_at   │       │ updated_at   │
└──────────────┘       └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   session    │       │ verification │       │    jwks      │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ identifier   │       │ public_key   │
│ token (UQ)   │       │ value        │       │ private_key  │
│ expires_at   │       │ expires_at   │       │ created_at   │
│ ip_address   │       │ created_at   │       │ expires_at   │
│ user_agent   │       │ updated_at   │       └──────────────┘
│ created_at   │       └──────────────┘
│ updated_at   │
└──────────────┘

       │ (existing from 004)
       ▼
┌──────────────┐
│    task      │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ title        │
│ description  │
│ completed    │
│ is_deleted   │
│ created_at   │
└──────────────┘
```

## Entity Details

### user (modified from 004-database-setup)

Managed by Better Auth. Represents an authenticated application user.

| Field          | Type      | Constraints                  | Notes                           |
|----------------|-----------|------------------------------|---------------------------------|
| id             | UUID      | PK, auto-generated           | Unchanged from 004              |
| name           | string    | NOT NULL                     | NEW — required by Better Auth   |
| email          | string    | NOT NULL, UNIQUE, indexed     | Unchanged from 004              |
| email_verified | boolean   | NOT NULL, default false       | NEW — Better Auth requirement   |
| image          | string    | nullable                     | NEW — Better Auth optional field |
| created_at     | timestamp | NOT NULL, auto-generated      | Unchanged from 004              |
| updated_at     | timestamp | NOT NULL, auto-generated      | NEW — Better Auth requirement   |

**Migration from 004**: Remove `hashed_password` column (passwords move to `account` table). Add `name`, `email_verified`, `image`, `updated_at` columns.

### account (new)

Managed by Better Auth. Stores authentication provider credentials (email/password in our case).

| Field        | Type   | Constraints        | Notes                                     |
|--------------|--------|--------------------|-------------------------------------------|
| id           | string | PK                 | Better Auth managed                        |
| user_id      | string | FK → user.id       | Links to user                              |
| account_id   | string | NOT NULL           | Provider-specific user ID                  |
| provider_id  | string | NOT NULL           | "credential" for email/password            |
| password     | string | nullable           | Scrypt-hashed password                     |
| access_token | string | nullable           | For OAuth providers (unused in our scope)  |
| refresh_token| string | nullable           | For OAuth providers (unused in our scope)  |
| created_at   | timestamp | NOT NULL         |                                            |
| updated_at   | timestamp | NOT NULL         |                                            |

### session (new)

Managed by Better Auth. Tracks active user sessions.

| Field      | Type      | Constraints           | Notes                        |
|------------|-----------|-----------------------|------------------------------|
| id         | string    | PK                    | Better Auth managed          |
| user_id    | string    | FK → user.id          | Session owner                |
| token      | string    | NOT NULL, UNIQUE      | Session token (cookie-based) |
| expires_at | timestamp | NOT NULL              | Session expiry (7 days)      |
| ip_address | string    | nullable              | Client IP for auditing       |
| user_agent | string    | nullable              | Browser info for auditing    |
| created_at | timestamp | NOT NULL              |                              |
| updated_at | timestamp | NOT NULL              |                              |

### verification (new)

Managed by Better Auth. Stores verification tokens (email verification, password reset — out of scope but table required by Better Auth).

| Field      | Type      | Constraints  | Notes               |
|------------|-----------|--------------|----------------------|
| id         | string    | PK           | Better Auth managed  |
| identifier | string    | NOT NULL     | What is being verified |
| value      | string    | NOT NULL     | Verification token   |
| expires_at | timestamp | NOT NULL     | Token expiry         |
| created_at | timestamp | NOT NULL     |                      |
| updated_at | timestamp | NOT NULL     |                      |

### jwks (new — JWT plugin)

Managed by Better Auth JWT plugin. Stores asymmetric key pairs for JWT signing.

| Field       | Type      | Constraints  | Notes                              |
|-------------|-----------|--------------|-------------------------------------|
| id          | string    | PK           | Better Auth managed                 |
| public_key  | string    | NOT NULL     | Public key for verification         |
| private_key | string    | NOT NULL     | AES-256-GCM encrypted private key   |
| created_at  | timestamp | NOT NULL     |                                     |
| expires_at  | timestamp | nullable     | For key rotation (30-day default)   |

### task (unchanged)

No changes from 004-database-setup. The `user_id` FK continues to reference `user.id`.

## State Transitions

### User Lifecycle
```
[visitor] → sign-up → [registered user] → sign-in → [authenticated]
                                              ↑              │
                                              └── sign-out ──┘
```

### Session Lifecycle
```
[created on sign-in] → [active] → [expired after 7 days]
                          │
                     [terminated on sign-out]
```

### JWT Token Lifecycle
```
[issued via token() call] → [valid for 15 min] → [expired]
                                │
                           [verified by backend on each request]
```

## Validation Rules

- **email**: Valid email format, unique across all users
- **password**: Minimum 8 characters, maximum 128 characters (enforced by Better Auth)
- **name**: Required, non-empty string (can default to email prefix during sign-up)
- **JWT payload**: Must contain `sub` (user id), `email`, `iat`, `exp`, `iss`, `aud`
