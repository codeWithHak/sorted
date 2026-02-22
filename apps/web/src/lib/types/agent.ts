export type AgentStatus = "active" | "coming_soon";

export interface AgentAbility {
  name: string;
  description: string;
  icon: string;
}

export interface AgentLore {
  origin: string;
  abilities: AgentAbility[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  accentColor: string;
  status: AgentStatus;
  tagline: string;
  lore: AgentLore | null;
  portrait?: string;
}

export type AgentActivityStatus = "idle" | "thinking" | "acting";

export interface AgentActivityState {
  status: AgentActivityStatus;
  activeAgentId: string | null;
  pendingTaskIds: string[];
}
