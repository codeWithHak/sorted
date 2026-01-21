---
id: "0001"
title: "Create Project Restructure Specification"
stage: spec
date: 2026-01-20
surface: agent
model: claude-opus-4-5-20251101
feature: 003-project-restructure
branch: 003-project-restructure
user: hak
command: /sp.specify
labels: ["restructure", "monorepo", "phase2", "cleanup"]
links:
  spec: specs/003-project-restructure/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-project-restructure/spec.md
  - specs/003-project-restructure/checklists/requirements.md
tests:
  - null
---

## Prompt

/sp.specify 003-project-restructure

The sorted project requires restructuring to cleanly separate Phase 1 (CLI application) from Phase 2 (web application) while establishing a maintainable monorepo foundation. The current state mixes CLI artifacts at the repository root (src/, tests/, CLI-focused pyproject.toml) alongside the nascent web structure (apps/web/, services/api/), creating confusion about which code belongs to which phase and making it difficult to run, test, or deploy either application independently. This restructuring enables the team to focus on web development in Phase 2 without legacy CLI code interfering with the build process, dependency management, or mental model of the codebase.

The restructuring scope includes: removing the root-level src/ directory containing CLI application code; removing the root-level tests/ directory containing CLI tests; updating the root pyproject.toml to serve as a workspace coordinator rather than a CLI application definition; and verifying that the existing apps/web/ (Next.js) and services/api/ (FastAPI) directories remain functional. Explicitly out of scope: modifying any code within the web or API applications themselves, changing the 001-console-app branch where CLI code is preserved, altering the .specify/, specs/, or history/ directories which are shared project artifacts, and introducing any new features or dependencies. The CLI application remains fully accessible by checking out the 001-console-app branch; no CLI functionality is lost, only relocated to its dedicated branch.

The restructuring must satisfy the following requirements: the 002-web-scaffold branch (and subsequently main after merge) contains zero CLI-specific Python source files at the repository root; the root pyproject.toml either becomes a minimal workspace manifest or is removed entirely if unnecessary for the web stack; running npm run dev in apps/web/ continues to start the Next.js development server on port 3000; running uvicorn or equivalent in services/api/ continues to start the FastAPI server on port 8000; all SpecKit Plus artifacts (.specify/, specs/, history/) remain unchanged and functional; and git history is preserved (no rebase or force-push that destroys commit history). The .venv/ directory at root may be removed or retained as a shared Python environment for the API service—this is a minor decision to be made during implementation.

Acceptance criteria are as follows: after restructuring, ls at repository root shows no src/ or tests/ directories; pyproject.toml at root contains no CLI entry points, no CLI-specific dependencies, and either coordinates the monorepo workspace or is absent; git log shows the restructuring as additive commits (deletions tracked, not rewritten); apps/web/ passes npm run build without errors; services/api/ passes uvicorn services.api.src.api.main:app or equivalent startup without import errors; and checking out 001-console-app branch still yields a working CLI application with python -m src.main or equivalent. The restructuring is complete when the main branch represents a clean Phase 2 web project that a new developer could clone and understand without encountering orphaned CLI code.

## Response snapshot

Created feature branch `003-project-restructure` and comprehensive specification at `specs/003-project-restructure/spec.md`. The spec includes:

- 5 prioritized user stories (P1: clean project structure, frontend works, backend works; P2: CLI preserved, git history)
- 11 testable functional requirements (FR-001 through FR-011)
- 7 measurable success criteria
- Clear scope boundaries (in/out of scope)
- Edge cases and assumptions documented

Quality checklist created at `specs/003-project-restructure/checklists/requirements.md` - all items passed validation. No clarifications needed; spec is ready for `/sp.plan`.

## Outcome

- Impact: Created complete specification for project restructuring to enable Phase 2 web development
- Tests: N/A (specification phase)
- Files: 2 files created (spec.md, requirements.md checklist)
- Next prompts: /sp.clarify (optional) or /sp.plan to create implementation plan
- Reflection: User provided comprehensive requirements upfront, enabling complete spec without clarification questions

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Quality checklist PASSED (all items checked)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
