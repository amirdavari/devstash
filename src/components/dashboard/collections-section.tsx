import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { collections } from "@/lib/mock-data";
import { CollectionCard } from "@/components/dashboard/collection-card";

export function CollectionsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">Collections</h2>
        <Link
          href="/collections"
          className="text-body flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}