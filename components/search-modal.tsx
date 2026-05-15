"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, FileText, Folder, GraduationCap, ArrowRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { searchAll, type SearchHit } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: Props) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hits = React.useMemo<SearchHit[]>(() => searchAll(q), [q]);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(0, hits.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        const hit = hits[active];
        if (hit) {
          go(hit);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hits, active]);

  function go(hit: SearchHit) {
    if (hit.kind === "course") router.push(`/courses/${hit.course.id}`);
    else if (hit.kind === "folder") router.push(`/courses/${hit.course.id}#${slug(hit.folderName)}`);
    else if (hit.kind === "material") router.push(`/courses/${hit.course.id}#${slug(hit.folderName)}`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          placeholder="Search courses, folders, materials…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] sm:inline-block">
          ESC
        </kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {q.trim() === "" ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            Start typing to search across all courses and materials.
          </div>
        ) : hits.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No matches for &ldquo;{q}&rdquo;.
          </div>
        ) : (
          <ul className="space-y-1">
            {hits.map((hit, i) => {
              const Icon =
                hit.kind === "course" ? GraduationCap : hit.kind === "folder" ? Folder : FileText;
              const label =
                hit.kind === "course"
                  ? hit.course.name
                  : hit.kind === "folder"
                    ? `${hit.folderName} — ${hit.course.name}`
                    : `${hit.material.title} — ${hit.course.name}`;
              const sub =
                hit.kind === "course"
                  ? "Course"
                  : hit.kind === "folder"
                    ? "Folder"
                    : (hit.material.description ?? hit.material.type.toUpperCase());
              return (
                <li key={i}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(hit)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      active === i
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-foreground">{label}</div>
                      <div className="truncate text-xs text-muted-foreground">{sub}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export { slug as toSlug };
