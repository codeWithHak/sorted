"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api-client";
import type { Task, TaskListResponse, TaskCardData, GroupedTasks } from "@/lib/types/task";

function toCardData(task: Task): TaskCardData {
  return {
    ...task,
    created_by: "user",
    agent_id: null,
  };
}

function groupTasks(tasks: TaskCardData[]): GroupedTasks {
  const today: TaskCardData[] = [];
  const upcoming: TaskCardData[] = [];
  const completed: TaskCardData[] = [];

  for (const task of tasks) {
    if (task.completed) {
      completed.push(task);
    } else {
      today.push(task);
    }
  }

  return { today, upcoming, completed };
}

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const toggleTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/tasks?per_page=100");
      if (!res.ok) throw new Error("Failed to load tasks");
      const data: TaskListResponse = await res.json();
      setTasks(data.data.map(toCardData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchTasks();
  }, [userId, fetchTasks]);

  const createTask = useCallback(async (title: string, description?: string) => {
    const body: Record<string, string> = { title };
    if (description) body.description = description;

    const res = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create task");
    await fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );

    const existing = toggleTimers.current.get(taskId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      toggleTimers.current.delete(taskId);
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        const res = await apiFetch(`/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify({ completed: !task.completed }),
        });
        if (!res.ok) {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          );
        }
      } catch {
        await fetchTasks();
      }
    }, 300);
    toggleTimers.current.set(taskId, timer);
  }, [tasks, fetchTasks]);

  const updateTask = useCallback(async (taskId: string, data: { title?: string; description?: string }) => {
    const res = await apiFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task");
    await fetchTasks();
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    const res = await apiFetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete task");
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const highlightTask = useCallback((taskId: string) => {
    setHighlightedTaskId(taskId);
    setTimeout(() => setHighlightedTaskId(null), 2000);

    const el = document.getElementById(`task-${taskId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return {
    groupedTasks: groupTasks(tasks),
    loading,
    error,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
    highlightTask,
    highlightedTaskId,
  };
}
