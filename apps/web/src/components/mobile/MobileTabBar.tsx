"use client";

interface MobileTabBarProps {
  activeTab: "chat" | "tasks";
  onTabChange: (tab: "chat" | "tasks") => void;
  taskBadgeCount?: number;
}

export function MobileTabBar({ activeTab, onTabChange, taskBadgeCount = 0 }: MobileTabBarProps) {
  return (
    <div className="flex border-t border-stone-200 bg-white" role="tablist" aria-label="Navigation tabs">
      <button
        role="tab"
        aria-selected={activeTab === "chat"}
        onClick={() => onTabChange("chat")}
        className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
          activeTab === "chat" ? "text-amber-600" : "text-stone-400"
        }`}
        aria-label="Chat tab"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>
      <button
        role="tab"
        aria-selected={activeTab === "tasks"}
        onClick={() => onTabChange("tasks")}
        className={`relative flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
          activeTab === "tasks" ? "text-amber-600" : "text-stone-400"
        }`}
        aria-label="Tasks tab"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tasks
        {taskBadgeCount > 0 && (
          <span className="absolute right-1/4 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white animate-pulse">
            {taskBadgeCount}
          </span>
        )}
      </button>
    </div>
  );
}
