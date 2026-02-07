"use client";

import { useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTasks } from "@/hooks/useTasks";
import { useChat } from "@/hooks/useChat";
import { useAgentState } from "@/hooks/useAgentState";
import { SplitView } from "@/components/layout/SplitView";
import { TaskPanel } from "@/components/tasks/TaskPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function DashboardPage() {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const {
    groupedTasks,
    loading,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    highlightTask,
    highlightedTaskId,
  } = useTasks(session?.user?.id);
  const { messages, sendMessage, isThinking } = useChat(session?.user?.id);
  const { agentState, setThinking, setActing, setIdle } = useAgentState();
  const [activeTab, setActiveTab] = useState<"chat" | "tasks">("chat");
  const [taskBadgeCount, setTaskBadgeCount] = useState(0);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setThinking();
      await sendMessage(content);
      // Check if the last message has action cards (mock delay)
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.actionCard) {
        setActing(lastMsg.actionCard.tasks.map((t) => t.id));
        if (isMobile && activeTab === "chat") {
          setTaskBadgeCount((prev) => prev + (lastMsg.actionCard?.taskCount ?? 0));
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
    }
  }

  return (
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
          agentState={agentState}
          onToggle={toggleTask}
          onEdit={updateTask}
          onDelete={deleteTask}
          onCreate={createTask}
          highlightedTaskId={highlightedTaskId}
        />
      }
    />
  );
}
