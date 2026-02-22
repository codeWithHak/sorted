import type { Agent } from "@/lib/types/agent";

export const agents: Agent[] = [
  {
    id: "jett",
    name: "Jett",
    role: "Task Agent",
    accentColor: "emerald",
    status: "active",
    tagline: "You speak chaos. Jett returns order.",
    lore: {
      origin:
        "Built to cut through the noise. In a world of endless to-do lists, overflowing inboxes, and scattered notes, Jett emerged as the first agent of the Sorted Universe. Jett doesn't just manage tasks — Jett understands intent. You speak in fragments, half-thoughts, and raw ideas. Jett listens, structures, and acts. No prompts. No forms. Just conversation turned into clarity.",
      abilities: [
        {
          name: "Task Capture",
          description:
            "Extracts actionable tasks from natural conversation. Say 'plan my morning' and Jett breaks it into concrete steps.",
          icon: "📋",
        },
        {
          name: "Priority Sense",
          description:
            "Understands urgency from context. Deadlines, keywords, and tone all factor into how Jett orders your day.",
          icon: "⚡",
        },
        {
          name: "Batch Processing",
          description:
            "Creates, completes, or reorganizes multiple tasks in a single action. Efficiency at scale.",
          icon: "🔄",
        },
        {
          name: "Context Memory",
          description:
            "Remembers your patterns and preferences. The more you use Jett, the better Jett gets at anticipating your needs.",
          icon: "🧠",
        },
      ],
    },
  },
  {
    id: "aria",
    name: "Aria",
    role: "Calendar Agent",
    accentColor: "sky",
    status: "coming_soon",
    tagline: "Time bends to your will.",
    lore: null,
  },
  {
    id: "flux",
    name: "Flux",
    role: "Notes Agent",
    accentColor: "violet",
    status: "coming_soon",
    tagline: "Thoughts captured before they fade.",
    lore: null,
  },
  {
    id: "pulse",
    name: "Pulse",
    role: "Habits Agent",
    accentColor: "emerald",
    status: "coming_soon",
    tagline: "Small steps. Big change.",
    lore: null,
  },
];
