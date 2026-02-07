"use client";

interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function DeleteConfirm({ onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {loading ? "Deleting..." : "Delete this task?"}
      </span>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
      >
        Yes, delete
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="text-sm text-zinc-500 hover:text-zinc-700 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Cancel
      </button>
    </div>
  );
}
