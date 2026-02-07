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
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2 ${
        checked
          ? "border-amber-500 bg-amber-500"
          : "border-stone-300 hover:border-stone-400"
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
