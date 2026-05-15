"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Library } from "lucide-react";
import { useAppData } from "@/lib/use-data";
import { findType, countMaterialsInType } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export default function TypePage({ params }: Props) {
  const { data, ready } = useAppData();
  const type = findType(data, params.id);

  if (!type) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All types
        </Link>
        {ready ? (
          <EmptyState
            icon={Library}
            title="Course type not found"
            description="This type may have been removed or never existed. Try the list below."
          />
        ) : (
          <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
        )}
      </div>
    );
  }

  const Icon = getIcon(type.icon);
  const matCount = countMaterialsInType(type);

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All types
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md md:p-8">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-25 blur-3xl",
            type.accent,
          )}
        />
        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              type.accent,
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>
                {type.courses.length} course
                {type.courses.length === 1 ? "" : "s"}
              </span>
              <span>·</span>
              <span>
                {matCount} resource{matCount === 1 ? "" : "s"}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {type.name}
            </h1>
            {type.description && (
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                {type.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {type.courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Sign in as admin to add your first course under this type."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {type.courses.map((c, i) => (
              <CourseCard
                key={c.id}
                typeId={type.id}
                course={c}
                fallbackAccent={type.accent}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
