"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Search,
  Star,
  Folder,
  Zap,
  GraduationCap,
} from "lucide-react";
import { useAppData } from "@/lib/use-data";
import { countMaterialsInType } from "@/lib/data";
import { TypeCard } from "@/components/type-card";

export default function HomePage() {
  const { data } = useAppData();
  const types = data.types;
  const totalCourses = types.reduce((acc, t) => acc + t.courses.length, 0);
  const totalMaterials = types.reduce(
    (acc, t) => acc + countMaterialsInType(t),
    0,
  );

  const features = [
    {
      icon: Folder,
      title: "Type → Course → Folder",
      desc: "Group by Foundation, Diploma, BSc, BS, NPTEL — or any type you create.",
    },
    {
      icon: Search,
      title: "Instant search",
      desc: "Hit ⌘K to fuzzy-search across every type, course and resource.",
    },
    {
      icon: Star,
      title: "Favorites & recents",
      desc: "Star resources you keep returning to. Stored locally on your device.",
    },
    {
      icon: Zap,
      title: "Embedded previews",
      desc: "Open PDFs, Drive files and YouTube videos inside the app.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-fuchsia-500/10 px-6 py-14 md:px-12 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-violet-300" />
            IITM BS Data Science · Personal Hub
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-gradient">Material Hub IITM</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Organize IITM BS Data Science study resources beautifully.
            Notes, PDFs, Drive links and videos — calmly arranged in one place.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-[1.02]"
            >
              <GraduationCap className="h-4 w-4" />
              Browse types
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            <Stat label="Types" value={types.length} />
            <Stat label="Courses" value={totalCourses} />
            <Stat label="Resources" value={totalMaterials} />
          </dl>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Why you&apos;ll like it
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              A calm, fast place to study
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/40 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/20"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Jump in
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Course types</h2>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <TypeCard key={t.id} type={t} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}
