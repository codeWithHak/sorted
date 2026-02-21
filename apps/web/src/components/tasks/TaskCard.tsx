"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { TaskCardData } from "@/lib/types/task";
import { TaskCheckbox } from "./TaskCheckbox";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  isNewFromAgent = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const prefersReduced = useReducedMotion();

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
      <div className="border border-white/10 bg-white/[0.03] p-4">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-600 transition-colors"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="mt-2 w-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-600 transition-colors"
          rows={2}
          placeholder="Description (optional)"
        />
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={editTitle.trim().length === 0}
            className="bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const cardContent = (
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
              ? "text-white/20 line-through"
              : "text-white"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/40">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
          {task.created_by === "agent" && task.agent_id && (
            <span className="flex items-center gap-1">
              <span className="text-amber-500">&#9733;</span>
              Added by Jett
            </span>
          )}
          <span>{timeAgo(task.created_at)}</span>
        </div>
      </div>
      <div className={`flex gap-1 transition-opacity ${confirmDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-white/20 hover:bg-white/10 hover:text-white/60 focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors"
          aria-label={`Edit "${task.title}"`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              className="bg-red-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-0.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1 text-white/20 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors"
            aria-label={`Delete "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  if (isNewFromAgent && !prefersReduced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, backgroundColor: "rgba(5, 150, 105, 0.1)" }}
        animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
        transition={{ duration: 0.3, ease: "easeOut", backgroundColor: { duration: 0.5, delay: 0.3 } }}
        className={`group relative border bg-white/[0.02] p-4 transition-[transform,border-color] duration-200 hover:-translate-y-px hover:border-white/20 ${
          isHighlighted ? "border-emerald-600/40" : "border-white/10"
        }`}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div
      className={`group relative border bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-px hover:border-white/20 ${
        isHighlighted
          ? "border-emerald-600/40 bg-emerald-600/5"
          : "border-white/10"
      }`}
    >
      {cardContent}
    </div>
  );
}
