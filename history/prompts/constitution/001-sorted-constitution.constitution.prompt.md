---
id: 001
title: sorted-constitution
stage: constitution
date: 2025-12-07
surface: agent
model: claude-opus-4.5-20251101
feature: none
branch: main
user: hak
command: /sp.constitution
labels: [constitution, initial, sorted]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - None (constitution level)
---

## Prompt

User input for /sp.constitution:

CONSTITUTION:

  Project: "sorted"

  Core Principles (Engineering Directives):
  1. Readability Over Cleverness: Code must prioritize clarity over brevity. Five straightforward lines are always preferable to two convoluted ones that require mental gymnastics to understand. If a reviewer needs to pause and re-read a line to grasp its intent, it's too clever.
  2. Async-First Design: All I/O operations must be asynchronous to ensure responsiveness. Database queries, HTTP calls, and external service integrations use async/await patterns. No blocking calls on the hot path.
  3. Security by Default: Every input is treated as untrusted. Authentication, authorization, and data validation must happen at system boundaries. Secrets are never committed, environment variables are mandatory for sensitive data, and JWT tokens have reasonable expiry.
  4. Phase-Based Evolution: The project progresses through five distinct phases (Console -> Web -> AI Chatbot -> Local K8s -> Cloud-Native). Each phase builds incrementally on the previous. Features are only implemented when their phase is active—no premature optimization for later phases.

  Global Constraints (Technical Platform):
  - Phase I (Console): Python 3.13+, UV package manager, in-memory storage
  - Phase II (Web): Next.js 16+ (App Router) frontend, FastAPI backend, SQLModel ORM, Neon Serverless PostgreSQL
  - Phase III (AI Chatbot): OpenAI ChatKit (UI), OpenAI Agents SDK, Official MCP SDK (Python), stateless chat endpoint
  - Phase IV (Local K8s): Docker containerization, Minikube, Helm Charts, kubectl-ai, Kagent
  - Phase V (Cloud-Native): Kafka or Redpanda (event streaming), Dapr (distributed application runtime), Kubernetes on cloud (AKS/GKE/Oracle CI/CD: GitHub Actions
  - Authentication: Better Auth with JWT tokens for phase II-V
  - Project Structure: Monorepo with clear separation of phases

  Workflow Policies:
  - Documentation Strategy: Never rely on internal training data. First Check Relevent skills if not found then Always fetch official documentation via Context 7 MCP Server before implementing any library (OpenAI SDKs, Better Auth, Dapr, Kafka, etc.).
  - Code References: All code changes must reference source location (file:line) for context and traceability.
  - Git Workflow: Each phase submission creates a tagged release. PRs must reference specs and tasks.
  - Testing: Unit tests for business logic, integration tests for API boundaries, end-to-end tests for critical user flows.
  - Prompt History Records: Every user interaction generates a PHR in history/prompts/ with full verbatim prompt preserved.

  Quality Standards:
  - Code Style: Python follows PEP8 with type hints. TypeScript/JavaScript follows ESLint/Prettier conventions.
  - Naming: Variables and functions use descriptive names that explain their purpose. No single-letter variables except loop indices.
  - Comments: Add comments only when code intent is not obvious from variable names and structure.
  - Error Handling: All async operations have explicit error handling. Errors return user-friendly messages; technical details logged appropriately.
  - Performance: API endpoints respond within 200ms for simple operations, 500ms for complex queries. Database queries use indexes on filtered columns.

  Success Criteria (Deliverables):
  1. Phase I: Functional console app with all Basic Level features (Add, Delete, Update, View, Mark Complete), clean Python structure, in-memory storage.
  2. Phase II: Full-stack web app with Next.js frontend and FastAPI backend, persistent Neon PostgreSQL storage, Better Auth with JWT integration, responsive UI.
  3. Phase III: AI-powered chatbot using OpenAI Agents SDK and MCP tools for all task operations, stateless chat endpoint with database persistence, natural language task management.
  4. Phase IV: Docker containers for frontend and backend, Helm charts for deployment, successful deployment on Minikube using kubectl-ai/Kagent.
  5. Phase V: Event-driven architecture with Kafka, Dapr integration (Pub/Sub, State, Bindings, Secrets), cloud deployment on AKS/GKE/Oracle OKE with CI/CD pipeline, all Advanced Level features (Recurring Tasks, Due Dates & Reminders, Priorities, Tags, Search, Filter, Sort).

Context from previous conversation:
The user is building "sorted", a comprehensive todo app with the tagline: "A todo app that takes your clutter and sort it into todos, because your mind should always be sorted."

The app is divided into 5 big phases each building on the previous one:
- Phase I: In-Memory Python Console App
- Phase II: Full-Stack Web Application
- Phase III: AI-Powered Todo Chatbot
- Phase IV: Local Kubernetes Deployment
- Phase V: Advanced Cloud Deployment

Clarifying questions asked and answered:
1. Target Users: Individual users managing personal tasks
2. Quality Level: Production-ready (robust, tested, deployable to real users)
3. Code Simplicity: Use ORM, use advanced techniques, just do not be so clever and try to write code in few lines that add complexity, 5 simple lines are better then 2 very very clever line that takes more time to understand.
4. Performance Requirements: Fast, secure, asynchronous

## Response snapshot

Constitution created and saved to `.specify/memory/constitution.md` with the following structure:

- Sync Impact Report (HTML comment at top)
- Core Principles (5 engineering directives):
  1. Readability Over Cleverness - clarity over brevity
  2. Async-First Design - async/await for all I/O
  3. Security by Default - treat all input as untrusted
  4. Phase-Based Evolution - 5 phases, incremental build
  5. Spec-Driven Development (NON-NEGOTIABLE) - no code without spec

- Global Constraints (Technical Platform):
  - Phase I: Python 3.13+, UV, in-memory
  - Phase II: Next.js 16+, FastAPI, SQLModel, Neon DB
  - Phase III: OpenAI ChatKit, Agents SDK, MCP SDK
  - Phase IV: Docker, Minikube, Helm, kubectl-ai/Kagent
  - Phase V: Kafka/Redpanda, Dapr, Cloud K8s

- Workflow Policies: Documentation strategy, code references, git workflow, testing, PHRs
- Quality Standards: Code style, naming, comments, error handling, performance
- Success Criteria: Detailed deliverables for each of 5 phases
- Governance: Amendment procedure, versioning policy, compliance review, hierarchy

Version: 1.0.0 | Ratified: 2025-12-07 | Last Amended: 2025-12-07

## Outcome

- ✅ Impact: Constitution created for sorted project with comprehensive principles, constraints, and governance
- 🧪 Tests: None (constitution-level document)
- 📁 Files: .specify/memory/constitution.md, history/prompts/constitution/001-sorted-constitution.constitution.prompt.md
- 🔁 Next prompts: Use /sp.specify to create first feature specification
- 🧠 Reflection: Constitution emphasizes KISS principles, async-first design, and security. Spec-driven workflow is enforced as NON-NEGOTIABLE.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - constitution validated against templates
- Prompt variant (if applicable): initial-constitution-v1
- Next experiment (smallest change to try): None - constitution ready for feature specifications
