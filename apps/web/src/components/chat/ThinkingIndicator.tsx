"use client";

import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ThinkingIndicator() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(5,150,105,0.3)]">
        <Image src="/jett.jpg" alt="Jett" width={28} height={28} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center gap-1 px-3 py-2">
        {prefersReduced ? (
          <>
            <span className="h-2 w-2 bg-emerald-500" />
            <span className="h-2 w-2 bg-emerald-500" />
            <span className="h-2 w-2 bg-emerald-500" />
          </>
        ) : (
          <>
            <span className="h-2 w-2 bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </>
        )}
      </div>
    </div>
  );
}
