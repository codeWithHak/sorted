"""
Main entry point for the sorted todo application.

A console-based todo application that takes your clutter
and sorts it into todos.
"""

from src.cli import parser


def main() -> None:
    """
    Run the main application loop.

    Continuously prompts user for commands and executes them
    until the user types 'exit' or 'quit'.
    """
    print("\n=== sorted ===")
    print("A todo app that takes your clutter and sort it into todos")
    print("Type 'help' for available commands.\n")

    while True:
        try:
            user_input = input("> ")
            command_handler = parser.parse_command(user_input)
            command_handler(user_input)
        except KeyboardInterrupt:
            print("\n\nExiting sorted. Goodbye!")
            break


if __name__ == "__main__":
    main()
