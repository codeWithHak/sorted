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
    <div className="mt-2 rounded-lg border-l-2 border-amber-400 bg-amber-50 px-3 py-2">
      <p className="text-xs font-semibold text-amber-700">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              onClick={() => onTaskClick(task.id)}
              className="text-sm text-amber-800 underline decoration-amber-300 hover:decoration-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              {task.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
