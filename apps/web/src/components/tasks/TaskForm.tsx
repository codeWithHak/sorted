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
        <div className="border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-mono font-medium text-white/60 uppercase tracking-wider">
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
          className="border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-600 transition-colors placeholder:text-white/20"
          placeholder="What needs to be done?"
          autoFocus
        />
        <div className="flex justify-between">
          {titleError ? (
            <span className="text-sm text-red-400">{titleError}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-white/30">{title.length}/200</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description" className="text-sm font-mono font-medium text-white/60 uppercase tracking-wider">
          Description <span className="font-normal text-white/30">(optional)</span>
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
          className="border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-600 transition-colors placeholder:text-white/20"
          placeholder="Add a description..."
        />
        <div className="flex justify-between">
          {descriptionError ? (
            <span className="text-sm text-red-400">{descriptionError}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-white/30">{description.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="border border-white/10 px-4 py-2 text-sm text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || isInvalid}
          className="bg-emerald-600 px-4 py-2 text-sm font-mono font-medium text-white uppercase tracking-wider hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Task" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
