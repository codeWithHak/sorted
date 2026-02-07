"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import type { Task, TaskCreateInput, TaskListResponse, TaskFilter } from "@/lib/types/task";
import { FilterBar } from "@/components/tasks/FilterBar";
import { TaskList } from "@/components/tasks/TaskList";
import { EmptyState } from "@/components/tasks/EmptyState";
import { Pagination } from "@/components/tasks/Pagination";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // API data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // UI state
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete state
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toggle debounce refs
  const toggleTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Error auto-dismiss
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // Handle 401
  const handle401 = useCallback(async () => {
    await signOut();
    router.push("/auth/signin");
  }, [router]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let url = `/tasks?page=${page}&per_page=20`;
      if (filter === "active") url += "&completed=false";
      else if (filter === "completed") url += "&completed=true";

      const res = await apiFetch(url);

      if (res.status === 401) {
        await handle401();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load tasks. Please try again.");
      }

      const data: TaskListResponse = await res.json();
      setTasks(data.data);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (err instanceof Error && err.message.includes("authentication")) {
        await handle401();
        return;
      }
      setError(err instanceof Error ? err.message : "Unable to connect. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [page, filter, handle401]);

  useEffect(() => {
    if (!session?.user) return;
    fetchTasks();
  }, [session?.user, fetchTasks]);

  // Reset page when filter changes — clear tasks for instant feedback
  function handleFilterChange(newFilter: TaskFilter) {
    setTasks([]);
    setFilter(newFilter);
    setPage(1);
  }

  // Create task (US2)
  async function handleCreate(data: TaskCreateInput) {
    setModalLoading(true);
    setModalError("");

    try {
      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        await handle401();
        return;
      }

      if (res.status === 422) {
        const errorData = await res.json();
        const messages = errorData.detail?.map((d: { msg: string }) => d.msg).join(", ");
        setModalError(messages || "Validation error");
        return;
      }

      if (!res.ok) {
        setModalError("Something went wrong. Please try again.");
        return;
      }

      setModalMode(null);
      setModalError("");
      await fetchTasks();
    } catch {
      setModalError("Unable to connect. Check your connection.");
    } finally {
      setModalLoading(false);
    }
  }

  // Toggle completion (US3)
  function handleToggle(taskId: string) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );

    // Clear existing debounce timer for this task
    const existing = toggleTimers.current.get(taskId);
    if (existing) clearTimeout(existing);

    // Get the new value after optimistic flip
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;

    // Debounce the API call
    const timer = setTimeout(async () => {
      toggleTimers.current.delete(taskId);

      try {
        const res = await apiFetch(`/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify({ completed: newCompleted }),
        });

        if (res.status === 401) {
          await handle401();
          return;
        }

        if (!res.ok) {
          // Revert on failure
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, completed: !newCompleted } : t,
            ),
          );
          setError("Failed to update task. Please try again.");
        }
      } catch {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, completed: !newCompleted } : t,
          ),
        );
        setError("Unable to connect. Check your connection.");
      }
    }, 300);

    toggleTimers.current.set(taskId, timer);
  }

  // Edit task (US4)
  function handleEditOpen(task: Task) {
    setEditingTask(task);
    setModalMode("edit");
    setModalError("");
  }

  async function handleUpdate(data: TaskCreateInput) {
    if (!editingTask) return;

    setModalLoading(true);
    setModalError("");

    try {
      const res = await apiFetch(`/tasks/${editingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        await handle401();
        return;
      }

      if (res.status === 422) {
        const errorData = await res.json();
        const messages = errorData.detail?.map((d: { msg: string }) => d.msg).join(", ");
        setModalError(messages || "Validation error");
        return;
      }

      if (!res.ok) {
        setModalError("Something went wrong. Please try again.");
        return;
      }

      setModalMode(null);
      setEditingTask(null);
      setModalError("");
      await fetchTasks();
    } catch {
      setModalError("Unable to connect. Check your connection.");
    } finally {
      setModalLoading(false);
    }
  }

  // Delete task (US5)
  function handleDeleteInit(taskId: string) {
    setDeletingTaskId(taskId);
  }

  function handleDeleteCancel() {
    setDeletingTaskId(null);
  }

  async function handleDeleteConfirm() {
    if (!deletingTaskId) return;

    setDeleteLoading(true);

    try {
      const res = await apiFetch(`/tasks/${deletingTaskId}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        await handle401();
        return;
      }

      if (!res.ok && res.status !== 204) {
        setError("Failed to delete task. Please try again.");
        setDeletingTaskId(null);
        return;
      }

      // Remove from local state
      const remainingTasks = tasks.filter((t) => t.id !== deletingTaskId);
      setDeletingTaskId(null);

      // If current page is now empty and we're not on page 1, go back
      if (remainingTasks.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchTasks();
      }
    } catch {
      setError("Unable to connect. Check your connection.");
      setDeletingTaskId(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Close modal
  function handleModalClose() {
    setModalMode(null);
    setEditingTask(null);
    setModalError("");
  }

  if (isPending) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:px-8">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:px-8">
      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header with filter and new task button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar filter={filter} onFilterChange={handleFilterChange} disabled={loading} />
        <button
          onClick={() => {
            setModalMode("create");
            setModalError("");
          }}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New Task
        </button>
      </div>

      {/* Task list with loading states */}
      {loading && tasks.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : tasks.length === 0 && !loading ? (
        <EmptyState
          onCreateClick={() => {
            setModalMode("create");
            setModalError("");
          }}
        />
      ) : tasks.length > 0 ? (
        <div className={loading ? "pointer-events-none opacity-50 transition-opacity" : "transition-opacity"}>
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onEdit={handleEditOpen}
            onDelete={handleDeleteInit}
            deletingTaskId={deletingTaskId}
            onDeleteConfirm={handleDeleteConfirm}
            onDeleteCancel={handleDeleteCancel}
            deleteLoading={deleteLoading}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}

      {/* Create modal */}
      <TaskModal
        isOpen={modalMode === "create"}
        onClose={handleModalClose}
        title="New Task"
      >
        <TaskForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={handleModalClose}
          loading={modalLoading}
          error={modalError}
        />
      </TaskModal>

      {/* Edit modal */}
      <TaskModal
        isOpen={modalMode === "edit"}
        onClose={handleModalClose}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            mode="edit"
            initialTitle={editingTask.title}
            initialDescription={editingTask.description ?? ""}
            onSubmit={handleUpdate}
            onCancel={handleModalClose}
            loading={modalLoading}
            error={modalError}
          />
        )}
      </TaskModal>
    </main>
  );
}
