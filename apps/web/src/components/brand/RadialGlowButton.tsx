"use client";

import Link from "next/link";
import { ReactNode } from "react";

/* ─── Size tokens ─── */
const sizes = {
  sm: { padding: "8px 16px", fontSize: "0.75rem", outerRadius: 12, innerRadius: 10, blobW: "50px" },
  md: { padding: "12px 24px", fontSize: "0.85rem", outerRadius: 16, innerRadius: 14, blobW: "70px" },
  lg: { padding: "14px 28px", fontSize: "0.95rem",  outerRadius: 18, innerRadius: 16, blobW: "85px" },
};

/* ─────────────────────────────────────────────
   PRIMARY — emerald-infused radial glow
   The main CTA. Dark glass with emerald energy.
   ───────────────────────────────────────────── */
function PrimaryInner({
  children,
  size = "md",
  disabled,
}: {
  children: ReactNode;
  size: "sm" | "md" | "lg";
  disabled: boolean;
}) {
  const s = sizes[size];
  return (
    <span
      className={`radial-glow-btn radial-glow-btn--primary group ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: s.fontSize,
        borderRadius: s.outerRadius,
        border: "none",
        padding: "2px",
        background: "radial-gradient(circle 80px at 80% -10%, #34d399, #0a1f15)",
        position: "relative",
        display: "inline-flex",
        transition: "transform 0.25s ease, filter 0.3s ease",
      }}
    >
      {/* Top-right emerald ambient glow */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "65%",
          height: "60%",
          borderRadius: 120,
          top: 0,
          right: 0,
          boxShadow: "0 0 24px #34d39950",
          zIndex: -1,
        }}
      />

      {/* Emerald blob — bottom-left energy accent */}
      <span
        aria-hidden="true"
        className="radial-glow-btn__blob"
        style={{
          position: "absolute",
          width: s.blobW,
          height: "100%",
          borderRadius: s.outerRadius,
          bottom: 0,
          left: 0,
          background: "radial-gradient(circle 60px at 0% 100%, #34d399, #05966980, transparent)",
          boxShadow: "-10px 10px 30px #0596692d",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Inner pill — dark with emerald radial tint */}
      <span
        className="radial-glow-btn__inner"
        style={{
          padding: s.padding,
          borderRadius: s.innerRadius,
          color: "#fff",
          zIndex: 3,
          position: "relative",
          background: "radial-gradient(circle 80px at 80% -50%, #1a6b4a, #061210)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5em",
          transition: "background 0.3s ease",
        }}
      >
        {/* Inner emerald tint overlay */}
        <span
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            borderRadius: s.innerRadius,
            background: "radial-gradient(circle 60px at 0% 100%, #34d3991a, #05966915, transparent)",
            position: "absolute",
            pointerEvents: "none",
          }}
        />
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
          {children}
        </span>
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   GHOST — transparent outline, subtle glow
   Secondary CTA. Understated glass border.
   ───────────────────────────────────────────── */
function GhostInner({
  children,
  size = "md",
  disabled,
}: {
  children: ReactNode;
  size: "sm" | "md" | "lg";
  disabled: boolean;
}) {
  const s = sizes[size];
  return (
    <span
      className={`radial-glow-btn radial-glow-btn--ghost group ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: s.fontSize,
        borderRadius: s.outerRadius,
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "0",
        background: "transparent",
        position: "relative",
        display: "inline-flex",
        transition: "transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Subtle top-right white sheen */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          borderRadius: 80,
          top: 0,
          right: 0,
          boxShadow: "0 0 16px #ffffff10",
          zIndex: -1,
        }}
      />

      {/* Inner — transparent glass */}
      <span
        className="radial-glow-btn__inner"
        style={{
          padding: s.padding,
          borderRadius: s.innerRadius,
          color: "rgba(255,255,255,0.7)",
          zIndex: 3,
          position: "relative",
          background: "radial-gradient(circle 80px at 80% -50%, rgba(255,255,255,0.06), transparent)",
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5em",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
          {children}
        </span>
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   STANDBY — muted disabled state
   No glow, no blob, clearly inactive.
   ───────────────────────────────────────────── */
function StandbyInner({
  children,
  size = "md",
}: {
  children: ReactNode;
  size: "sm" | "md" | "lg";
}) {
  const s = sizes[size];
  return (
    <span
      className="radial-glow-btn radial-glow-btn--standby"
      style={{
        fontSize: s.fontSize,
        borderRadius: s.outerRadius,
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "0",
        background: "transparent",
        position: "relative",
        display: "inline-flex",
        cursor: "not-allowed",
        opacity: 0.35,
      }}
    >
      <span
        style={{
          padding: s.padding,
          borderRadius: s.innerRadius,
          color: "rgba(255,255,255,0.25)",
          position: "relative",
          background: "rgba(255,255,255,0.03)",
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5em",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */
export interface RadialGlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "standby";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function RadialGlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: RadialGlowButtonProps) {
  const inner =
    variant === "primary" ? (
      <PrimaryInner size={size} disabled={disabled}>{children}</PrimaryInner>
    ) : variant === "ghost" ? (
      <GhostInner size={size} disabled={disabled}>{children}</GhostInner>
    ) : (
      <StandbyInner size={size}>{children}</StandbyInner>
    );

  const wrapperClass = `inline-flex radial-glow-btn-wrapper ${className}`;

  if (href && !disabled) {
    return <Link href={href} className={wrapperClass}>{inner}</Link>;
  }

  if (onClick) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={`${wrapperClass} focus-visible:outline-none`}>
        {inner}
      </button>
    );
  }

  return <span className={wrapperClass}>{inner}</span>;
}
