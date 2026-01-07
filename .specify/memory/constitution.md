<!--
SYNC IMPACT REPORT
===================
Version Change: None -> 1.0.0 (Initial ratification)
Added Principles:
- Readability Over Cleverness
- Async-First Design
- Security by Default
- Phase-Based Evolution
- Spec-Driven Development (NON-NEGOTIABLE)

Added Sections:
- Core Principles (Engineering Directives)
- Global Constraints (Technical Platform)
- Workflow Policies
- Quality Standards
- Success Criteria (Deliverables)
- Governance

Templates Validated:
- plan-template.md: Constitution Check section aligned
- spec-template.md: Success Criteria aligned with SMART principles
- tasks-template.md: Testing discipline and phased approach aligned
✅ All templates reviewed and compatible

Follow-up TODOs: None
-->

# sorted Constitution

## Core Principles (Engineering Directives)

### 1. Readability Over Cleverness

Code must prioritize clarity over brevity. Five straightforward lines are always preferable to two convoluted lines that require mental gymnastics to understand. If a reviewer needs to pause and re-read a line to grasp its intent, it is too clever. Code should read like prose, not a puzzle. Avoid one-liners that compress multiple operations, nested comprehensions that hide logic flow, and clever mathematical tricks that save characters but destroy understanding.

### 2. Async-First Design

All I/O operations must be asynchronous to ensure responsiveness. Database queries, HTTP calls, and external service integrations use async/await patterns. No blocking calls on the hot path. This principle applies across all phases: console operations use async I/O where possible, web APIs use async route handlers, chatbot responses are async, and cloud services handle events asynchronously.

### 3. Security by Default

Every input is treated as untrusted. Authentication, authorization, and data validation must happen at system boundaries. Secrets are never committed, environment variables are mandatory for sensitive data, and JWT tokens have reasonable expiry. Input validation occurs before business logic, SQL queries use parameterized statements, and user data isolation is enforced at the database level.

### 4. Phase-Based Evolution

The project progresses through five distinct phases (Console -> Web -> AI Chatbot -> Local K8s -> Cloud-Native). Each phase builds incrementally on the previous. Features are only implemented when their phase is active—no premature optimization for later phases. This prevents over-engineering and ensures each phase delivers working value before moving forward.

### 5. Spec-Driven Development (NON-NEGOTIABLE)

No code is written without a specification. The workflow is strictly: Specify -> Plan -> Tasks -> Implement. Every implementation must reference the task ID it fulfills. Vibe-coding is prohibited. If a spec is missing or incomplete, the agent must stop and request clarification rather than inferring requirements.

## Global Constraints (Technical Platform)

### Phase I: In-Memory Console App
- Python 3.13+ required
- UV package manager for dependencies
- In-memory storage only (no database)
- Command-line interface with text I/O

### Phase II: Full-Stack Web Application
- Frontend: Next.js 16+ with App Router
- Backend: FastAPI with Python
- ORM: SQLModel for database operations
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- API: RESTful endpoints following spec-defined contracts

### Phase III: AI-Powered Todo Chatbot
- Frontend UI: OpenAI ChatKit
- AI Framework: OpenAI Agents SDK
- MCP Server: Official MCP SDK (Python)
- Chat Endpoint: Stateless design with database persistence
- Tools: MCP tools expose task CRUD operations

### Phase IV: Local Kubernetes Deployment
- Containerization: Docker (Docker Desktop)
- Orchestration: Minikube for local K8s
- Package Manager: Helm Charts for deployment
- AI DevOps: kubectl-ai and Kagent for intelligent operations
- Application: Phase III chatbot deployed as containers

### Phase V: Advanced Cloud Deployment
- Event Streaming: Kafka or Redpanda for event-driven architecture
- Distributed Runtime: Dapr for Pub/Sub, State, Bindings, Secrets, Service Invocation
- Cloud K8s: AKS (Azure), GKE (Google), or Oracle OKE
- CI/CD: GitHub Actions for automated deployments
- Features: All Advanced Level features (Recurring Tasks, Due Dates, Reminders, Priorities, Tags, Search, Filter, Sort)

### Cross-Phase Constraints
- Project Structure: Monorepo with clear separation of phases
- Git Workflow: Each phase submission creates a tagged release
- Documentation: Markdown with clear section headers
- Configuration: Environment variables for all sensitive data

## Workflow Policies

### Documentation Strategy

Never rely on internal training data. Always fetch official documentation via Context 7 MCP Server before implementing any library (OpenAI SDKs, Better Auth, Dapr, Kafka, etc.). This ensures current, accurate information rather than outdated internal knowledge.

### Code References

All code changes must reference source location (file:line) for context and traceability. When proposing changes, cite the exact lines being modified. When creating new code, reference related code patterns from existing files.

### Git Workflow

