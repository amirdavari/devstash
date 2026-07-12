// Data-fetching for the dashboard collections section.
// Reads live collection data from Neon via Prisma, shaped for the collection
// cards (item count, favorite flag, per-type breakdown, and a derived accent
// color taken from the type the collection holds most of).
import { prisma } from "@/lib/prisma";

// Auth isn't wired up yet, so we stand in with the seeded demo user.
// Swap this for the session user once Auth.js lands.
const DEMO_USER_EMAIL = "demo@devstash.io";

// Fallback accent for a collection with no items yet (gray "file" color).
const FALLBACK_ACCENT = "#6b7280";

export interface CollectionTypeBreakdown {
  typeId: string;
  name: string; // item type name, e.g. "snippet"
  icon: string; // lucide icon name stored on ItemType.icon
  color: string; // hex, drives badge + accent color
  count: number; // how many items of this type live in the collection
}

export interface CollectionCardData {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  // Border/background accent, derived from the most-used type in the collection.
  accentColor: string;
  // One entry per distinct item type present, most-used first.
  breakdown: CollectionTypeBreakdown[];
}

async function getDemoUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}

// Most-recently-updated collections for the dashboard grid, with a per-type
// breakdown computed from the items in each collection.
export async function getRecentCollections(
  limit = 6,
): Promise<CollectionCardData[]> {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      isFavorite: true,
      items: {
        select: {
          item: {
            select: {
              itemType: {
                select: { id: true, name: true, icon: true, color: true },
              },
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    // Tally items per item type so we can show a breakdown and pick the accent.
    const byType = new Map<string, CollectionTypeBreakdown>();
    for (const { item } of collection.items) {
      const type = item.itemType;
      const existing = byType.get(type.id);
      if (existing) {
        existing.count += 1;
      } else {
        byType.set(type.id, {
          typeId: type.id,
          name: type.name,
          icon: type.icon,
          color: type.color,
          count: 1,
        });
      }
    }

    const breakdown = [...byType.values()].sort((a, b) => b.count - a.count);

    return {
      id: collection.id,
      name: collection.name,
      itemCount: collection.items.length,
      isFavorite: collection.isFavorite,
      accentColor: breakdown[0]?.color ?? FALLBACK_ACCENT,
      breakdown,
    };
  });
}

// Total number of collections the user has (for the dashboard summary line).
export async function getCollectionCount(): Promise<number> {
  const userId = await getDemoUserId();
  if (!userId) return 0;
  return prisma.collection.count({ where: { userId } });
}

// Total number of items the user has (for the dashboard summary line).
export async function getItemCount(): Promise<number> {
  const userId = await getDemoUserId();
  if (!userId) return 0;
  return prisma.item.count({ where: { userId } });
}