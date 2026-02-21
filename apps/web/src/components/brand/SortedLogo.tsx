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
      <span className={`${sizeMap[size]} font-semibold tracking-tight text-white`}>
        sorted
      </span>
      <span
        className={`${dotSizeMap[size]} bg-emerald-600 ${isPulsing ? "animate-pulse" : ""}`}
        style={{
          boxShadow: "0 0 12px rgba(5, 150, 105, 0.5)",
        }}
      />
    </span>
  );
}
