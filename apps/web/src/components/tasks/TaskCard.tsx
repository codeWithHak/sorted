"use client";

import { useState } from "react";
import type { TaskCardData } from "@/lib/types/task";
import { TaskCheckbox } from "./TaskCheckbox";

interface TaskCardProps {
  task: TaskCardData;
  isHighlighted?: boolean;
  isNewFromAgent?: boolean;
  onToggle: () => void;
  onEdit: (data: { title?: string; description?: string }) => void;
  onDelete: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TaskCard({
  task,
  isHighlighted = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? "");

  function handleSave() {
    if (editTitle.trim().length === 0) return;
    onEdit({ title: editTitle.trim(), description: editDesc.trim() || undefined });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditTitle(task.title);
    setEditDesc(task.description ?? "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-4" style={{ boxShadow: "var(--shadow-warm)" }}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-500"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="mt-2 w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-500"
          rows={2}
          placeholder="Description (optional)"
        />
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-md px-3 py-1 text-sm text-stone-500 hover:text-stone-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={editTitle.trim().length === 0}
            className="rounded-md bg-stone-900 px-3 py-1 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-px hover:border-stone-300 ${
        isHighlighted
          ? "border-amber-300 bg-amber-50"
          : "border-stone-200"
      }`}
      style={{ boxShadow: "var(--shadow-warm)" }}
    >
      <div className="flex items-start gap-3">
        <TaskCheckbox
          checked={task.completed}
          onChange={onToggle}
          ariaLabel={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`font-medium transition-all duration-200 ${
              task.completed
                ? "text-stone-400 line-through"
                : "text-stone-900"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-stone-500">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-stone-400">
            {task.created_by === "agent" && task.agent_id && (
              <span className="flex items-center gap-1">
                <span className="text-amber-500">&#9733;</span>
                Added by Jett
              </span>
            )}
            <span>{timeAgo(task.created_at)}</span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            aria-label={`Edit "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="rounded-md p-1 text-stone-400 hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-amber-500"
            aria-label={`Delete "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
