"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AppHeader } from "@/components/layout/AppHeader";
import { AgentSidebar } from "@/components/sidebar/AgentSidebar";
import { AgentActivityProvider, useAgentActivity } from "@/contexts/AgentActivityContext";
import { agents } from "@/data/agents";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { agentState } = useAgentActivity();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/auth/signin");
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        userEmail={session?.user?.email ?? ""}
        isAgentActive={agentState.status !== "idle"}
        onSignOut={handleSignOut}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <AgentSidebar
            agents={agents}
            activeAgentId="jett"
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgentActivityProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AgentActivityProvider>
  );
}
