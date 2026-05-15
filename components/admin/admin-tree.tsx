"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  Film,
  Folder as FolderIcon,
  Globe,
  GraduationCap,
  HardDrive,
  Library,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type {
  AppData,
  Course,
  CourseType,
  Folder,
  Material,
  MaterialType,
} from "@/lib/types";
import { getIcon } from "@/lib/icons";
import { writeData } from "@/lib/data";
import { getAdminToken } from "@/lib/auth";
import { newId, uniqueSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import {
  EntityModal,
  type EntityKind,
  type EntityValues,
} from "@/components/admin/entity-modal";
import { ConfirmModal } from "@/components/admin/confirm-modal";

interface Props {
  data: AppData;
}

interface EditTarget {
  kind: EntityKind;
  mode: "create" | "edit";
  parentType?: string;
  parentCourse?: string;
  parentFolder?: string;
  editingId?: string;
  initial?: Partial<EntityValues>;
}

interface DeleteTarget {
  kind: EntityKind;
  typeId?: string;
  courseId?: string;
  folderId?: string;
  materialId?: string;
  name: string;
}

const matIcon: Record<MaterialType, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  drive: HardDrive,
  video: Film,
  website: Globe,
};
const matColor: Record<MaterialType, string> = {
  pdf: "text-red-300",
  drive: "text-yellow-300",
  video: "text-pink-300",
  website: "text-sky-300",
};

