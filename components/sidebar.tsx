"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  GraduationCap,
  Star,
  Clock,
  Info,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/recent", label: "Recent", icon: Clock },
  { href: "/about", label: "About", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("mh:sidebar");
    if (stored === "1") setCollapsed(true);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("mh:sidebar", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-black/30 backdrop-blur-xl md:flex transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              Material Hub
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {active && (
                <span className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="m-3 rounded-lg border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">IITM BS DS</p>
          <p className="mt-1 leading-snug">
            Your personal study hub. Edit{" "}
            <code className="rounded bg-white/10 px-1">data/courses.json</code>{" "}
            to add content.
          </p>
        </div>
      )}
    </aside>
  );
}
