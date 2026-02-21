import type { ActionTaskRef } from "@/lib/types/chat";

interface ActionCardProps {
  actionType: string;
  taskCount: number;
  tasks: ActionTaskRef[];
  onTaskClick: (taskId: string) => void;
}

export function ActionCard({ actionType, taskCount, tasks, onTaskClick }: ActionCardProps) {
  const label =
    actionType === "created"
      ? `Created ${taskCount} task${taskCount !== 1 ? "s" : ""}`
      : actionType === "completed"
        ? `Completed ${taskCount} task${taskCount !== 1 ? "s" : ""}`
        : actionType === "updated"
          ? `Updated ${taskCount} task${taskCount !== 1 ? "s" : ""}`
          : `Deleted ${taskCount} task${taskCount !== 1 ? "s" : ""}`;

  return (
    <div className="mt-2 border-l-2 border-emerald-600/40 bg-emerald-600/10 px-3 py-2">
      <p className="text-xs font-mono font-semibold text-emerald-500 uppercase tracking-wider">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              onClick={() => onTaskClick(task.id)}
              className="text-sm text-emerald-400 underline decoration-emerald-600/30 hover:decoration-emerald-500 focus-visible:outline-2 focus-visible:outline-emerald-500"
            >
              {task.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
