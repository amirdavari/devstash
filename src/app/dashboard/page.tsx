import { currentUser } from "@/lib/mock-data";
import { getCollectionCount, getItemCount } from "@/lib/db/collections";
import { getRecentItems } from "@/lib/db/items";
import { CollectionsSection } from "@/components/dashboard/collections-section";
import { RecentItems } from "@/components/dashboard/recent-items";
import { StatsCards } from "@/components/dashboard/stats-cards";

// Personalized, per-request data (real collections from the database).
export const dynamic = "force-dynamic";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Main dashboard content: greeting, stats, collections and recent items.
export default async function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];
  const greeting = greetingForHour(new Date().getHours());
  const [itemCount, collectionCount, recentItems] = await Promise.all([
    getItemCount(),
    getCollectionCount(),
    getRecentItems(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-page-title">
          {greeting}, {firstName} <span aria-hidden>👋</span>
        </h1>
        <p className="text-body text-muted-foreground">
          {`You have ${itemCount} items across ${collectionCount} collections. Everything's a keystroke away.`}
        </p>
      </header>

      <StatsCards />
      <CollectionsSection />
      <RecentItems items={recentItems} />
    </div>
  );
}