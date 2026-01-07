# sorted

> A todo app that takes your clutter and sort it into todos.

A simple console-based todo application built with Python. This is Phase I of a five-phase evolution.

## Features

- Add tasks with title and optional description
- View all tasks with status indicators
- Mark tasks as complete or incomplete
- Update task details
- Delete tasks with confirmation
- In-memory storage (data lost on exit - expected for Phase I)

## Installation

```bash
# Ensure Python 3.13+ is installed
python --version

# Run the application
python src/main.py
```

## Usage

Once the application is running, use these commands:

| Command | Syntax | Description |
|---------|--------|-------------|
| add | `add "Task Title"` or `add "Task Title" "Description"` | Create a new task |
| list | `list` | Display all tasks |
| complete | `complete <task_id>` | Toggle task completion |
| update | `update <task_id> "New Title"` or `update <task_id> "Title" "Description"` | Modify task |
| delete | `delete <task_id>` | Delete a task |
| help | `help` | Show all commands |
| exit | `exit` or `quit` | Exit the application |

## Examples

```bash
> add "Buy groceries"

Task 1 created successfully!

> list

Your Tasks:
[ ] 1: Buy groceries

> complete 1

Task 1 marked as completed!

> list

Your Tasks:
[✓] 1: Buy groceries

> delete 1

Are you sure you want to delete task 1? (yes/no)
> yes

Task 1 deleted successfully!
```

## Project Structure

```
sorted/
├── src/
│   ├── models/
│   │   └── task.py          # Task dataclass
│   ├── services/
│   │   └── task_service.py  # Task storage and retrieval
│   ├── cli/
│   │   ├── __init__.py
│   │   ├── commands.py       # Command handlers
│   │   └── parser.py        # Command parsing
│   ├── lib/
│   │   └── display.py       # Display utilities
│   └── main.py               # Application entry point
├── tests/
│   ├── unit/
│   └── integration/
└── pyproject.toml            # Python project configuration
```

## Development

Follows KISS principles with clean, readable code. No external dependencies required.

## License

Project for learning and demonstration purposes.
