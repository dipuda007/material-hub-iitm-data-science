"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, BookOpen } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { countMaterialsInCourse } from "@/lib/data";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  typeId: string;
  course: Course;
  index?: number;
  fallbackAccent?: string;
}

export function CourseCard({ typeId, course, index = 0, fallbackAccent }: Props) {
  const Icon = getIcon(course.icon ?? "BookOpen");
  const count = countMaterialsInCourse(course);
  const accent = course.accent || fallbackAccent || "from-violet-500 to-indigo-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
    >
      <Link
        href={`/courses/${typeId}/${course.id}`}
        className="group relative block overflow-hidden rounded-xl border border-white/10 bg-card/50 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl"
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-15 blur-2xl transition-opacity group-hover:opacity-30",
            accent,
          )}
        />
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
              accent,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {course.code && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {course.code}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold leading-tight tracking-tight">
          {course.name}
        </h3>
        {course.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {course.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {count} resource{count === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1 text-foreground/80 transition-transform group-hover:translate-x-0.5">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
