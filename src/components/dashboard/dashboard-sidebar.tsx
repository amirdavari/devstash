// Placeholder sidebar for the dashboard shell.
// Phase 2 replaces the contents with the collapsible sidebar (types,
// collections, user area). Kept as a simple placeholder for phase 1.
export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
      <div className="flex h-full flex-col p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </div>
    </aside>
  );
}