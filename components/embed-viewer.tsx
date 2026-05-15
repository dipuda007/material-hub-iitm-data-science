"use client";

import { ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { Material } from "@/lib/types";
import { getEmbedUrl } from "@/lib/drive";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  material: Material;
}

export function EmbedViewer({ open, onOpenChange, material }: Props) {
  const src = getEmbedUrl(material);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-5xl">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{material.title}</h3>
          {material.description && (
            <p className="truncate text-xs text-muted-foreground">
              {material.description}
            </p>
          )}
        </div>
        <a
          href={material.url}
          target="_blank"
          rel="noreferrer"
          className="mr-8 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium hover:bg-white/10"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-b-xl bg-black">
        <iframe
          src={src}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          title={material.title}
        />
      </div>
    </Dialog>
  );
}
