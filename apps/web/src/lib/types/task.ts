export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export type TaskFilter = "all" | "active" | "completed";
