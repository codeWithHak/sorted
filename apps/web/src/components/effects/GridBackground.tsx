interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className = "" }: GridBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 grid-bg opacity-60 h-[600px] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
