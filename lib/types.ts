export type MaterialType = "pdf" | "drive" | "video" | "website";

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
}

export interface Folder {
  id: string;
  name: string;
  materials: Material[];
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  icon?: string;
  accent?: string;
  description?: string;
  folders: Folder[];
}

export interface CourseType {
  id: string;
  name: string;
  icon: string;
  accent: string;
  description?: string;
  courses: Course[];
}

export interface AppData {
  version: number;
  types: CourseType[];
}

export interface MaterialRef {
  typeId: string;
  courseId: string;
  folderId: string;
  url: string;
  title: string;
  type: MaterialType;
}
