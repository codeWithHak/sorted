"use client";

import { useState } from "react";
import type { GroupedTasks } from "@/lib/types/task";
import type { AgentActivityState } from "@/lib/types/agent";
import { TaskSection } from "./TaskSection";
import { TaskEmptyState } from "./TaskEmptyState";
import { TaskModal } from "./TaskModal";
import { TaskForm } from "./TaskForm";

interface TaskPanelProps {
  groupedTasks: GroupedTasks;
  loading: boolean;
  error: string;
  agentState: AgentActivityState;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, data: { title?: string; description?: string }) => void;
  onDelete: (taskId: string) => void;
  onCreate: (title: string, description?: string) => void;
  highlightedTaskId: string | null;
}

export function TaskPanel({
  groupedTasks,
  loading,
  error,
  agentState,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  highlightedTaskId,
}: TaskPanelProps) {
  const [showCreate, setShowCreate] = useState(false);
  const totalTasks = groupedTasks.today.length + groupedTasks.upcoming.length + groupedTasks.completed.length;
  const isActing = agentState.status === "acting";

  return (
    <div
      className={`flex h-full flex-col overflow-hidden transition-shadow duration-500 ${
        isActing ? "shadow-[0_0_20px_rgba(5,150,105,0.2)]" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-mono font-semibold text-white/50 uppercase tracking-wider">Tasks</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-emerald-600 px-4 py-1.5 text-xs font-mono font-medium text-white uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-[0_0_12px_rgba(5,150,105,0.2)]"
        >
          New Task
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-2 bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && totalTasks === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : totalTasks === 0 ? (
          <TaskEmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <div className="space-y-2">
            <TaskSection
              title="Today"
              tasks={groupedTasks.today}
              highlightedTaskId={highlightedTaskId}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <TaskSection
              title="Upcoming"
              tasks={groupedTasks.upcoming}
              highlightedTaskId={highlightedTaskId}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <TaskSection
              title="Completed"
              tasks={groupedTasks.completed}
              defaultCollapsed
              highlightedTaskId={highlightedTaskId}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Task"
      >
        <TaskForm
          mode="create"
          onSubmit={(data) => {
            onCreate(data.title, data.description);
            setShowCreate(false);
          }}
          onCancel={() => setShowCreate(false)}
          loading={false}
          error=""
        />
      </TaskModal>
    </div>
  );
}
