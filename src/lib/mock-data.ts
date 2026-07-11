// Single source of truth for mock dashboard data.
// Temporary stand-in until the database (Prisma/Neon) is wired up.
// Shapes loosely mirror the Prisma models in context/project-overview.md.

export type ContentType = "TEXT" | "URL" | "FILE";

export interface ItemType {
  id: string;
  name: string; // "snippet", "prompt", ...
  label: string; // display label, e.g. "Snippets"
  icon: string; // lucide icon name
  color: string; // hex
  contentType: ContentType;
  count: number; // how many items of this type the user has
}

export interface Collection {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  // Color-code the card by the type it holds most of.
  accentColor: string;
  // Small badges shown on the card: which types live in this collection.
  breakdown: { typeId: string; count: number }[];
}

export interface Item {
  id: string;
  title: string;
  typeId: string;
  contentType: ContentType;
  language?: string; // for code snippets
  description?: string; // small meta line, e.g. filename or url host
  fileSize?: string; // human-readable, for FILE items
  collectionName?: string;
  isFavorite: boolean;
  isPinned: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: "Free" | "Pro";
  isPro: boolean;
}

export interface DashboardStats {
  totalItems: number;
  collections: number;
  favorites: number;
  recentlyUsed: number;
}

// ─────────────────────────────  User  ─────────────────────────────

export const currentUser: User = {
  id: "user_1",
  name: "Jordan Dev",
  email: "jordan@devstash.app",
  initials: "JD",
  plan: "Pro",
  isPro: true,
};

// ──────────────────────────  Item types  ──────────────────────────

export const itemTypes: ItemType[] = [
  { id: "snippet", name: "snippet", label: "Snippets", icon: "Code", color: "#3b82f6", contentType: "TEXT", count: 34 },
  { id: "prompt", name: "prompt", label: "Prompts", icon: "Sparkles", color: "#8b5cf6", contentType: "TEXT", count: 19 },
  { id: "note", name: "note", label: "Notes", icon: "StickyNote", color: "#fde047", contentType: "TEXT", count: 12 },
  { id: "command", name: "command", label: "Commands", icon: "Terminal", color: "#f97316", contentType: "TEXT", count: 27 },
  { id: "link", name: "link", label: "Links", icon: "Link", color: "#10b981", contentType: "URL", count: 41 },
  { id: "file", name: "file", label: "Files", icon: "File", color: "#6b7280", contentType: "FILE", count: 8 },
  { id: "image", name: "image", label: "Images", icon: "Image", color: "#ec4899", contentType: "FILE", count: 15 },
];

// ───────────────────────────  Stats  ───────────────────────────

export const dashboardStats: DashboardStats = {
  totalItems: 9,
  collections: 8,
  favorites: 2,
  recentlyUsed: 12,
};

// ─────────────────────────  Collections  ─────────────────────────

export const collections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    itemCount: 12,
    isFavorite: true,
    accentColor: "#3b82f6",
    breakdown: [
      { typeId: "snippet", count: 8 },
      { typeId: "file", count: 3 },
      { typeId: "link", count: 1 },
    ],
  },
  {
    id: "col_prototype_prompts",
    name: "Prototype Prompts",
    itemCount: 8,
    isFavorite: true,
    accentColor: "#8b5cf6",
    breakdown: [
      { typeId: "prompt", count: 6 },
      { typeId: "note", count: 2 },
    ],
  },
  {
    id: "col_shell_commands",
    name: "Shell Commands",
    itemCount: 15,
    isFavorite: false,
    accentColor: "#f97316",
    breakdown: [
      { typeId: "command", count: 12 },
      { typeId: "snippet", count: 3 },
    ],
  },
  {
    id: "col_reading_list",
    name: "Reading List",
    itemCount: 23,
    isFavorite: true,
    accentColor: "#10b981",
    breakdown: [
      { typeId: "link", count: 20 },
      { typeId: "file", count: 3 },
    ],
  },
  {
    id: "col_context_files",
    name: "Context Files",
    itemCount: 6,
    isFavorite: false,
    accentColor: "#6b7280",
    breakdown: [
      { typeId: "file", count: 4 },
      { typeId: "note", count: 2 },
    ],
  },
  {
    id: "col_design_notes",
    name: "Design Notes",
    itemCount: 9,
    isFavorite: false,
    accentColor: "#fde047",
    breakdown: [
      { typeId: "snippet", count: 7 },
      { typeId: "image", count: 2 },
    ],
  },
  {
    id: "col_api_examples",
    name: "API Examples",
    itemCount: 11,
    isFavorite: false,
    accentColor: "#3b82f6",
    breakdown: [
      { typeId: "snippet", count: 7 },
      { typeId: "link", count: 4 },
    ],
  },
  {
    id: "col_screenshots",
    name: "Screenshots",
    itemCount: 14,
    isFavorite: false,
    accentColor: "#ec4899",
    breakdown: [
      { typeId: "image", count: 11 },
      { typeId: "file", count: 3 },
    ],
  },
];

// ─────────────────────  Recent items  ─────────────────────

export const recentItems: Item[] = [
  {
    id: "item_1",
    title: "useDebounce hook",
    typeId: "snippet",
    contentType: "TEXT",
    language: "Typescript",
    collectionName: "React Patterns",
    isFavorite: true,
    isPinned: true,
  },
  {
    id: "item_2",
    title: "Optimistic UI mutation",
    typeId: "snippet",
    contentType: "TEXT",
    language: "Typescript",
    collectionName: "React Patterns",
    isFavorite: false,
    isPinned: true,
  },
  {
    id: "item_3",
    title: "Code review assistant",
    typeId: "prompt",
    contentType: "TEXT",
    description: "Prompt",
    collectionName: "Prototype Prompts",
    isFavorite: true,
    isPinned: false,
  },
  {
    id: "item_4",
    title: "Docker prune everything",
    typeId: "command",
    contentType: "TEXT",
    language: "Bash",
    collectionName: "Shell Commands",
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_5",
    title: "Tailwind v4 upgrade guide",
    typeId: "link",
    contentType: "URL",
    description: "tailwindcss.com",
    collectionName: "Reading List",
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_6",
    title: "Sprint retro takeaways",
    typeId: "note",
    contentType: "TEXT",
    description: "Note",
    collectionName: "Design Notes",
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_7",
    title: "auth-context.md",
    typeId: "file",
    contentType: "FILE",
    fileSize: "4.2 KB",
    collectionName: "Context Files",
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_8",
    title: "Explain regex prompt",
    typeId: "prompt",
    contentType: "TEXT",
    description: "Prompt",
    collectionName: "Prototype Prompts",
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_9",
    title: "dashboard-mockup.png",
    typeId: "image",
    contentType: "FILE",
    fileSize: "128 KB",
    collectionName: "Screenshots",
    isFavorite: false,
    isPinned: false,
  },
];
