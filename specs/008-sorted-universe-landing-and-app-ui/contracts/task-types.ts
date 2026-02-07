/**
 * Extended task types for the card-based UI.
 *
 * These extend the existing Task interface from lib/types/task.ts
 * with frontend-only fields for agent attribution and display grouping.
 */

export type TaskCreator = "user" | "agent";
export type TaskGroup = "today" | "upcoming" | "completed";

/**
 * Extended task interface with frontend-only display fields.
 *
 * The base fields (id, title, description, completed, created_at, updated_at)
 * come from the existing backend API. The additional fields are set client-side.
 */
export interface TaskCardData {
  /** UUID from backend */
  id: string;
  /** Task title */
  title: string;
  /** Optional description (truncated to 2 lines in card view) */
  description: string | null;
  /** Completion status from backend */
  completed: boolean;
  /** ISO 8601 creation timestamp from backend */
  created_at: string;
  /** ISO 8601 update timestamp from backend */
  updated_at: string;
  /** Who created this task — "user" for manual, "agent" for Jett-created */
  created_by: TaskCreator;
  /** Agent ID if created by an agent (e.g., "jett"), null for manual */
  agent_id: string | null;
}

/**
 * Grouped tasks for rendering in collapsible sections.
 */
export interface GroupedTasks {
  today: TaskCardData[];
  upcoming: TaskCardData[];
  completed: TaskCardData[];
}

/**
 * Hook return type for useTasks.
 */
export interface UseTasksReturn {
  /** Tasks grouped by section */
  groupedTasks: GroupedTasks;
  /** Whether tasks are loading */
  loading: boolean;
  /** Error message if any */
  error: string;
  /** Create a new task */
  createTask: (title: string, description?: string) => Promise<void>;
  /** Toggle task completion */
  toggleTask: (taskId: string) => void;
  /** Update task details */
  updateTask: (taskId: string, data: { title?: string; description?: string }) => Promise<void>;
  /** Delete a task */
  deleteTask: (taskId: string) => Promise<void>;
  /** Re-fetch tasks from backend */
  refreshTasks: () => Promise<void>;
  /** Scroll to and highlight a specific task (for cross-panel linking) */
  highlightTask: (taskId: string) => void;
}
