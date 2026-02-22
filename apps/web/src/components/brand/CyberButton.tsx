"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ReactNode, useState } from "react";

const clips = {
  sm: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
  md: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
  lg: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

const padding = {
  sm: "px-5 py-2",
  md: "px-7 py-3",
  lg: "px-8 py-3.5",
};

/* ─────────────────────────────────────────────
   PRIMARY — emerald fill + scan sweep + glow
   ───────────────────────────────────────────── */
function PrimaryInner({
  children,
  size = "md",
  disabled,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className={`relative inline-flex w-full items-center justify-center gap-2 overflow-hidden
        ${padding[size]}
        text-sm font-mono font-semibold uppercase tracking-wider text-white
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        clipPath: clips[size],
        backgroundColor: hovered ? "#059669" : "#047857",
        filter: hovered
          ? "drop-shadow(0 0 12px rgba(5,150,105,0.9)) drop-shadow(0 0 32px rgba(5,150,105,0.45))"
          : "drop-shadow(0 0 0px rgba(5,150,105,0))",
        transition: "background-color 0.25s ease, filter 0.3s ease",
      }}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Scan-line sweep */}
      <span
        className="absolute top-0 bottom-0 w-1/2 pointer-events-none -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
          transform: `skewX(-12deg) translateX(${hovered ? "300%" : "-160%"})`,
          transition: "transform 0.55s ease",
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   GHOST — transparent border + liquid fill rises
   ───────────────────────────────────────────── */
function GhostInner({
  children,
  size = "md",
  disabled,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className={`relative inline-flex w-full items-center justify-center gap-2 overflow-hidden
        ${padding[size]}
        text-sm font-mono font-medium uppercase tracking-wider
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        clipPath: clips[size],
        border: `1px solid ${hovered ? "rgba(5,150,105,0.55)" : "rgba(255,255,255,0.18)"}`,
        color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.65)",
        filter: hovered
          ? "drop-shadow(0 0 8px rgba(5,150,105,0.3))"
          : "drop-shadow(0 0 0px rgba(5,150,105,0))",
        transition: "border-color 0.3s ease, color 0.25s ease, filter 0.3s ease",
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Liquid fill rising from bottom */}
      <span
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: hovered ? "100%" : "0%",
          backgroundColor: "rgba(5,150,105,0.15)",
          transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   STANDBY — disabled muted state
   ───────────────────────────────────────────── */
function StandbyInner({
  children,
  size = "md",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`inline-flex w-full items-center justify-center gap-2
        ${padding[size]}
        text-sm font-mono font-medium uppercase tracking-wider
        bg-white/5 border border-white/10 text-white/20 cursor-not-allowed select-none`}
      style={{ clipPath: clips[size] }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */
export interface CyberButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "standby";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
}

export function CyberButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: CyberButtonProps) {
  const inner =
    variant === "primary" ? (
      <PrimaryInner size={size} disabled={disabled}>
        {children}
      </PrimaryInner>
    ) : variant === "ghost" ? (
      <GhostInner size={size} disabled={disabled}>
        {children}
      </GhostInner>
    ) : (
      <StandbyInner size={size}>{children}</StandbyInner>
    );

  if (href && !disabled) {
    return <Link href={href} className="inline-flex">{inner}</Link>;
  }

  if (onClick) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className="inline-flex focus-visible:outline-none">
        {inner}
      </button>
    );
  }

  return <span className="inline-flex">{inner}</span>;
}
