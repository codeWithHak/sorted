interface TaskEmptyStateProps {
  onCreate: () => void;
}

export function TaskEmptyState({ onCreate }: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
        <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="mt-4 font-medium text-stone-700">No tasks yet.</p>
      <p className="mt-1 text-sm text-stone-500">
        Ask Jett to help you get started!
      </p>
      <button
        onClick={onCreate}
        className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
      >
        Add a task
      </button>
    </div>
  );
}
