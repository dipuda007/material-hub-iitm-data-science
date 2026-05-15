"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Star, Eye, FileText, Film, HardDrive, Globe } from "lucide-react";
import { toast } from "sonner";
import type { MaterialRef, MaterialType } from "@/lib/types";
import { toggleFavorite, pushRecent } from "@/lib/storage";
import { canEmbed } from "@/lib/drive";
import { EmbedViewer } from "@/components/embed-viewer";
import { useAppData } from "@/lib/use-data";
import { findCourse } from "@/lib/data";
import { cn } from "@/lib/utils";

const typeIcon: Record<MaterialType, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  drive: HardDrive,
  video: Film,
  website: Globe,
};

const typeColor: Record<MaterialType, string> = {
  pdf: "text-red-300",
  drive: "text-yellow-300",
  video: "text-pink-300",
  website: "text-sky-300",
};

interface Props {
  items: MaterialRef[];
  onChange?: () => void;
  starred?: boolean;
}

export function RefList({ items, onChange, starred }: Props) {
  const [viewer, setViewer] = React.useState<MaterialRef | null>(null);
  const { data } = useAppData();

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-card/40 backdrop-blur-md">
        {items.map((m, i) => {
          const Icon = typeIcon[m.type];
          const found = findCourse(data, m.typeId, m.courseId);
          const courseName = found?.course.name ?? m.courseId;
          const folder = found?.course.folders.find((f) => f.id === m.folderId);
          const folderName = folder?.name ?? m.folderId;
          return (
            <li
              key={m.url + i}
              className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <Icon className={cn("h-4 w-4 shrink-0", typeColor[m.type])} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.title}</div>
                <div className="truncate text-xs text-muted-foreground">
                  <Link
                    href={`/courses/${m.typeId}/${m.courseId}`}
                    className="hover:text-foreground"
                  >
                    {courseName} · {folderName}
                  </Link>{" "}
                  · {m.type.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {canEmbed({ id: "", title: m.title, type: m.type, url: m.url }) && (
                  <button
                    type="button"
                    onClick={() => {
                      pushRecent(m);
                      setViewer(m);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    aria-label="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                )}
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => pushRecent(m)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  aria-label="Open"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {starred && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite(m);
                      onChange?.();
                      toast("Removed from favorites");
                    }}
                    className="rounded-md p-1.5 text-yellow-400 hover:bg-white/5"
                    aria-label="Unstar"
                  >
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {viewer && (
        <EmbedViewer
          open={!!viewer}
          onOpenChange={(v) => !v && setViewer(null)}
          material={{
            id: "",
            title: viewer.title,
            type: viewer.type,
            url: viewer.url,
          }}
        />
      )}
    </>
  );
}