Each phase submission creates a tagged release. Pull requests must reference specs and tasks. Commit messages follow conventional format: `type(scope): description`. Types include: feat, fix, docs, refactor, test, chore.

### Testing

Unit tests for business logic, integration tests for API boundaries, end-to-end tests for critical user flows. Tests are written before implementation where possible (TDD), ensuring failures guide development. Coverage targets are defined per phase but minimum 70% for production code.

### Prompt History Records

Every user interaction generates a PHR in `history/prompts/` with full verbatim prompt preserved. PHRs are categorized by stage: constitution, spec, plan, tasks, red, green, refactor, explainer, misc, or general.

## Quality Standards

### Code Style

Python follows PEP8 with type hints. TypeScript/JavaScript follows ESLint/Prettier conventions. Formatting is automated via pre-commit hooks. Code review checks for adherence to style guides.

### Naming

Variables and functions use descriptive names that explain their purpose. No single-letter variables except loop indices (i, j, k) and mathematical contexts (x, y, z). Names should answer "what is this?" not "how is it used?". Booleans start with prefixes like `is_`, `has_`, `can_`, `should_`.

### Comments

Add comments only when code intent is not obvious from variable names and structure. Good code is self-documenting. Comments explain WHY, not WHAT. Docstrings are required for all public functions and classes.

### Error Handling

All async operations have explicit error handling. Errors return user-friendly messages; technical details are logged appropriately. Error types are specific and meaningful. Client receives actionable feedback.

### Performance

API endpoints respond within 200ms for simple operations, 500ms for complex queries. Database queries use indexes on filtered columns. Pagination is required for list operations. Caching is used where appropriate but never at the cost of correctness.

## Success Criteria (Deliverables)

### Phase I: In-Memory Console App
- Functional console app with all Basic Level features
- Add Task: Create new todo items with title and description
- Delete Task: Remove tasks from the list
- Update Task: Modify existing task details
- View Task List: Display all tasks with status indicators
- Mark as Complete: Toggle task completion status
- Clean Python structure following PEP8
- In-memory storage with proper data structures

### Phase II: Full-Stack Web Application
- Next.js frontend with responsive UI
- FastAPI backend with RESTful API endpoints
- Persistent Neon PostgreSQL storage with SQLModel
- Better Auth with JWT integration (signup, signin, token verification)
- All Basic Level features accessible via web interface
- User isolation enforced at database and API levels
- Deployed to Vercel (frontend) and cloud backend

### Phase III: AI-Powered Todo Chatbot
- ChatKit-based conversational interface
- OpenAI Agents SDK for natural language understanding
- MCP server with tools for all task operations (add, list, complete, delete, update)
- Stateless chat endpoint with database-persisted conversation history
- Natural language commands supported for all CRUD operations
- Graceful error handling and helpful responses
- Resume conversations after server restart

### Phase IV: Local Kubernetes Deployment
- Docker containers for frontend and backend
- Helm charts for deployment automation
- Successful deployment on Minikube
- kubectl-ai and Kagent used for cluster operations
- Local deployment demonstrates cloud-native patterns
- Health checks and proper resource limits configured

### Phase V: Advanced Cloud Deployment
- Event-driven architecture with Kafka or Redpanda
- Dapr integration: Pub/Sub (task-events, reminders), State (conversation cache), Bindings (scheduled triggers), Secrets (API keys), Service Invocation (frontend to backend)
- Cloud deployment on AKS, GKE, or Oracle OKE
- GitHub Actions CI/CD pipeline with automated testing and deployment
- All Advanced Level features: Recurring Tasks, Due Dates & Reminders, Priorities, Tags, Search, Filter, Sort
- Production-ready with monitoring, logging, and alerting

## Governance

### Amendment Procedure

Constitution amendments require:
1. Proposal with justification for change
2. Review against project principles and constraints
3. Assessment of impact on existing specs and tasks
4. Documentation of rationale and expected benefits
5. Approval before implementation
6. Migration plan for affected code (if breaking change)

### Versioning Policy

- MAJOR: Backward incompatible governance or principle removals
- MINOR: New principle or section added, material expansion
- PATCH: Clarifications, wording fixes, non-semantic refinements
- Version follows semantic versioning: MAJOR.MINOR.PATCH

### Compliance Review

All pull requests and code reviews must verify compliance with:
- Core principles (especially NON-NEGOTIABLE items)
- Tech stack constraints for current phase
- Code style and naming standards
- Error handling and security requirements
- Performance targets for affected components

### Hierarchy

In case of conflict between documents:
1. Constitution (highest authority - this document)
2. Specification (feature-level requirements)
3. Plan (technical approach)
4. Tasks (implementation breakdown)

Constitution supersedes all other practices. If spec or plan conflicts with constitution, constitution wins and the conflict must be resolved by updating the conflicting document.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
