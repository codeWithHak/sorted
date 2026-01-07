# Quickstart: Console Todo App

**Feature**: Console Todo App (Phase I)
**Date**: 2025-12-07

## Prerequisites

- Python 3.13+ installed
- UV package manager installed
- Git installed
- Basic familiarity with command-line interface

## Installation

```bash
# Clone repository (if not already done)
cd sorted

# Ensure on correct branch
git checkout 001-console-app

# Install dependencies using UV
uv pip install -e .

# Or install specific packages for development
uv pip install pytest black ruff
```

## Running the Application

```bash
# Run the main application
python src/main.py

# Or using UV run
uv run python src/main.py
```

## Available Commands

Once the application is running, use these commands:

| Command | Syntax | Description |
|---------|--------|-------------|
| add | `add "Task Title"` or `add "Task Title" "Description"` | Create a new task |
| list | `list` | Display all tasks |
| complete | `complete <task_id>` | Toggle task completion status |
| update | `update <task_id> "New Title"` or `update <task_id> "New Title" "New Description"` | Modify task details |
| delete | `delete <task_id>` | Remove a task (with confirmation) |
| help | `help` | Display all commands and usage |
| exit | `exit` or `quit` | Exit the application |

## Examples

```bash
# Add a task with just title
add "Buy groceries"

# Add a task with title and description
add "Call mom" "Ask about weekend plans"

# View all tasks
list

# Mark task 1 as complete
complete 1

# Update task 1
update 1 "Buy groceries and milk"

# Delete task 2
delete 2

# Get help
help
```

## Project Structure

```
sorted/
├── src/
│   ├── main.py          # Application entry point
│   ├── models.py         # Task dataclass and storage
│   ├── commands.py       # Command handlers
│   └── utils.py          # Helper functions
├── tests/
│   ├── test_models.py     # Task model tests
│   ├── test_commands.py   # Command handler tests
│   └── test_integration.py # Integration tests
├── pyproject.toml        # UV/Python project config
└── README.md              # Project documentation
```

## Testing

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_models.py
```

## Development Workflow

1. Make changes to source code
2. Run tests to verify: `pytest tests/`
3. Run application to test manually: `python src/main.py`
4. Format code: `ruff format src/`
5. Lint code: `ruff check src/`

## Notes

- **Data Persistence**: All tasks are stored in memory and are lost when application exits (expected for Phase I).
- **Task IDs**: Sequential integers starting from 1, auto-incremented for each new task.
- **Status Indicators**: Tasks show as `[✓]` for completed or `[ ]` for pending in list view.
- **Confirmation**: Delete operations require user confirmation (yes/no) to prevent accidental deletions.
