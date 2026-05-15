import type { Material, MaterialType } from "./types";

const DRIVE_RE = /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
const DRIVE_FOLDER_RE = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
const YT_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function isDriveLink(url: string): boolean {
  return DRIVE_RE.test(url) || DRIVE_FOLDER_RE.test(url);
}

export function isYouTubeLink(url: string): boolean {
  return YT_RE.test(url);
}

export function getDriveFileId(url: string): string | null {
  const m = url.match(DRIVE_RE);
  return m ? m[1] : null;
}

export function getYouTubeId(url: string): string | null {
  const m = url.match(YT_RE);
  return m ? m[1] : null;
}

export function toDrivePreview(url: string): string {
  const id = getDriveFileId(url);
  if (id) return `https://drive.google.com/file/d/${id}/preview`;
  return url;
}

export function toYouTubeEmbed(url: string): string {
  const id = getYouTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}`;
  return url;
}

export function detectType(url: string, fallback: MaterialType = "website"): MaterialType {
  if (isYouTubeLink(url)) return "video";
  if (isDriveLink(url)) return "drive";
  if (/\.pdf(\?|#|$)/i.test(url)) return "pdf";
  return fallback;
}

export function getEmbedUrl(m: Material): string {
  if (m.type === "drive") return toDrivePreview(m.url);
  if (m.type === "video") return toYouTubeEmbed(m.url);
  return m.url;
}

export function canEmbed(m: Material): boolean {
  return m.type === "drive" || m.type === "video" || m.type === "pdf";
}
