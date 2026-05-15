"use client";

import * as React from "react";
import Link from "next/link";
import {
  Download,
  Library,
  LogOut,
  RotateCcw,
  Shield,
  Upload,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTree } from "@/components/admin/admin-tree";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { useAppData } from "@/lib/use-data";
import {
  countMaterialsInType,
  resetData,
  writeData,
} from "@/lib/data";
import { logout, getAdminToken } from "@/lib/auth";
import type { AppData } from "@/lib/types";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  );
}

function AdminPanel() {
  const { data, ready } = useAppData();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = React.useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalCourses = data.types.reduce((a, t) => a + t.courses.length, 0);
  const totalMaterials = data.types.reduce(
    (a, t) => a + countMaterialsInType(t),
    0,
  );

  function handleLogout() {
    logout();
    toast.success("Signed out");
    router.replace("/admin/login");
  }

  function handleExport() {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `material-hub-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported JSON");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const token = getAdminToken();
      if (!token) {
        toast.error("Not signed in");
        return;
      }
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.types)
        ) {
          throw new Error("invalid shape");
        }
        const result = await writeData(
          { version: 2, types: parsed.types },
          token,
        );
        if (result.ok) toast.success("Imported");
        else toast.error(`Import failed: ${result.error ?? "unknown"}`);
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  async function handleReset() {
    const token = getAdminToken();
    if (!token) {
      toast.error("Not signed in");
      return;
    }
    const result = await resetData(token);
    if (result.ok) toast.success("Reset to defaults");
    else toast.error(`Reset failed: ${result.error ?? "unknown"}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Shield className="h-3 w-3 text-violet-300" />
            Admin
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage your hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, rename and remove course types, courses, folders and materials.
            Changes save instantly to this browser.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Types" value={data.types.length} />
        <StatCard label="Courses" value={totalCourses} />
        <StatCard label="Resources" value={totalMaterials} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-card/40 p-3 backdrop-blur-md">
        <Library className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Data tools</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            <Upload className="h-3.5 w-3.5" />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
        </div>
      </div>

      <div className="mt-6">
        <AdminTree data={data} />
      </div>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Tip: data is stored in this browser&apos;s localStorage. Use{" "}
        <strong>Export JSON</strong> to back up, and <strong>Import JSON</strong>{" "}
        to move it to another device.
      </p>

      <ConfirmModal
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset all data to defaults?"
        description="Your current types, courses, folders and materials in this browser will be removed and replaced with the seed data."
        confirmLabel="Reset"
        onConfirm={handleReset}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/40 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
