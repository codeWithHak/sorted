"use client";

import type { TaskFilter } from "@/lib/types/task";

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  disabled?: boolean;
}

const filters: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export function FilterBar({ filter, onFilterChange, disabled }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          disabled={disabled || filter === f.value}
          className={
            filter === f.value
              ? "rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "rounded-md px-3 py-1 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
