import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

// Dashboard shell: sidebar + main content area.
// Phase 1 wires the two-column layout; phases 2–3 fill in the sidebar
// and the main dashboard content.
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}