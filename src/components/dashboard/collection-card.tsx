import Link from "next/link";
import { Star } from "lucide-react";

import type { Collection } from "@/lib/mock-data";
import { itemTypeById, typeIcon } from "@/lib/item-types";

// A single color-coded collection card. Accent tints the border and background;
// the footer badges show the type breakdown of what's inside.
export function CollectionCard({ collection }: { collection: Collection }) {
  const { accentColor: accent } = collection;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex min-h-28 flex-col justify-between gap-4 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`,
        background: `color-mix(in oklab, ${accent} 7%, var(--card))`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-card-title truncate">{collection.name}</h3>
          <p className="text-meta mt-0.5 text-muted-foreground">
            {collection.itemCount} items
          </p>
        </div>
        {collection.isFavorite && (
          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {collection.breakdown.map((entry) => {
          const type = itemTypeById[entry.typeId];
          if (!type) return null;
          const Icon = typeIcon(type.icon);
          return (
            <span
              key={entry.typeId}
              className="text-caption inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
              style={{
                color: type.color,
                backgroundColor: `color-mix(in oklab, ${type.color} 15%, transparent)`,
              }}
            >
              <Icon className="size-3" />
              {entry.count}
            </span>
          );
        })}
      </div>
    </Link>
  );
}