interface AuraGradientProps {
  className?: string;
}

export function AuraGradient({ className = "" }: AuraGradientProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Primary aura — purple/orange/teal conic */}
      <div
        className="aura-gradient absolute -top-1/2 -right-1/4 w-[120%] h-[200%] opacity-60"
        style={{ transformOrigin: "center center" }}
      />
      {/* Left-side darken overlay to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
      {/* Bottom fade to black */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
    </div>
  );
}
