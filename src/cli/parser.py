"""
Command parser for the sorted todo application.

Parses user input and routes to appropriate command handlers.
"""

from typing import Callable
from src.cli import commands


def parse_command(user_input: str) -> Callable:
    """
    Parse user input and return the appropriate command handler.

    Args:
        user_input: The raw user input string

    Returns:
        The command handler function to execute
    """
    if not user_input or not user_input.strip():
        return commands.handle_help

    parts = user_input.strip().split()
    command = parts[0].lower()
    args = parts[1:]

    if command in ("exit", "quit"):
        return commands.handle_exit

    if command == "add":
        return commands.handle_add

    if command == "list":
        return commands.handle_list

    if command == "complete":
        return commands.handle_complete

    if command == "update":
        return commands.handle_update

    if command == "delete":
        return commands.handle_delete

    if command == "help":
        return commands.handle_help

    return commands.handle_unknown
