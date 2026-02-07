/**
 * Chat message types for the Jett conversation panel.
 *
 * These types define the contract for chat UI rendering and localStorage persistence.
 * When Phase III connects a real AI backend, these types will serve as the response contract.
 */

export type MessageSender = "user" | "agent";
export type ActionType = "created" | "updated" | "completed" | "deleted";

export interface ActionTaskRef {
  /** Task ID matching the backend task.id (UUID) */
  id: string;
  /** Task title for display in action card */
  title: string;
}

export interface ActionCardData {
  /** What action Jett performed */
  actionType: ActionType;
  /** Number of tasks affected */
  taskCount: number;
  /** List of affected tasks with IDs for cross-panel linking */
  tasks: ActionTaskRef[];
}

export interface ChatMessage {
  /** Client-generated UUID */
  id: string;
  /** Who sent the message */
  sender: MessageSender;
  /** Agent identifier — null for user messages, "jett" for Jett */
  agentId: string | null;
  /** Message text content */
  content: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Inline action summary, if Jett performed actions */
  actionCard: ActionCardData | null;
}

/**
 * Chat storage contract — structure persisted in localStorage.
 */
export interface ChatStorage {
  /** User ID the chat belongs to */
  userId: string;
  /** Ordered list of messages (oldest first) */
  messages: ChatMessage[];
  /** ISO 8601 timestamp of last update */
  lastUpdated: string;
}

/**
 * Hook return type for useChat.
 */
export interface UseChatReturn {
  /** All messages in the conversation */
  messages: ChatMessage[];
  /** Send a user message and get a mock Jett response */
  sendMessage: (content: string) => Promise<void>;
  /** Whether Jett is currently "processing" */
  isThinking: boolean;
  /** Clear all chat history */
  clearHistory: () => void;
}