export function AdminTree({ data }: Props) {
  const [openTypes, setOpenTypes] = React.useState<Record<string, boolean>>({});
  const [openCourses, setOpenCourses] = React.useState<Record<string, boolean>>(
    {},
  );
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>(
    {},
  );
  const [editTarget, setEditTarget] = React.useState<EditTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(
    null,
  );

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    key: string,
  ) => setter((s) => ({ ...s, [key]: !s[key] }));

  // --- mutations ---

  async function update(
    mut: (d: AppData) => void,
    successMsg?: string,
  ): Promise<boolean> {
    const token = getAdminToken();
    if (!token) {
      toast.error("Not signed in");
      return false;
    }
    const next: AppData = JSON.parse(JSON.stringify(data));
    mut(next);
    const result = await writeData(next, token);
    if (!result.ok) {
      toast.error(`Save failed: ${result.error ?? "unknown error"}`);
      return false;
    }
    if (successMsg) toast.success(successMsg);
    return true;
  }

  async function onSave(values: EntityValues) {
    if (!editTarget) return;
    const t = editTarget;
    let successMsg = "Saved";

    if (t.kind === "type") {
      await update((d) => {
        if (t.mode === "create") {
          const id = uniqueSlug(
            values.name,
            d.types.map((x) => x.id),
          );
          d.types.push({
            id,
            name: values.name.trim(),
            icon: values.icon ?? "GraduationCap",
            accent: values.accent ?? "from-violet-500 to-indigo-500",
            description: values.description?.trim() || undefined,
            courses: [],
          });
          successMsg = `Added type "${values.name}"`;
        } else if (t.editingId) {
          const type = d.types.find((x) => x.id === t.editingId);
          if (type) {
            type.name = values.name.trim();
            type.icon = values.icon ?? type.icon;
            type.accent = values.accent ?? type.accent;
            type.description = values.description?.trim() || undefined;
          }
        }
      }, successMsg);
    } else if (t.kind === "course") {
      await update((d) => {
        const type = d.types.find((x) => x.id === t.parentType);
        if (!type) return;
        if (t.mode === "create") {
          const id = uniqueSlug(
            values.name,
            type.courses.map((x) => x.id),
          );
          type.courses.push({
            id,
            name: values.name.trim(),
            code: values.code?.trim() || undefined,
            icon: values.icon ?? "BookOpen",
            accent: values.accent ?? type.accent,
            description: values.description?.trim() || undefined,
            folders: [],
          });
          successMsg = `Added course "${values.name}"`;
        } else if (t.editingId) {
          const course = type.courses.find((x) => x.id === t.editingId);
          if (course) {
            course.name = values.name.trim();
            course.code = values.code?.trim() || undefined;
            course.icon = values.icon ?? course.icon;
            course.accent = values.accent ?? course.accent;
            course.description = values.description?.trim() || undefined;
          }
        }
      }, successMsg);
    } else if (t.kind === "folder") {
      await update((d) => {
        const type = d.types.find((x) => x.id === t.parentType);
        const course = type?.courses.find((x) => x.id === t.parentCourse);
        if (!course) return;
        if (t.mode === "create") {
          const id = uniqueSlug(
            values.name,
            course.folders.map((x) => x.id),
          );
          course.folders.push({
            id,
            name: values.name.trim(),
            materials: [],
          });
          successMsg = `Added folder "${values.name}"`;
        } else if (t.editingId) {
          const folder = course.folders.find((x) => x.id === t.editingId);
          if (folder) folder.name = values.name.trim();
        }
      }, successMsg);
    } else if (t.kind === "material") {
      await update((d) => {
        const type = d.types.find((x) => x.id === t.parentType);
        const course = type?.courses.find((x) => x.id === t.parentCourse);
        const folder = course?.folders.find((x) => x.id === t.parentFolder);
        if (!folder) return;
        if (t.mode === "create") {
          folder.materials.push({
            id: newId(),
            title: values.name.trim(),
            description: values.description?.trim() || undefined,
            type: values.type ?? "website",
            url: (values.url ?? "").trim(),
          });
          successMsg = `Added "${values.name}"`;
        } else if (t.editingId) {
          const mat = folder.materials.find((x) => x.id === t.editingId);
          if (mat) {
            mat.title = values.name.trim();
            mat.description = values.description?.trim() || undefined;
            mat.type = values.type ?? mat.type;
            mat.url = (values.url ?? "").trim();
          }
        }
      }, successMsg);
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    const t = deleteTarget;
    await update((d) => {
      if (t.kind === "type") {
        d.types = d.types.filter((x) => x.id !== t.typeId);
      } else if (t.kind === "course") {
        const type = d.types.find((x) => x.id === t.typeId);
        if (type) type.courses = type.courses.filter((c) => c.id !== t.courseId);
      } else if (t.kind === "folder") {
        const type = d.types.find((x) => x.id === t.typeId);
        const course = type?.courses.find((c) => c.id === t.courseId);
        if (course)
          course.folders = course.folders.filter((f) => f.id !== t.folderId);
      } else if (t.kind === "material") {
        const type = d.types.find((x) => x.id === t.typeId);
        const course = type?.courses.find((c) => c.id === t.courseId);
        const folder = course?.folders.find((f) => f.id === t.folderId);
        if (folder)
          folder.materials = folder.materials.filter(
            (m) => m.id !== t.materialId,
          );
      }
    }, `Deleted "${t.name}"`);
  }

  // --- render ---

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Content tree
        </h2>
        <button
          type="button"
          onClick={() =>
            setEditTarget({ kind: "type", mode: "create" })
          }
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add course type
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {data.types.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
            No course types yet. Add your first one above.
          </div>
        )}

        {data.types.map((t) => (
          <TypeRow
            key={t.id}
            type={t}
            open={openTypes[t.id] ?? false}
            onToggle={() => toggle(setOpenTypes, t.id)}
            openCourses={openCourses}
            openFolders={openFolders}
            onToggleCourse={(courseId) =>
              toggle(setOpenCourses, `${t.id}/${courseId}`)
            }
            onToggleFolder={(courseId, folderId) =>
              toggle(setOpenFolders, `${t.id}/${courseId}/${folderId}`)
            }
            onEdit={(target) => setEditTarget(target)}
            onDelete={(target) => setDeleteTarget(target)}
          />
        ))}
      </div>

      {editTarget && (
        <EntityModal
          open={!!editTarget}
          onOpenChange={(v) => !v && setEditTarget(null)}
          kind={editTarget.kind}
          mode={editTarget.mode}
          initial={editTarget.initial}
          onSave={onSave}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
          title={`Delete ${deleteTarget.kind} "${deleteTarget.name}"?`}
          description="This cannot be undone. Children inside will also be removed."
          onConfirm={onDelete}
        />
      )}
    </>
  );
}

// --- nested row components ---

