"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { tryLogin, isAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin()) router.replace("/admin");
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      if (tryLogin(user.trim(), pass)) {
        toast.success("Welcome back, admin");
        router.replace("/admin");
      } else {
        setError("Invalid username or password.");
        setSubmitting(false);
      }
    }, 300);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back home
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl"
        />
        <div className="relative">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-indigo-500/30">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin sign-in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to manage course types, courses, folders and
            materials.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <Field label="Username">
              <input
                type="text"
                autoComplete="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="username"
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-white/20 focus:bg-white/[0.07]"
                required
              />
            </Field>
            <Field label="Password">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-white/20 focus:bg-white/[0.07]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-[1.01] disabled:opacity-60",
              )}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Soft client-side gate. Nothing sensitive is stored here.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
