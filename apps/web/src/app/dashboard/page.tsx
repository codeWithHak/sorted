"use client";

import { useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTasks } from "@/hooks/useTasks";
import { useChat } from "@/hooks/useChat";
import { useAgentActivity } from "@/contexts/AgentActivityContext";
import { SplitView } from "@/components/layout/SplitView";
import { TaskPanel } from "@/components/tasks/TaskPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { MobileNotificationPill } from "@/components/mobile/MobileNotificationPill";

export default function DashboardPage() {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const {
    groupedTasks,
    loading,
    error: taskError,
    isPending,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    highlightTask,
    highlightedTaskId,
  } = useTasks(session?.user?.id);
  const { messages, sendMessage, isThinking } = useChat(session?.user?.id);
  const { agentState, setThinking, setActing, setIdle } = useAgentActivity();
  const [activeTab, setActiveTab] = useState<"chat" | "tasks">("chat");
  const [taskBadgeCount, setTaskBadgeCount] = useState(0);
  const [showNotificationPill, setShowNotificationPill] = useState(false);
  const [pendingNotificationCount, setPendingNotificationCount] = useState(0);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setThinking();
      await sendMessage(content);
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.actionCard) {
        setActing(lastMsg.actionCard.tasks.map((t) => t.id));
        if (isMobile && activeTab === "chat") {
          const count = lastMsg.actionCard?.taskCount ?? 0;
          setTaskBadgeCount((prev) => prev + count);
          setPendingNotificationCount((prev) => prev + count);
        }
        setTimeout(() => setIdle(), 1500);
      } else {
        setIdle();
      }
    },
    [sendMessage, setThinking, setActing, setIdle, messages, isMobile, activeTab],
  );

  function handleSuggestionClick(suggestion: string) {
    handleSendMessage(suggestion);
  }

  function handleTaskClick(taskId: string) {
    highlightTask(taskId);
    if (isMobile) {
      setActiveTab("tasks");
    }
  }

  function handleTabChange(tab: "chat" | "tasks") {
    setActiveTab(tab);
    if (tab === "tasks") {
      setTaskBadgeCount(0);
      if (pendingNotificationCount > 0) {
        setShowNotificationPill(true);
      }
    }
  }

  function handleDismissNotification() {
    setShowNotificationPill(false);
    setPendingNotificationCount(0);
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {isMobile && showNotificationPill && pendingNotificationCount > 0 && (
        <MobileNotificationPill
          count={pendingNotificationCount}
          onDismiss={handleDismissNotification}
        />
      )}
      <SplitView
        isMobile={isMobile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        taskBadgeCount={taskBadgeCount}
        leftPanel={
          <ChatPanel
            messages={messages}
            isThinking={isThinking}
            onSendMessage={handleSendMessage}
            onTaskClick={handleTaskClick}
            onSuggestionClick={handleSuggestionClick}
          />
        }
        rightPanel={
          <TaskPanel
            groupedTasks={groupedTasks}
            loading={loading}
            error={taskError}
            agentState={agentState}
            onToggle={toggleTask}
            onEdit={updateTask}
            onDelete={deleteTask}
            onCreate={createTask}
            highlightedTaskId={highlightedTaskId}
          />
        }
      />
    </div>
  );
}
