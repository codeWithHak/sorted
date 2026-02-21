import Image from "next/image";

interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = ["Plan my day", "Add a task", "What's on my list?"];

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(5,150,105,0.3)]">
        <Image src="/jett.jpg" alt="Jett" width={56} height={56} className="h-full w-full object-cover" />
      </div>
      <p className="mt-4 font-medium text-white/60">
        Hey! I&apos;m Jett. Tell me what you need to get done.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestionClick(s)}
            className="border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-mono text-white/40 hover:bg-white/10 hover:text-white/60 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
