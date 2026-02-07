"use client";

const sizeMap = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const;

const dotSizeMap = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
} as const;

interface SortedLogoProps {
  isPulsing?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SortedLogo({ isPulsing = false, size = "md" }: SortedLogoProps) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className={`${sizeMap[size]} font-semibold tracking-tight text-stone-900`}>
        sorted
      </span>
      <span
        className={`${dotSizeMap[size]} rounded-full bg-amber-500 ${isPulsing ? "animate-pulse" : ""}`}
      />
    </span>
  );
}
