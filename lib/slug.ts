export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = toSlug(base) || "item";
  if (!existing.includes(slug)) return slug;
  let n = 2;
  while (existing.includes(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
