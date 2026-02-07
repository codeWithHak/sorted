"use client";

import { useEffect, useState } from "react";

interface MobileNotificationPillProps {
  count: number;
  onDismiss: () => void;
}

export function MobileNotificationPill({ count, onDismiss }: MobileNotificationPillProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible || count === 0) return null;

  return (
    <button
      onClick={() => {
        setVisible(false);
        onDismiss();
      }}
      className="absolute left-1/2 top-2 z-10 -translate-x-1/2 animate-[slideDown_300ms_ease-out] rounded-full bg-amber-500 px-4 py-1.5 text-xs font-medium text-white shadow-md transition-opacity hover:bg-amber-600"
      aria-label={`${count} tasks added by Jett. Tap to dismiss.`}
    >
      {count} {count === 1 ? "task" : "tasks"} added by Jett
    </button>
  );
}
