"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Command, Github } from "lucide-react";
import { SearchModal } from "@/components/search-modal";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-black/40 px-4 backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <span className="text-base font-semibold tracking-tight">
            Material Hub
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group ml-auto flex w-full max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 md:ml-0"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search courses, materials…</span>
          <kbd className="hidden items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium md:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground md:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </header>

      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}
