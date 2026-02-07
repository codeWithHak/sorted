interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = ["Plan my day", "Add a task", "What's on my list?"];

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white">
        J
      </div>
      <p className="mt-4 font-medium text-stone-700">
        Hey! I&apos;m Jett. Tell me what you need to get done.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestionClick(s)}
            className="rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-100 transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
