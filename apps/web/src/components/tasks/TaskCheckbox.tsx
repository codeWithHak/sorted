"use client";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export function TaskCheckbox({ checked, onChange, ariaLabel }: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${
        checked
          ? "border-emerald-600 bg-emerald-600"
          : "border-white/20 hover:border-white/40"
      }`}
    >
      {checked && (
        <svg
          className="h-3 w-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
