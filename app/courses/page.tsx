import type { Metadata } from "next";
import { getAllCourses } from "@/lib/data";
import { CourseCard } from "@/components/course-card";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses",
  description: "All IITM BS Data Science courses in one place.",
};

export default function CoursesPage() {
  const courses = getAllCourses();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Library"
        title="All courses"
        description="Every course you've added to your hub. Click a card to open its folders."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((c, i) => (
          <CourseCard key={c.id} course={c} index={i} />
        ))}
      </div>
    </div>
  );
}