function TypeRow({
  type,
  open,
  onToggle,
  openCourses,
  openFolders,
  onToggleCourse,
  onToggleFolder,
  onEdit,
  onDelete,
}: {
  type: CourseType;
  open: boolean;
  onToggle: () => void;
  openCourses: Record<string, boolean>;
  openFolders: Record<string, boolean>;
  onToggleCourse: (courseId: string) => void;
  onToggleFolder: (courseId: string, folderId: string) => void;
  onEdit: (t: EditTarget) => void;
  onDelete: (t: DeleteTarget) => void;
}) {
  const Icon = getIcon(type.icon);
  const Caret = open ? ChevronDown : ChevronRight;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-card/40 backdrop-blur-md">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <Caret className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-white",
              type.accent,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{type.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {type.courses.length} course
              {type.courses.length === 1 ? "" : "s"}
            </div>
          </div>
        </button>
        <RowActions
          onAdd={() =>
            onEdit({ kind: "course", mode: "create", parentType: type.id })
          }
          addLabel="Add course"
          onEdit={() =>
            onEdit({
              kind: "type",
              mode: "edit",
              editingId: type.id,
              initial: {
                name: type.name,
                description: type.description,
                icon: type.icon,
                accent: type.accent,
              },
            })
          }
          onDelete={() =>
            onDelete({ kind: "type", typeId: type.id, name: type.name })
          }
        />
      </div>

      {open && (
        <div className="border-t border-white/5 bg-black/20 px-3 py-2">
          {type.courses.length === 0 ? (
            <div className="px-2 py-3 text-xs text-muted-foreground">
              No courses yet.{" "}
              <button
                type="button"
                className="text-foreground underline-offset-2 hover:underline"
                onClick={() =>
                  onEdit({
                    kind: "course",
                    mode: "create",
                    parentType: type.id,
                  })
                }
              >
                Add the first one
              </button>
              .
            </div>
          ) : (
            <div className="space-y-1.5">
              {type.courses.map((course) => (
                <CourseRow
                  key={course.id}
                  typeId={type.id}
                  course={course}
                  open={openCourses[`${type.id}/${course.id}`] ?? false}
                  onToggle={() => onToggleCourse(course.id)}
                  openFolders={openFolders}
                  onToggleFolder={(folderId) =>
                    onToggleFolder(course.id, folderId)
                  }
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CourseRow({
  typeId,
  course,
  open,
  onToggle,
  openFolders,
  onToggleFolder,
  onEdit,
  onDelete,
}: {
  typeId: string;
  course: Course;
  open: boolean;
  onToggle: () => void;
  openFolders: Record<string, boolean>;
  onToggleFolder: (folderId: string) => void;
  onEdit: (t: EditTarget) => void;
  onDelete: (t: DeleteTarget) => void;
}) {
  const Icon = getIcon(course.icon ?? "BookOpen");
  const Caret = open ? ChevronDown : ChevronRight;
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <Caret className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">{course.name}</div>
            <div className="truncate text-[10px] text-muted-foreground">
              {course.folders.length} folder
              {course.folders.length === 1 ? "" : "s"}
              {course.code && ` · ${course.code}`}
            </div>
          </div>
        </button>
        <RowActions
          size="sm"
          onAdd={() =>
            onEdit({
              kind: "folder",
              mode: "create",
              parentType: typeId,
              parentCourse: course.id,
            })
          }
          addLabel="Add folder"
          onEdit={() =>
            onEdit({
              kind: "course",
              mode: "edit",
              parentType: typeId,
              editingId: course.id,
              initial: {
                name: course.name,
                code: course.code,
                description: course.description,
                icon: course.icon,
                accent: course.accent,
              },
            })
          }
          onDelete={() =>
            onDelete({
              kind: "course",
              typeId,
              courseId: course.id,
              name: course.name,
            })
          }
        />
      </div>

      {open && (
        <div className="border-t border-white/5 px-2.5 py-2">
          {course.folders.length === 0 ? (
            <div className="px-1 py-2 text-[11px] text-muted-foreground">
              No folders yet.{" "}
              <button
                type="button"
                className="text-foreground underline-offset-2 hover:underline"
                onClick={() =>
                  onEdit({
                    kind: "folder",
                    mode: "create",
                    parentType: typeId,
                    parentCourse: course.id,
                  })
                }
              >
                Add the first one
              </button>
              .
            </div>
          ) : (
            <div className="space-y-1">
              {course.folders.map((folder) => (
                <FolderRow
                  key={folder.id}
                  typeId={typeId}
                  courseId={course.id}
                  folder={folder}
                  open={
                    openFolders[`${typeId}/${course.id}/${folder.id}`] ?? false
                  }
                  onToggle={() => onToggleFolder(folder.id)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FolderRow({
  typeId,
  courseId,
  folder,
  open,
  onToggle,
  onEdit,
  onDelete,
}: {
  typeId: string;
  courseId: string;
  folder: Folder;
  open: boolean;
  onToggle: () => void;
  onEdit: (t: EditTarget) => void;
  onDelete: (t: DeleteTarget) => void;
}) {
  const Caret = open ? ChevronDown : ChevronRight;
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <Caret className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <FolderIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium">{folder.name}</div>
            <div className="truncate text-[10px] text-muted-foreground">
              {folder.materials.length} item
              {folder.materials.length === 1 ? "" : "s"}
            </div>
          </div>
        </button>
        <RowActions
          size="sm"
          onAdd={() =>
            onEdit({
              kind: "material",
              mode: "create",
              parentType: typeId,
              parentCourse: courseId,
              parentFolder: folder.id,
            })
          }
          addLabel="Add material"
          onEdit={() =>
            onEdit({
              kind: "folder",
              mode: "edit",
              parentType: typeId,
              parentCourse: courseId,
              editingId: folder.id,
              initial: { name: folder.name },
            })
          }
          onDelete={() =>
            onDelete({
              kind: "folder",
              typeId,
              courseId,
              folderId: folder.id,
              name: folder.name,
            })
          }
        />
      </div>
      {open && (
        <div className="border-t border-white/5 px-2 py-1.5">
          {folder.materials.length === 0 ? (
            <div className="px-1 py-1.5 text-[11px] text-muted-foreground">
              No materials yet.{" "}
              <button
                type="button"
                className="text-foreground underline-offset-2 hover:underline"
                onClick={() =>
                  onEdit({
                    kind: "material",
                    mode: "create",
                    parentType: typeId,
                    parentCourse: courseId,
                    parentFolder: folder.id,
                  })
                }
              >
                Add the first one
              </button>
              .
            </div>
          ) : (
            <div className="space-y-0.5">
              {folder.materials.map((m) => (
                <MaterialRow
                  key={m.id}
                  material={m}
                  onEdit={() =>
                    onEdit({
                      kind: "material",
                      mode: "edit",
                      parentType: typeId,
                      parentCourse: courseId,
                      parentFolder: folder.id,
                      editingId: m.id,
                      initial: {
                        name: m.title,
                        description: m.description,
                        type: m.type,
                        url: m.url,
                      },
                    })
                  }
                  onDelete={() =>
                    onDelete({
                      kind: "material",
                      typeId,
                      courseId,
                      folderId: folder.id,
                      materialId: m.id,
                      name: m.title,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MaterialRow({
  material,
  onEdit,
  onDelete,
}: {
  material: Material;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = matIcon[material.type];
  return (
    <div className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/[0.04]">
      <Icon className={cn("h-3.5 w-3.5 shrink-0", matColor[material.type])} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px]">{material.title}</div>
        <div className="truncate text-[10px] text-muted-foreground">
          {material.type.toUpperCase()} · {material.url}
        </div>
      </div>
      <a
        href={material.url}
        target="_blank"
        rel="noreferrer"
        className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-white/5 hover:text-foreground group-hover:opacity-100"
        aria-label="Open"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
      <button
        type="button"
        onClick={onEdit}
        className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-white/5 hover:text-foreground group-hover:opacity-100"
        aria-label="Edit"
      >
        <Edit3 className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
        aria-label="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

function RowActions({
  onAdd,
  addLabel,
  onEdit,
  onDelete,
  size = "md",
}: {
  onAdd: () => void;
  addLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  size?: "md" | "sm";
}) {
  const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const pad = size === "sm" ? "p-1" : "p-1.5";
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={onAdd}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium hover:bg-white/10",
        )}
        title={addLabel}
      >
        <Plus className={icon} />
        <span className="hidden sm:inline">Add</span>
      </button>
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground",
          pad,
        )}
        aria-label="Edit"
      >
        <Edit3 className={icon} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={cn(
          "rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-300",
          pad,
        )}
        aria-label="Delete"
      >
        <Trash2 className={icon} />
      </button>
    </div>
  );
}
