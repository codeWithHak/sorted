"""Chat context for the AI agent."""

from dataclasses import dataclass, field


@dataclass
class ChatContext:
    """Shared context passed to agent tools via RunContextWrapper."""

    user_id: str
    thread_id: str
    tasks_modified: bool = False
    modified_tasks: list = field(default_factory=list)
