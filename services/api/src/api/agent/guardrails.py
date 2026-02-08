"""Input and output guardrails for the Jett agent."""

import logging
import re

from agents import (
    GuardrailFunctionOutput,
    RunContextWrapper,
    input_guardrail,
    output_guardrail,
)

from src.api.agent.context import ChatContext

logger = logging.getLogger(__name__)

# Patterns that suggest prompt injection attempts
_INJECTION_PATTERNS = [
    r"ignore\s+(previous|above|all)\s+(instructions|prompts)",
    r"you\s+are\s+now\s+",
    r"system\s*:\s*",
    r"<\s*system\s*>",
    r"pretend\s+you\s+are",
    r"forget\s+(everything|your\s+instructions)",
    r"new\s+instructions?\s*:",
]
_INJECTION_RE = re.compile("|".join(_INJECTION_PATTERNS), re.IGNORECASE)


@input_guardrail
async def check_prompt_injection(
    ctx: RunContextWrapper[ChatContext],
    agent,
    input_data,
) -> GuardrailFunctionOutput:
    """Detect potential prompt injection attempts."""
    # Extract the last user message
    if isinstance(input_data, list):
        user_messages = [m for m in input_data if isinstance(m, dict) and m.get("role") == "user"]
        text = user_messages[-1].get("content", "") if user_messages else ""
    elif isinstance(input_data, str):
        text = input_data
    else:
        text = str(input_data)

    if _INJECTION_RE.search(text):
        logger.warning(f"Potential prompt injection detected for user {ctx.context.user_id}")
        return GuardrailFunctionOutput(
            output_info="Potential prompt injection detected",
            tripwire_triggered=True,
        )

    return GuardrailFunctionOutput(
        output_info="Input appears safe",
        tripwire_triggered=False,
    )


@output_guardrail
async def check_claimed_actions(
    ctx: RunContextWrapper[ChatContext],
    agent,
    output,
) -> GuardrailFunctionOutput:
    """Verify the agent doesn't claim actions it didn't perform."""
    if not isinstance(output, str):
        output = str(output)

    output_lower = output.lower()

    # Check for false claims about task operations
    action_claims = [
        ("created", ["i created", "i've created", "i added", "i've added", "done! i created"]),
        ("completed", ["i completed", "i've completed", "i marked", "i've marked"]),
        ("deleted", ["i deleted", "i've deleted", "i removed", "i've removed"]),
        ("updated", ["i updated", "i've updated", "i renamed", "i've renamed"]),
    ]

    for action_type, phrases in action_claims:
        for phrase in phrases:
            if phrase in output_lower:
                # Check if the action was actually performed
                actual_actions = [a[0] for a in ctx.context.modified_tasks]
                if action_type not in actual_actions:
                    logger.warning(
                        f"Agent claimed '{action_type}' but modified_tasks={ctx.context.modified_tasks}"
                    )
                    return GuardrailFunctionOutput(
                        output_info=f"Agent claimed '{action_type}' without performing it",
                        tripwire_triggered=True,
                    )

    return GuardrailFunctionOutput(
        output_info="Output consistent with actual actions",
        tripwire_triggered=False,
    )
