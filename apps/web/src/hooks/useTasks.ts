"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  // Ref to always have latest tasks (avoids stale closures)
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

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

  const createTask = useCallback((title: string, description?: string) => {
    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Optimistic: add to UI immediately
    const tempTask: TaskCardData = {
      id: tempId,
      title,
      description: description ?? null,
      completed: false,
      created_at: now,
      updated_at: now,
      created_by: "user",
      agent_id: null,
    };
    setTasks(prev => [tempTask, ...prev]);
    setError("");

    // Persist in background
    startTransition(async () => {
      try {
        const body: Record<string, string> = { title };
        if (description) body.description = description;
        const res = await apiFetch("/tasks", {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          setTasks(prev => prev.filter(t => t.id !== tempId));
          setError("Failed to create task");
          return;
        }
        const created: Task = await res.json();
        // Replace temp with server-confirmed task
        setTasks(prev => prev.map(t => t.id === tempId ? toCardData(created) : t));
      } catch {
        setTasks(prev => prev.filter(t => t.id !== tempId));
        setError("Failed to create task");
      }
    });
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    // Read current value from ref (avoids stale closure)
    const task = tasksRef.current.find(t => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;

    // Optimistic toggle
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t),
    );

    // Persist immediately (no debounce)
    startTransition(async () => {
      try {
        const res = await apiFetch(`/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify({ completed: newCompleted }),
        });
        if (!res.ok) {
          // Revert
          setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, completed: !newCompleted } : t),
          );
        }
      } catch {
        setTasks(prev =>
          prev.map(t => t.id === taskId ? { ...t, completed: !newCompleted } : t),
        );
      }
    });
  }, []);

  const updateTask = useCallback((taskId: string, data: { title?: string; description?: string }) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, ...data, updated_at: new Date().toISOString() } : t),
    );
    setError("");

    startTransition(async () => {
      try {
        const res = await apiFetch(`/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          await fetchTasks(); // Revert by refetching
          setError("Failed to update task");
          return;
        }
        const updated: Task = await res.json();
        setTasks(prev => prev.map(t => t.id === taskId ? toCardData(updated) : t));
      } catch {
        await fetchTasks();
        setError("Failed to update task");
      }
    });
  }, [fetchTasks]);

  const deleteTask = useCallback((taskId: string) => {
    // Optimistic: remove from UI immediately
    setTasks(prev => prev.filter(t => t.id !== taskId));

    startTransition(async () => {
      try {
        const res = await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) {
          await fetchTasks(); // Revert by refetching
          setError("Failed to delete task");
        }
      } catch {
        await fetchTasks();
        setError("Failed to delete task");
      }
    });
  }, [fetchTasks]);

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
    isPending,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
    highlightTask,
    highlightedTaskId,
  };
}
