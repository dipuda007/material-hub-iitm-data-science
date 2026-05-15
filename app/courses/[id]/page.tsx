import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import { getAllCourses, getCourse, countMaterials } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { FolderSection } from "@/components/folder-section";
import { cn } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourse(params.id);
  if (!course) return { title: "Course not found" };
  return {
    title: course.name,
    description: course.description,
  };
}

export default function CoursePage({ params }: Props) {
  const course = getCourse(params.id);
  if (!course) notFound();

  const Icon = getIcon(course.icon);
  const count = countMaterials(course);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All courses
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md md:p-8">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-25 blur-3xl",
            course.accent,
          )}
        />
        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              course.accent,
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {course.code}
              </span>
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
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {course.folders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
            No folders yet. Edit{" "}
            <code className="rounded bg-white/5 px-1">data/courses.json</code> to
            add some.
          </div>
        ) : (
          course.folders.map((f) => (
            <FolderSection key={f.name} course={course} folder={f} />
          ))
        )}
      </div>
    </div>
  );
}
