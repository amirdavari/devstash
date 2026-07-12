import { createElement } from "react";
import { Pin, Star } from "lucide-react";

import type { Item } from "@/lib/mock-data";
import { itemTypeById, typeIcon } from "@/lib/item-types";

// A single recent-item card. The left edge is colored by the item's type; the
// meta line combines the item's primary detail (language / host / size) with
// its collection.
export function ItemCard({ item }: { item: Item }) {
  const type = itemTypeById[item.typeId];
  const color = type?.color ?? "#6b7280";

  const primary = item.language ?? item.description ?? item.fileSize;
  const meta = [primary, item.collectionName].filter(Boolean).join(" · ");

  return (
    <div
      className="group flex flex-col gap-3 rounded-xl border border-l-[3px] bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex size-6 items-center justify-center rounded-md"
            style={{
              color,
              backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`,
            }}
          >
            {/* Render the dynamically-selected icon without binding a
                component in render scope (react-hooks/static-components). */}
            {createElement(typeIcon(type?.icon ?? "File"), {
              className: "size-3.5",
            })}
          </span>
          <span
            className="text-caption tracking-[0.04em] uppercase"
            style={{ color }}
          >
            {type?.name ?? "item"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {item.isPinned && <Pin className="size-3.5" />}
          {item.isFavorite && (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-card-title">{item.title}</h3>
        {meta && (
          <p className="text-meta font-mono text-muted-foreground">{meta}</p>
        )}
      </div>
    </div>
  );
}