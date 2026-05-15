import {
  Sigma,
  BarChart3,
  Cpu,
  Code2,
  Database,
  Brain,
  Briefcase,
  Coffee,
  Terminal,
  BookOpen,
  Layout,
  Layers,
  FileText,
  Folder,
  GraduationCap,
  Atom,
  Calculator,
  LineChart,
  Lightbulb,
  Microscope,
  Network,
  Server,
  Sparkles,
  Telescope,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Sigma,
  BarChart3,
  Cpu,
  Code2,
  Database,
  Brain,
  Briefcase,
  Coffee,
  Terminal,
  BookOpen,
  Layout,
  Layers,
  FileText,
  Folder,
  GraduationCap,
  Atom,
  Calculator,
  LineChart,
  Lightbulb,
  Microscope,
  Network,
  Server,
  Sparkles,
  Telescope,
  Wrench,
};

export const ICON_OPTIONS = Object.keys(map);

export function getIcon(name?: string): LucideIcon {
  if (!name) return FileText;
  return map[name] ?? FileText;
}

export const ACCENT_OPTIONS = [
  "from-violet-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-purple-500",
  "from-yellow-400 to-amber-500",
  "from-red-500 to-orange-500",
  "from-cyan-500 to-sky-500",
  "from-indigo-500 to-blue-600",
  "from-lime-500 to-green-500",
  "from-zinc-500 to-slate-500",
];

export function randomAccent(): string {
  return ACCENT_OPTIONS[Math.floor(Math.random() * ACCENT_OPTIONS.length)];
}
