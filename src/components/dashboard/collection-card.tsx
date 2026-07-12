import Link from "next/link";
import { Star } from "lucide-react";

import type { CollectionCardData } from "@/lib/db/collections";
import { typeIcon } from "@/lib/item-types";

// A single color-coded collection card. A thick accent-colored left border marks
// the collection's dominant type; the accent also faintly tints the background,
// and the footer badges show the type breakdown of what's inside.
export function CollectionCard({
  collection,
}: {
  collection: CollectionCardData;
}) {
  const { accentColor: accent } = collection;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex min-h-28 flex-col justify-between gap-4 rounded-xl border border-l-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderLeftColor: accent,
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
          const Icon = typeIcon(entry.icon);
          return (
            <span
              key={entry.typeId}
              className="text-caption inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
              style={{
                color: entry.color,
                backgroundColor: `color-mix(in oklab, ${entry.color} 15%, transparent)`,
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