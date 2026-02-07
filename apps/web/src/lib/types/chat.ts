export type MessageSender = "user" | "agent";
export type ActionType = "created" | "updated" | "completed" | "deleted";

export interface ActionTaskRef {
  id: string;
  title: string;
}

export interface ActionCardData {
  actionType: ActionType;
  taskCount: number;
  tasks: ActionTaskRef[];
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  agentId: string | null;
  content: string;
  timestamp: string;
  actionCard: ActionCardData | null;
}
