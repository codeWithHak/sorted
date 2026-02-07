import type { ChatMessage, ActionCardData } from "@/lib/types/chat";

function uuid(): string {
  return crypto.randomUUID();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface MockResponse {
  content: string;
  actionCard: ActionCardData | null;
}

function generateResponse(userMessage: string): MockResponse {
  const lower = userMessage.toLowerCase();

  if (lower.includes("plan") || lower.includes("morning") || lower.includes("day")) {
    return {
      content: "Here's a plan to get your day started:",
      actionCard: {
        actionType: "created",
        taskCount: 3,
        tasks: [
          { id: uuid(), title: "Review priorities for today" },
          { id: uuid(), title: "Clear inbox to zero" },
          { id: uuid(), title: "Prep for first meeting" },
        ],
      },
    };
  }

  if (lower.includes("add") || lower.includes("create") || lower.includes("new task")) {
    const taskTitle = userMessage.replace(/^(add|create|new task:?\s*)/i, "").trim() || "New task";
    return {
      content: `Done! I've added that for you.`,
      actionCard: {
        actionType: "created",
        taskCount: 1,
        tasks: [{ id: uuid(), title: taskTitle }],
      },
    };
  }

  if (lower.includes("list") || lower.includes("what") || lower.includes("show")) {
    return {
      content: "Here's what you've got on your plate. Check your task panel on the right for the full list!",
      actionCard: null,
    };
  }

  if (lower.includes("complete") || lower.includes("done") || lower.includes("finish")) {
    return {
      content: "Nice work! Keep that momentum going.",
      actionCard: null,
    };
  }

  if (lower.includes("delete") || lower.includes("remove") || lower.includes("clear")) {
    return {
      content: "I can help with that. Select the tasks you want to remove from the task panel.",
      actionCard: null,
    };
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return {
      content: "Hey! Ready to get things sorted. What's on your mind?",
      actionCard: null,
    };
  }

  return {
    content: "Got it. I'll keep that in mind. Anything else you need help with?",
    actionCard: null,
  };
}

export async function getMockJettResponse(userMessage: string): Promise<ChatMessage> {
  await delay(1000 + Math.random() * 1000);

  const response = generateResponse(userMessage);

  return {
    id: uuid(),
    sender: "agent",
    agentId: "jett",
    content: response.content,
    timestamp: new Date().toISOString(),
    actionCard: response.actionCard,
  };
}
