"use client";

import * as React from "react";
import Link from "next/link";
import { Star, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RefList } from "@/components/ref-list";
import { getFavorites, onStorageChange } from "@/lib/storage";
import type { MaterialRef } from "@/lib/types";

export default function FavoritesPage() {
  const [items, setItems] = React.useState<MaterialRef[]>([]);
  const [mounted, setMounted] = React.useState(false);

  const refresh = React.useCallback(() => setItems(getFavorites()), []);

  React.useEffect(() => {
    setMounted(true);
    refresh();
    return onStorageChange(refresh);
  }, [refresh]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Bookmarked"
        title="Favorites"
        description="Resources you've starred. Stored locally on this device."
      />
      {!mounted ? (
        <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Star any material to keep it handy here. Your list is saved in this browser."
          action={
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Browse courses
            </Link>
          }
        />
      ) : (
        <RefList items={items} onChange={refresh} starred />
      )}
    </div>
  );
}
