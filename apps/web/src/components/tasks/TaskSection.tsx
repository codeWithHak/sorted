"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import type { TaskCardData } from "@/lib/types/task";
import { TaskCard } from "./TaskCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TaskSectionProps {
  title: string;
  tasks: TaskCardData[];
  defaultCollapsed?: boolean;
  highlightedTaskId: string | null;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, data: { title?: string; description?: string }) => void;
  onDelete: (taskId: string) => void;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

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
  const prefersReduced = useReducedMotion();

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

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="space-y-2 pb-4"
            variants={prefersReduced ? undefined : containerVariants}
            initial={prefersReduced ? undefined : "hidden"}
            animate={prefersReduced ? undefined : "visible"}
            exit={prefersReduced ? undefined : { opacity: 0 }}
          >
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  isHighlighted={highlightedTaskId === task.id}
                  onToggle={() => onToggle(task.id)}
                  onEdit={(data) => onEdit(task.id, data)}
                  onDelete={() => onDelete(task.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
