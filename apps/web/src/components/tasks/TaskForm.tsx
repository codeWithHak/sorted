"use client";

import { useState } from "react";
import type { TaskCreateInput } from "@/lib/types/task";

interface TaskFormProps {
  mode: "create" | "edit";
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (data: TaskCreateInput) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

export function TaskForm({
  mode,
  initialTitle = "",
  initialDescription = "",
  onSubmit,
  onCancel,
  loading,
  error,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  function validate(): boolean {
    let valid = true;
    setTitleError("");
    setDescriptionError("");

    if (title.trim().length === 0) {
      setTitleError("Title is required");
      valid = false;
    } else if (title.length > 200) {
      setTitleError("Title must be 200 characters or fewer");
      valid = false;
    }

    if (description.length > 2000) {
      setDescriptionError("Description must be 2,000 characters or fewer");
      valid = false;
    }

    return valid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data: TaskCreateInput = { title: title.trim() };
    if (description.trim()) {
      data.description = description.trim();
    }
    onSubmit(data);
  }

  const isInvalid = title.trim().length === 0 || title.length > 200 || description.length > 2000;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError("");
          }}
          maxLength={200}
          required
          className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
          placeholder="What needs to be done?"
          autoFocus
        />
        <div className="flex justify-between">
          {titleError ? (
            <span className="text-sm text-red-600 dark:text-red-400">{titleError}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-zinc-400">{title.length}/200</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description" className="text-sm font-medium">
          Description <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (descriptionError) setDescriptionError("");
          }}
          maxLength={2000}
          rows={3}
          className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
          placeholder="Add a description..."
        />
        <div className="flex justify-between">
          {descriptionError ? (
            <span className="text-sm text-red-600 dark:text-red-400">{descriptionError}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-zinc-400">{description.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || isInvalid}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Task" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
