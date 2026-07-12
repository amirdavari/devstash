// Shared helpers for resolving item-type metadata (icon component + lookup)
// from the mock data. Used by the sidebar and the dashboard content cards.
import {
  Code,
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  type LucideIcon,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

import { itemTypes, type ItemType } from "@/lib/mock-data";

// Maps the lucide icon names stored on ItemType.icon to their components.
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File: FileIcon,
  Image: ImageIcon,
};

export function typeIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? FileIcon;
}

// Fast lookup from a typeId (e.g. "snippet") to its full ItemType.
export const itemTypeById: Record<string, ItemType> = Object.fromEntries(
  itemTypes.map((type) => [type.id, type]),
);