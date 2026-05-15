"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { countCourses, countMaterialsInType } from "@/lib/data";
import type { CourseType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  type: CourseType;
  index?: number;
}

export function TypeCard({ type, index = 0 }: Props) {
  const Icon = getIcon(type.icon);
  const courseCount = countCourses(type);
  const matCount = countMaterialsInType(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
    >
      <Link
        href={`/courses/${type.id}`}
        className="group relative block overflow-hidden rounded-xl border border-white/10 bg-card/50 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40",
            type.accent,
          )}
        />
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
              type.accent,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <GraduationCap className="h-3 w-3" />
            {courseCount}
          </span>
        </div>

        <h3 className="mt-4 text-base font-semibold leading-tight tracking-tight">
          {type.name}
        </h3>
        {type.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {type.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {matCount} resource{matCount === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1 text-foreground/80 transition-transform group-hover:translate-x-0.5">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
