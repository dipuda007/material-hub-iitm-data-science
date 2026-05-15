import seed from "@/data/courses.json";
import type {
  AppData,
  Course,
  CourseType,
  Folder,
  Material,
  MaterialRef,
} from "./types";

const SEED = seed as AppData;
const KEY = "mh:data:v2";
export const SCHEMA_VERSION = 2;

export function getSeed(): AppData {
  return JSON.parse(JSON.stringify(SEED)) as AppData;
}

export function readData(): AppData {
  if (typeof window === "undefined") return getSeed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return getSeed();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.types)) {
      return getSeed();
    }
    return parsed;
  } catch {
    return getSeed();
  }
}

export function writeData(d: AppData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ ...d, version: SCHEMA_VERSION }));
  window.dispatchEvent(new CustomEvent("mh:data"));
}

export function resetData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("mh:data"));
}

export function onDataChange(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const fn = () => handler();
  window.addEventListener("mh:data", fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener("mh:data", fn);
    window.removeEventListener("storage", fn);
  };
}

// --- selectors (operate on a passed-in AppData) ---

export function getTypes(d: AppData): CourseType[] {
  return d.types;
}

export function findType(d: AppData, typeId: string): CourseType | undefined {
  return d.types.find((t) => t.id === typeId);
}

export function findCourse(
  d: AppData,
  typeId: string,
  courseId: string,
): { type: CourseType; course: Course } | undefined {
  const type = findType(d, typeId);
  if (!type) return undefined;
  const course = type.courses.find((c) => c.id === courseId);
  if (!course) return undefined;
  return { type, course };
}

export function countCourses(t: CourseType): number {
  return t.courses.length;
}

export function countMaterialsInCourse(c: Course): number {
  return c.folders.reduce((acc, f) => acc + f.materials.length, 0);
}

export function countMaterialsInType(t: CourseType): number {
  return t.courses.reduce((acc, c) => acc + countMaterialsInCourse(c), 0);
}

export type SearchHit =
  | { kind: "type"; type: CourseType }
  | { kind: "course"; type: CourseType; course: Course }
  | { kind: "folder"; type: CourseType; course: Course; folder: Folder }
  | {
      kind: "material";
      type: CourseType;
      course: Course;
      folder: Folder;
      material: Material;
    };

export function searchAll(d: AppData, query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchHit[] = [];
  for (const type of d.types) {
    if (type.name.toLowerCase().includes(q)) {
      out.push({ kind: "type", type });
    }
    for (const course of type.courses) {
      if (
        course.name.toLowerCase().includes(q) ||
        (course.code?.toLowerCase().includes(q) ?? false)
      ) {
        out.push({ kind: "course", type, course });
      }
      for (const folder of course.folders) {
        if (folder.name.toLowerCase().includes(q)) {
          out.push({ kind: "folder", type, course, folder });
        }
        for (const material of folder.materials) {
          const hay = `${material.title} ${material.description ?? ""}`.toLowerCase();
          if (hay.includes(q)) {
            out.push({ kind: "material", type, course, folder, material });
          }
        }
      }
    }
  }
  return out.slice(0, 40);
}

export function materialRef(
  type: CourseType,
  course: Course,
  folder: Folder,
  material: Material,
): MaterialRef {
  return {
    typeId: type.id,
    courseId: course.id,
    folderId: folder.id,
    url: material.url,
    title: material.title,
    type: material.type,
  };
}
