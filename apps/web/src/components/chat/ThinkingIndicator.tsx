"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ThinkingIndicator() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
        J
      </div>
      <div className="flex items-center gap-1 rounded-xl px-3 py-2">
        {prefersReduced ? (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </>
        )}
      </div>
    </div>
  );
}
