"use client";

import { useState } from "react";
import type { TaskCardData } from "@/lib/types/task";
import { TaskCard } from "./TaskCard";

interface TaskSectionProps {
  title: string;
  tasks: TaskCardData[];
  defaultCollapsed?: boolean;
  highlightedTaskId: string | null;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, data: { title?: string; description?: string }) => void;
  onDelete: (taskId: string) => void;
}

export function TaskSection({
  title,
  tasks,
  defaultCollapsed = false,
  highlightedTaskId,
  onToggle,
  onEdit,
  onDelete,
}: TaskSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (tasks.length === 0) return null;

  return (
    <div className={title === "Completed" ? "opacity-60" : ""}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
        aria-expanded={!collapsed}
      >
        <svg
          className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-90"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {title}
        <span className="text-xs font-normal text-stone-400">({tasks.length})</span>
      </button>

      {!collapsed && (
        <div className="space-y-2 pb-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isHighlighted={highlightedTaskId === task.id}
              onToggle={() => onToggle(task.id)}
              onEdit={(data) => onEdit(task.id, data)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
