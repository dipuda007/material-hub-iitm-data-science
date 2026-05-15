"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, FolderOpen } from "lucide-react";
import { useAppData } from "@/lib/use-data";
import { findCourse, countMaterialsInCourse } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { FolderSection } from "@/components/folder-section";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface Props {
  params: { id: string; courseId: string };
}

export default function CourseDetailPage({ params }: Props) {
  const { data, ready } = useAppData();
  const found = findCourse(data, params.id, params.courseId);

  if (!found) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/courses/${params.id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        {ready ? (
          <EmptyState
            icon={BookOpen}
            title="Course not found"
            description="This course may have been removed or never existed."
          />
        ) : (
          <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
        )}
      </div>
    );
  }

  const { type, course } = found;
  const Icon = getIcon(course.icon ?? type.icon);
  const accent = course.accent || type.accent;
  const count = countMaterialsInCourse(course);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/courses/${type.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {type.name}
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md md:p-8">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-25 blur-3xl",
            accent,
          )}
        />
        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              accent,
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {course.code && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {course.code}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <FileText className="h-3 w-3" />
                {count} resource{count === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                {course.folders.length} folder
                {course.folders.length === 1 ? "" : "s"}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {course.name}
            </h1>
            {course.description && (
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                {course.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {course.folders.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No folders yet"
            description="Sign in as admin and add folders and materials to this course."
          />
        ) : (
          course.folders.map((f) => (
            <FolderSection
              key={f.id}
              type={type}
              course={course}
              folder={f}
            />
          ))
        )}
      </div>
    </div>
  );
}
