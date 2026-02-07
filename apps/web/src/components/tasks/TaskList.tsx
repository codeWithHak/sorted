"use client";

import type { Task } from "@/lib/types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  deletingTaskId: string | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  deleteLoading: boolean;
}

export function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  deletingTaskId,
  onDeleteConfirm,
  onDeleteCancel,
  deleteLoading,
}: TaskListProps) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={task.id === deletingTaskId}
          onDeleteConfirm={onDeleteConfirm}
          onDeleteCancel={onDeleteCancel}
          deleteLoading={deleteLoading}
        />
      ))}
    </div>
  );
}
