"use client";

import { LayoutDashboard } from "lucide-react";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

// Top bar of the dashboard. The sidebar owns its own collapse trigger while
// expanded; this header only surfaces a trigger to reopen the sidebar once it
// has collapsed off-canvas (or on mobile, where the sidebar is a drawer).
export function DashboardHeader() {
  const { state, isMobile } = useSidebar();
  const showTrigger = isMobile || state === "collapsed";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      {showTrigger && <SidebarTrigger />}
      <div className="flex items-center gap-2 text-sm font-medium">
        <LayoutDashboard className="size-4 text-muted-foreground" />
        Dashboard
      </div>
    </header>
  );
}