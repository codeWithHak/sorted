/**
 * Component prop contracts for key UI components.
 *
 * These define the interfaces between parent and child components,
 * establishing clear boundaries for the implementation tasks.
 */

import type { ChatMessage, ActionTaskRef } from "./chat-types";
import type { TaskCardData, GroupedTasks } from "./task-types";
import type { Agent, AgentActivityState } from "./agent-types";

// ─── Brand ──────────────────────────────────────────────────────────────

export interface SortedLogoProps {
  /** Whether the amber dot should pulse (agent active) */
  isPulsing?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

// ─── Chat ───────────────────────────────────────────────────────────────

export interface ChatPanelProps {
  /** All messages to render */
  messages: ChatMessage[];
  /** Whether Jett is currently thinking */
  isThinking: boolean;
  /** Callback when user sends a message */
  onSendMessage: (content: string) => void;
  /** Callback when user clicks a task name in an action card */
  onTaskClick: (taskId: string) => void;
  /** Callback when user clicks a suggestion chip */
  onSuggestionClick: (suggestion: string) => void;
}

export interface ChatMessageProps {
  /** Message data to render */
  message: ChatMessage;
  /** Callback when a task name in an action card is clicked */
  onTaskClick?: (taskId: string) => void;
}

export interface ActionCardProps {
  /** Action type label */
  actionType: string;
  /** Number of tasks affected */
  taskCount: number;
  /** Task references for clickable links */
  tasks: ActionTaskRef[];
  /** Callback when a task name is clicked */
  onTaskClick: (taskId: string) => void;
}

export interface ChatInputProps {
  /** Callback when message is submitted */
  onSubmit: (content: string) => void;
  /** Whether input is disabled (e.g., while Jett is thinking) */
  disabled?: boolean;
}

export interface ChatEmptyStateProps {
  /** Callback when a suggestion chip is clicked */
  onSuggestionClick: (suggestion: string) => void;
}

// ─── Tasks ──────────────────────────────────────────────────────────────

export interface TaskPanelProps {
  /** Grouped tasks for section rendering */
  groupedTasks: GroupedTasks;
  /** Whether tasks are loading */
  loading: boolean;
  /** Agent activity state (drives glow animation) */
  agentState: AgentActivityState;
  /** Callback when a task is toggled */
  onToggle: (taskId: string) => void;
  /** Callback when a task is edited */
  onEdit: (taskId: string, data: { title?: string; description?: string }) => void;
  /** Callback when a task is deleted */
  onDelete: (taskId: string) => void;
  /** Callback when user creates a new task manually */
  onCreate: (title: string, description?: string) => void;
  /** Task ID to highlight (from action card click) — null when none */
  highlightedTaskId: string | null;
}

export interface TaskCardProps {
  /** Task data to render */
  task: TaskCardData;
  /** Whether this card should be highlighted (amber flash) */
  isHighlighted?: boolean;
  /** Whether this card is newly created by an agent (entrance animation) */
  isNewFromAgent?: boolean;
  /** Callback when checkbox is toggled */
  onToggle: () => void;
  /** Callback when edit is requested */
  onEdit: (data: { title?: string; description?: string }) => void;
  /** Callback when delete is requested */
  onDelete: () => void;
}

export interface TaskSectionProps {
  /** Section title (e.g., "Today", "Upcoming", "Completed") */
  title: string;
  /** Tasks in this section */
  tasks: TaskCardData[];
  /** Whether the section is initially collapsed */
  defaultCollapsed?: boolean;
  /** Task ID to highlight */
  highlightedTaskId: string | null;
  /** Agent state for animation triggers */
  agentState: AgentActivityState;
  /** Task event callbacks */
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string, data: { title?: string; description?: string }) => void;
  onDelete: (taskId: string) => void;
}

export interface TaskCheckboxProps {
  /** Whether the task is completed */
  checked: boolean;
  /** Callback when toggled */
  onChange: () => void;
  /** Accessible label */
  ariaLabel: string;
}

// ─── Sidebar ────────────────────────────────────────────────────────────

export interface AgentSidebarProps {
  /** List of all agents (active + coming soon) */
  agents: Agent[];
  /** Currently active agent ID */
  activeAgentId: string;
  /** Whether sidebar is collapsed */
  isCollapsed: boolean;
  /** Toggle sidebar collapse */
  onToggleCollapse: () => void;
}

export interface AgentItemProps {
  /** Agent data */
  agent: Agent;
  /** Whether this is the currently active agent */
  isActive: boolean;
}

// ─── Layout ─────────────────────────────────────────────────────────────

export interface AppHeaderProps {
  /** User email for display */
  userEmail: string;
  /** Whether an agent is active (drives logo pulse) */
  isAgentActive: boolean;
  /** Sign out callback */
  onSignOut: () => void;
  /** Toggle sidebar callback */
  onToggleSidebar: () => void;
}

export interface SplitViewProps {
  /** Left panel content (chat) */
  leftPanel: React.ReactNode;
  /** Right panel content (tasks) */
  rightPanel: React.ReactNode;
  /** Whether to show as split (desktop) or tabbed (mobile) */
  isMobile: boolean;
}

// ─── Mobile ─────────────────────────────────────────────────────────────

export interface MobileTabBarProps {
  /** Currently active tab */
  activeTab: "chat" | "tasks";
  /** Callback when tab changes */
  onTabChange: (tab: "chat" | "tasks") => void;
  /** Number of unread task notifications */
  taskBadgeCount: number;
}

export interface MobileNotificationPillProps {
  /** Message to display (e.g., "3 tasks added by Jett") */
  message: string;
  /** Whether the pill is visible */
  isVisible: boolean;
  /** Callback when dismissed */
  onDismiss: () => void;
}

// ─── Landing ────────────────────────────────────────────────────────────

export interface LiveDemoProps {
  /** Whether the demo should be playing (controlled by intersection observer) */
  isPlaying: boolean;
}
