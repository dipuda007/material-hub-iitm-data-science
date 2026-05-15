"use client";

import { useAppData } from "@/lib/use-data";
import { TypeCard } from "@/components/type-card";
import { PageHeader } from "@/components/page-header";

export default function CoursesPage() {
  const { data } = useAppData();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Library"
        title="Course types"
        description="Pick a category to see the courses you've added. Sign in as admin to add new types."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.types.map((t, i) => (
          <TypeCard key={t.id} type={t} index={i} />
        ))}
      </div>
    </div>
  );
}
