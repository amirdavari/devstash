// Data-fetching for the dashboard items section (recent items + stat counts).
// Reads live item data from Neon via Prisma, shaped for the item cards: each
// card's icon/border come from the item's type, plus a small meta line built
// from the item's primary detail (language / host / size) and its collection.
import { prisma } from "@/lib/prisma";

// Auth isn't wired up yet, so we stand in with the seeded demo user.
// Swap this for the session user once Auth.js lands.
const DEMO_USER_EMAIL = "demo@devstash.io";

// Fallback type color for an item whose type has no color (shouldn't happen).
const FALLBACK_COLOR = "#6b7280";

export interface ItemCardData {
  id: string;
  title: string;
  // Type metadata drives the card icon, label and left-border color.
  type: { name: string; icon: string; color: string };
  // Primary detail shown in the mono meta line: language / host / file size /
  // type label. Null when there's nothing meaningful to show.
  detail: string | null;
  // First collection the item belongs to, if any.
  collectionName: string | null;
  isFavorite: boolean;
  isPinned: boolean;
}

export interface DashboardStats {
  totalItems: number;
  collections: number;
  favorites: number;
  recentlyUsed: number;
}

async function getDemoUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// The item shape we select for a card; kept local so the detail helper stays
// typed without leaning on the generated Prisma types.
interface ItemRow {
  contentType: string;
  url: string | null;
  fileSize: number | null;
  language: string | null;
  description: string | null;
  itemType: { name: string };
}

// Builds the meta line's primary detail from whatever best describes the item.
function detailFor(item: ItemRow): string | null {
  if (item.language) return capitalize(item.language);
  if (item.contentType === "URL" && item.url) return hostFromUrl(item.url);
  if (item.contentType === "FILE" && item.fileSize != null) {
    return formatBytes(item.fileSize);
  }
  // Text items without a language (prompts, notes) show their type label.
  if (item.contentType === "TEXT") return capitalize(item.itemType.name);
  return item.description ?? null;
}

// Most-recently-used items for the dashboard grid. Ordered by last use (falling
// back to creation), then filtered client-side into All / Pinned / Favorites —
// so we fetch a generous window rather than a single page's worth.
export async function getRecentItems(limit = 24): Promise<ItemCardData[]> {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: [
      { lastUsedAt: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    take: limit,
    select: {
      id: true,
      title: true,
      contentType: true,
      url: true,
      fileSize: true,
      language: true,
      description: true,
      isFavorite: true,
      isPinned: true,
      itemType: { select: { name: true, icon: true, color: true } },
      collections: {
        take: 1,
        orderBy: { addedAt: "asc" },
        select: { collection: { select: { name: true } } },
      },
    },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    type: {
      name: item.itemType.name,
      icon: item.itemType.icon,
      color: item.itemType.color ?? FALLBACK_COLOR,
    },
    detail: detailFor(item),
    collectionName: item.collections[0]?.collection.name ?? null,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
  }));
}

// At-a-glance counts for the four stat cards across the top of the dashboard.
export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await getDemoUserId();
  if (!userId) {
    return { totalItems: 0, collections: 0, favorites: 0, recentlyUsed: 0 };
  }

  const [totalItems, collections, favorites, recentlyUsed] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.item.count({ where: { userId, lastUsedAt: { not: null } } }),
  ]);

  return { totalItems, collections, favorites, recentlyUsed };
}