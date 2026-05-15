export type MaterialType = "pdf" | "drive" | "video" | "website";

export interface Material {
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
}

export interface Folder {
  name: string;
  materials: Material[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  icon: string;
  accent: string;
  description: string;
  folders: Folder[];
}

export interface CoursesData {
  courses: Course[];
}

export interface MaterialRef {
  courseId: string;
  folder: string;
  url: string;
  title: string;
  type: MaterialType;
}
