import raw from "@/data/courses.json";
import type { Course, CoursesData, Material, MaterialRef } from "./types";

const data = raw as CoursesData;

export function getAllCourses(): Course[] {
  return data.courses;
}

export function getCourse(id: string): Course | undefined {
  return data.courses.find((c) => c.id === id);
}

export function countMaterials(c: Course): number {
  return c.folders.reduce((acc, f) => acc + f.materials.length, 0);
}

export type SearchHit =
  | { kind: "course"; course: Course }
  | { kind: "folder"; course: Course; folderName: string }
  | { kind: "material"; course: Course; folderName: string; material: Material };

export function searchAll(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchHit[] = [];
  for (const course of data.courses) {
    if (course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q)) {
      out.push({ kind: "course", course });
    }
    for (const folder of course.folders) {
      if (folder.name.toLowerCase().includes(q)) {
        out.push({ kind: "folder", course, folderName: folder.name });
      }
      for (const material of folder.materials) {
        const hay = `${material.title} ${material.description ?? ""}`.toLowerCase();
        if (hay.includes(q)) {
          out.push({ kind: "material", course, folderName: folder.name, material });
        }
      }
    }
  }
  return out.slice(0, 40);
}

export function materialRef(
  course: Course,
  folderName: string,
  material: Material,
): MaterialRef {
  return {
    courseId: course.id,
    folder: folderName,
    url: material.url,
    title: material.title,
    type: material.type,
  };
}
