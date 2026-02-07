"use client";

import { MobileTabBar } from "@/components/mobile/MobileTabBar";

interface SplitViewProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isMobile: boolean;
  activeTab?: "chat" | "tasks";
  onTabChange?: (tab: "chat" | "tasks") => void;
  taskBadgeCount?: number;
}

export function SplitView({
  leftPanel,
  rightPanel,
  isMobile,
  activeTab = "chat",
  onTabChange,
  taskBadgeCount = 0,
}: SplitViewProps) {
  if (!isMobile) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-2/5 flex-col overflow-hidden border-r border-stone-200">
          {leftPanel}
        </div>
        <div className="flex w-3/5 flex-col overflow-hidden">
          {rightPanel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="relative flex-1 overflow-hidden">
        <div className={activeTab === "chat" ? "flex h-full flex-col" : "hidden"}>
          {leftPanel}
        </div>
        <div className={activeTab === "tasks" ? "flex h-full flex-col" : "hidden"}>
          {rightPanel}
        </div>
      </div>
      <MobileTabBar
        activeTab={activeTab}
        onTabChange={(tab) => onTabChange?.(tab)}
        taskBadgeCount={taskBadgeCount}
      />
    </div>
  );
}
