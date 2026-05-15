"use client";

import * as React from "react";
import { ChevronDown, Folder as FolderIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialCard } from "@/components/material-card";
import { materialRef } from "@/lib/data";
import type { Course, Folder } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toSlug } from "@/components/search-modal";

interface Props {
  course: Course;
  folder: Folder;
}

export function FolderSection({ course, folder }: Props) {
  const [open, setOpen] = React.useState(true);
  const id = toSlug(folder.name);

  return (
    <section id={id} className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5">
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{folder.name}</h3>
          <p className="text-xs text-muted-foreground">
            {folder.materials.length} item{folder.materials.length === 1 ? "" : "s"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {folder.materials.length === 0 ? (
                <div className="col-span-full rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                  No materials yet.
                </div>
              ) : (
                folder.materials.map((m, i) => (
                  <MaterialCard
                    key={m.url + i}
                    material={m}
                    ref_={materialRef(course, folder.name, m)}
                    index={i}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
