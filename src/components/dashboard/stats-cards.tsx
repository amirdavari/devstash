import { Boxes, Clock, Layers, Star } from "lucide-react";

import { dashboardStats } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";

// Four at-a-glance metrics across the top of the dashboard.
const STAT_CARDS = [
  { label: "Total items", icon: Layers, color: "#8b5cf6", value: dashboardStats.totalItems },
  { label: "Collections", icon: Boxes, color: "#3b82f6", value: dashboardStats.collections },
  { label: "Favorites", icon: Star, color: "#f59e0b", value: dashboardStats.favorites },
  { label: "Recently used", icon: Clock, color: "#10b981", value: dashboardStats.recentlyUsed },
] as const;

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map(({ label, icon: Icon, color, value }) => (
        <Card key={label}>
          <CardContent className="flex flex-col gap-3">
            <div className="text-meta flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" style={{ color }} />
              {label}
            </div>
            <span className="text-stat tabular-nums">{value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}