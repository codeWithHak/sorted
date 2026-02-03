# Tasks: Console Todo App

**Input**: Design documents from `/specs/001-console-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, quickstart.md

**Tests**: Tests are optional for this feature and have NOT been explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create project structure per implementation plan
- [x] T002 [P] Initialize Python 3.13+ project with UV package manager in pyproject.toml
- [x] T003 [P] Create src/ directory structure: models/, services/, cli/, lib/
- [x] T004 [P] Create tests/ directory structure: unit/, integration/
- [x] T005 [P] Create __init__.py files in src/models/, src/services/, src/cli/, src/lib/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Task dataclass in src/models/task.py with id, title, description, completed attributes
- [x] T007 Create in-memory task storage with global tasks list and next_id counter in src/services/task_service.py
- [x] T008 Create task storage functions (create, get, update, delete, toggle_complete) in src/services/task_service.py
- [x] T009 Create command parser with subcommand routing in src/cli/parser.py
- [x] T010 Create display utilities for formatted task list output in src/lib/display.py
- [x] T011 Create application entry point with main loop in src/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Task (Priority: P1) 🎯 MVP

**Goal**: Users can create new tasks with title and optional description

**Independent Test**: Can be fully tested by running application, executing add command with valid input, and verifying task appears in list

### Implementation for User Story 1

- [x] T012 [US1] Create create_task function in src/services/task_service.py
- [x] T013 [US1] Create handle_add command in src/cli/commands.py
- [x] T014 [US1] Add title validation (not empty/whitespace) in handle_add
- [x] T015 [US1] Integrate add command with parser routing in src/cli/parser.py

**Checkpoint**: Users can create tasks - MVP core functionality delivered

---

## Phase 4: User Story 2 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Users can display all tasks with ID, title, status, description in readable format

**Independent Test**: Can be fully tested by adding multiple tasks, running list command, and verifying all tasks display with correct attributes

### Implementation for User Story 2

- [x] T016 [US2] Create list_tasks function in src/services/task_service.py
- [x] T017 [US2] Create handle_list command in src/cli/commands.py
- [x] T018 [US2] Create format_task display function in src/lib/display.py
- [x] T019 [US2] Add status indicators ([✓] for completed, [ ] for pending) in display
- [x] T020 [US2] Handle empty list case with appropriate message

**Checkpoint**: Users can view all tasks - combined with Add Task, core MVP complete

---

## Phase 5: User Story 6 - Help Display (Priority: P1) 🎯 MVP

**Goal**: Users can see all available commands and their usage syntax

**Independent Test**: Can be fully tested by running application and entering help command, verifying all commands and their syntax display

### Implementation for User Story 6

- [x] T021 [US6] Create handle_help command in src/cli/commands.py
- [x] T022 [US6] Display all commands with usage examples
- [x] T023 [US6] Add help suggestion to invalid command error messages

**Checkpoint**: New users can discover available functionality

---

## Phase 6: User Story 3 - Mark as Complete (Priority: P2)

**Goal**: Users can toggle task completion status between pending and completed

**Independent Test**: Can be fully tested by adding a task, marking it complete, running list command, and verifying status changed

### Implementation for User Story 3

- [x] T024 [US3] Create toggle_complete function in src/services/task_service.py
- [x] T025 [US3] Create handle_complete command in src/cli/commands.py
- [x] T026 [US3] Add task ID existence check in handle_complete
- [x] T027 [US3] Update display to reflect status change

**Checkpoint**: Users can track task completion progress

---

## Phase 7: User Story 4 - Update Task (Priority: P3)

**Goal**: Users can modify task title and/or description by referencing task ID

**Independent Test**: Can be fully tested by adding a task, updating it with new values, running list command, and verifying changes applied

### Implementation for User Story 4

- [x] T028 [US4] Create update_task function in src/services/task_service.py
- [x] T029 [US4] Create handle_update command in src/cli/commands.py
- [x] T030 [US4] Add parsing for title and optional description parameters
- [x] T031 [US4] Add task ID existence check in handle_update

**Checkpoint**: Users can correct mistakes or add details to existing tasks

---

## Phase 8: User Story 5 - Delete Task (Priority: P3)

**Goal**: Users can remove tasks from list by ID with confirmation prompt

**Independent Test**: Can be fully tested by adding tasks, deleting one, running list command, and verifying deleted task no longer appears

### Implementation for User Story 5

- [x] T032 [US5] Create delete_task function in src/services/task_service.py
- [x] T033 [US5] Create handle_delete command in src/cli/commands.py
- [x] T034 [US5] Add user confirmation prompt (yes/no) before deletion
- [x] T035 [US5] Add task ID existence check in handle_delete

**Checkpoint**: Users can remove unwanted tasks with confirmation safety

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T036 [P] Create README.md with installation, usage, and project structure documentation
- [x] T037 [P] Add descriptive docstrings to all public functions in src/services/task_service.py
- [x] T038 [P] Add descriptive docstrings to all command handlers in src/cli/commands.py
- [x] T039 [P] Add descriptive docstrings to utility functions in src/lib/display.py
- [x] T040 [P] Add descriptive docstrings to Task dataclass in src/models/task.py
- [x] T041 [P] Ensure all command error messages are user-friendly and suggest help
- [x] T042 [P] Verify all functions follow KISS principle (simple, readable code)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 6 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational - May integrate with T015-T014
- **User Story 4 (P3)**: Can start after Foundational - May integrate with T015-T014
- **User Story 5 (P3)**: Can start after Foundational - May integrate with T015-T014

### Within Each User Story

- Services before commands
- Commands before parser integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel: T001, T002, T003, T004, T005
- All Foundational tasks marked [P] can run in parallel after Setup: T006, T007, T008, T009, T010, T011
- User Story 1 tasks can run in parallel: T012, T013, T014, T015
- User Story 2 tasks can run in parallel: T016, T017, T018, T019, T020
- User Story 6 tasks can run in parallel: T021, T022, T023
- After Foundational, User Stories 1, 2, 6 can run in parallel
- Polish tasks marked [P] can run in parallel: T036, T037, T038, T039, T040, T041, T042

---

## Parallel Example: Setup Phase

```bash
# Launch all setup tasks together:
Task: "Initialize Python 3.13+ project with UV package manager in pyproject.toml"
Task: "Create src/ directory structure: models/, services/, cli/, lib/"
Task: "Create tests/ directory structure: unit/, integration/"
Task: "Create __init__.py files"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - Add Task
4. Complete Phase 4: User Story 2 - View Task List
5. Complete Phase 5: User Story 6 - Help Display
6. **STOP and VALIDATE**: Test Add Task, View List, Help functionality
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP increment 1 (Add Task)
3. Add User Story 2 → Test independently → MVP increment 2 (View List)
4. Add User Story 6 → Test independently → MVP increment 3 (Help)
5. Add User Story 3 → Test independently → Feature expansion (Mark Complete)
6. Add User Story 4 → Test independently → Feature expansion (Update)
7. Add User Story 5 → Test independently → Feature expansion (Delete)
8. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify after each task or logical group
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are optional for this feature - only add if explicitly requested
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
