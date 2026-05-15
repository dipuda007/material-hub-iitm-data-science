"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  Film,
  Globe,
  HardDrive,
  Star,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { Material, MaterialType, MaterialRef } from "@/lib/types";
import { canEmbed } from "@/lib/drive";
import {
  isFavorite,
  toggleFavorite,
  pushRecent,
  onStorageChange,
} from "@/lib/storage";
import { EmbedViewer } from "@/components/embed-viewer";
import { cn } from "@/lib/utils";

const typeMeta: Record<
  MaterialType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pdf: { label: "PDF", icon: FileText, color: "bg-red-500/15 text-red-300 border-red-500/20" },
  drive: {
    label: "Drive",
    icon: HardDrive,
    color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  },
  video: { label: "Video", icon: Film, color: "bg-pink-500/15 text-pink-300 border-pink-500/20" },
  website: {
    label: "Website",
    icon: Globe,
    color: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  },
};

interface Props {
  material: Material;
  ref_: MaterialRef;
  index?: number;
}

export function MaterialCard({ material, ref_, index = 0 }: Props) {
  const meta = typeMeta[material.type];
  const Icon = meta.icon;
  const [fav, setFav] = React.useState(false);
  const [viewer, setViewer] = React.useState(false);

  React.useEffect(() => {
    setFav(isFavorite(material.url));
    return onStorageChange(() => setFav(isFavorite(material.url)));
  }, [material.url]);

  function open() {
    pushRecent(ref_);
    window.open(material.url, "_blank", "noopener,noreferrer");
  }

  function preview() {
    pushRecent(ref_);
    setViewer(true);
  }

  function star(e: React.MouseEvent) {
    e.stopPropagation();
    const added = toggleFavorite(ref_);
    setFav(added);
    toast(added ? "Added to favorites" : "Removed from favorites");
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        className="group relative flex flex-col rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
              meta.color,
            )}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
          <button
            type="button"
            onClick={star}
            aria-label={fav ? "Unstar" : "Star"}
            className={cn(
              "rounded-md p-1 transition-colors",
              fav
                ? "text-yellow-400"
                : "text-muted-foreground opacity-0 hover:text-yellow-400 group-hover:opacity-100",
            )}
          >
            <Star className={cn("h-4 w-4", fav && "fill-yellow-400")} />
          </button>
        </div>

        <h4 className="mt-3 text-sm font-semibold leading-snug">{material.title}</h4>
        {material.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {material.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          {canEmbed(material) && (
            <button
              type="button"
              onClick={preview}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-white/10"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          )}
          <button
            type="button"
            onClick={open}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            Open
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      <EmbedViewer
        open={viewer}
        onOpenChange={setViewer}
        material={material}
      />
    </>
  );
}
