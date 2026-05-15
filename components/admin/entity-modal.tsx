"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { ICON_OPTIONS, ACCENT_OPTIONS, getIcon } from "@/lib/icons";
import { detectType } from "@/lib/drive";
import type { MaterialType } from "@/lib/types";
import { cn } from "@/lib/utils";

export type EntityKind = "type" | "course" | "folder" | "material";

export interface EntityValues {
  name: string;
  description?: string;
  code?: string;
  icon?: string;
  accent?: string;
  url?: string;
  type?: MaterialType;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: EntityKind;
  mode: "create" | "edit";
  initial?: Partial<EntityValues>;
  onSave: (values: EntityValues) => void;
}

const TITLES: Record<EntityKind, { create: string; edit: string }> = {
  type: { create: "Add course type", edit: "Edit course type" },
  course: { create: "Add course", edit: "Edit course" },
  folder: { create: "Add folder", edit: "Edit folder" },
  material: { create: "Add material", edit: "Edit material" },
};

export function EntityModal({
  open,
  onOpenChange,
  kind,
  mode,
  initial,
  onSave,
}: Props) {
  const [values, setValues] = React.useState<EntityValues>({
    name: "",
    description: "",
    code: "",
    icon: "FileText",
    accent: ACCENT_OPTIONS[0],
    url: "",
    type: "website",
  });

  React.useEffect(() => {
    if (open) {
      setValues({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        code: initial?.code ?? "",
        icon: initial?.icon ?? (kind === "type" ? "GraduationCap" : "BookOpen"),
        accent: initial?.accent ?? ACCENT_OPTIONS[0],
        url: initial?.url ?? "",
        type: initial?.type ?? "website",
      });
    }
  }, [open, initial, kind]);

  function setField<K extends keyof EntityValues>(k: K, v: EntityValues[K]) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;
    if (kind === "material" && !values.url?.trim()) return;
    onSave(values);
    onOpenChange(false);
  }

  function autoDetectType() {
    if (kind !== "material" || !values.url) return;
    setField("type", detectType(values.url, values.type ?? "website"));
  }

  const showIcon = kind === "type" || kind === "course";
  const showAccent = kind === "type" || kind === "course";
  const showCode = kind === "course";
  const showDescription = kind === "type" || kind === "course" || kind === "material";
  const showUrlAndType = kind === "material";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold">{TITLES[kind][mode]}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {kind === "type" && "A group like Foundation, BSc, NPTEL, etc."}
            {kind === "course" && "A course belonging to the current type."}
            {kind === "folder" && "A folder inside this course (e.g. Week 1, PYQs)."}
            {kind === "material" && "A link to a PDF, Drive file, video or website."}
          </p>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4">
          <Field label="Name" required>
            <input
              type="text"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder={
                kind === "type"
                  ? "e.g. Foundation"
                  : kind === "course"
                    ? "e.g. Statistics"
                    : kind === "folder"
                      ? "e.g. Week 1"
                      : "e.g. Lecture Notes"
              }
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-white/20 focus:bg-white/[0.07]"
              required
              autoFocus
            />
          </Field>

          {showCode && (
            <Field label="Short code (optional)">
              <input
                type="text"
                value={values.code ?? ""}
                onChange={(e) => setField("code", e.target.value)}
                placeholder="e.g. STAT"
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20 focus:bg-white/[0.07]"
              />
            </Field>
          )}

          {showDescription && (
            <Field label="Description (optional)">
              <textarea
                value={values.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                rows={2}
                placeholder="Short summary"
                className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20 focus:bg-white/[0.07]"
              />
            </Field>
          )}

          {showUrlAndType && (
            <>
              <Field label="URL" required>
                <input
                  type="url"
                  value={values.url ?? ""}
                  onChange={(e) => setField("url", e.target.value)}
                  onBlur={autoDetectType}
                  placeholder="https://drive.google.com/file/d/…"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-white/20 focus:bg-white/[0.07]"
                  required
                />
              </Field>
              <Field label="Type">
                <div className="grid grid-cols-4 gap-2">
                  {(["pdf", "drive", "video", "website"] as MaterialType[]).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setField("type", t)}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                          values.type === t
                            ? "border-white/30 bg-white/10 text-foreground"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                        )}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </Field>
            </>
          )}

          {showIcon && (
            <Field label="Icon">
              <div className="grid grid-cols-8 gap-1.5">
                {ICON_OPTIONS.map((name) => {
                  const Icon = getIcon(name);
                  const active = values.icon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setField("icon", name)}
                      title={name}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-md border transition-colors",
                        active
                          ? "border-white/30 bg-white/15 text-foreground"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          {showAccent && (
            <Field label="Color">
              <div className="grid grid-cols-6 gap-2">
                {ACCENT_OPTIONS.map((accent) => {
                  const active = values.accent === accent;
                  return (
                    <button
                      key={accent}
                      type="button"
                      onClick={() => setField("accent", accent)}
                      className={cn(
                        "h-8 rounded-md bg-gradient-to-br ring-offset-2 ring-offset-card transition-all",
                        accent,
                        active
                          ? "scale-105 ring-2 ring-white/60"
                          : "opacity-80 hover:opacity-100",
                      )}
                      aria-label={accent}
                    />
                  );
                })}
              </div>
            </Field>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02]"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}
