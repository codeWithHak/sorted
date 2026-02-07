/**
 * Agent types for the Sorted Universe agent roster and lore system.
 *
 * Only Jett is active in this phase. Other agents are visual placeholders
 * with "coming_soon" status shown as greyed silhouettes in the sidebar.
 */

export type AgentStatus = "active" | "coming_soon";

export interface AgentAbility {
  /** Ability name displayed in character sheet (e.g., "Task Capture") */
  name: string;
  /** Description of what the ability does */
  description: string;
  /** Icon identifier — emoji or Lucide icon name */
  icon: string;
}

export interface AgentLore {
  /** Origin narrative in markdown format */
  origin: string;
  /** Abilities displayed as character sheet entries */
  abilities: AgentAbility[];
}

export interface Agent {
  /** Unique identifier (e.g., "jett", "aria", "flux") */
  id: string;
  /** Display name */
  name: string;
  /** Short role description (e.g., "Task Agent") */
  role: string;
  /** Tailwind color name for accent (e.g., "amber") */
  accentColor: string;
  /** Whether the agent is functional or a placeholder */
  status: AgentStatus;
  /** One-line tagline */
  tagline: string;
  /** Full lore content — only populated for active agents */
  lore: AgentLore | null;
}

/**
 * Agent activity state for driving the animation system.
 */
export type AgentActivityStatus = "idle" | "thinking" | "acting";

export interface AgentActivityState {
  /** Current agent activity level */
  status: AgentActivityStatus;
  /** Which agent is currently active (null when idle) */
  activeAgentId: string | null;
  /** Task IDs being created/modified — drives batch animation stagger */
  pendingTaskIds: string[];
}
