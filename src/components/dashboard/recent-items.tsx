"use client";

import { useState } from "react";

import { recentItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/dashboard/item-card";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pinned", label: "Pinned" },
  { key: "favorites", label: "Favorites" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function RecentItems() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const items = recentItems
    .filter((item) => {
      if (filter === "pinned") return item.isPinned;
      if (filter === "favorites") return item.isFavorite;
      return true;
    })
    .slice(0, 10);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-section-title">Recent items</h2>
        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
          {FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === option.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-body text-muted-foreground">
          No items match this filter.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}