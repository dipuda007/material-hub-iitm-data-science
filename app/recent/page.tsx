"use client";

import * as React from "react";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RefList } from "@/components/ref-list";
import { getRecent, clearRecent, onStorageChange } from "@/lib/storage";
import type { MaterialRef } from "@/lib/types";

export default function RecentPage() {
  const [items, setItems] = React.useState<MaterialRef[]>([]);
  const [mounted, setMounted] = React.useState(false);

  const refresh = React.useCallback(() => setItems(getRecent()), []);

  React.useEffect(() => {
    setMounted(true);
    refresh();
    return onStorageChange(refresh);
  }, [refresh]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="History"
        title="Recently opened"
        description="The last 20 materials you've opened, sorted by most recent."
      >
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearRecent();
              toast("Cleared recents");
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </PageHeader>
      {!mounted ? (
        <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Nothing here yet"
          description="Open a material from any course and it will show up here for quick access."
        />
      ) : (
        <RefList items={items} onChange={refresh} />
      )}
    </div>
  );
}
