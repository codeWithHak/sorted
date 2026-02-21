interface TaskEmptyStateProps {
  onCreate: () => void;
}

export function TaskEmptyState({ onCreate }: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center bg-white/5">
        <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="mt-4 font-medium text-white/50">No tasks yet.</p>
      <p className="mt-1 text-sm text-white/30">
        Ask Jett to help you get started!
      </p>
      <button
        onClick={onCreate}
        className="mt-4 bg-emerald-600 px-5 py-2 text-sm font-mono font-medium text-white uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-[0_0_12px_rgba(5,150,105,0.2)]"
      >
        Add a task
      </button>
    </div>
  );
}
