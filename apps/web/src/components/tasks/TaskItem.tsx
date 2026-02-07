"use client";

import type { Task } from "@/lib/types/task";
import { DeleteConfirm } from "./DeleteConfirm";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDeleting: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  deleteLoading: boolean;
}

function truncate(text: string | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  isDeleting,
  onDeleteConfirm,
  onDeleteCancel,
  deleteLoading,
}: TaskItemProps) {
  return (
    <div className="flex flex-wrap items-start gap-3 border-b border-zinc-200 py-3 dark:border-zinc-800">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100"
        aria-label={`Mark "${task.title}" as ${task.completed ? "active" : "completed"}`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={
            task.completed
              ? "break-words text-zinc-400 line-through"
              : "break-words text-zinc-900 dark:text-zinc-100"
          }
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 break-words text-sm text-zinc-500 dark:text-zinc-400">
            {truncate(task.description, 100)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isDeleting ? (
          <DeleteConfirm
            onConfirm={onDeleteConfirm}
            onCancel={onDeleteCancel}
            loading={deleteLoading}
          />
        ) : (
          <>
            <button
              onClick={() => onEdit(task)}
              className="min-h-[44px] min-w-[44px] rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="min-h-[44px] px-2 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
