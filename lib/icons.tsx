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
};

export function getIcon(name: string): LucideIcon {
  return map[name] ?? FileText;
}
