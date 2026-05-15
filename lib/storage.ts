"use client";

import type { MaterialRef } from "./types";

const FAV_KEY = "mh:favorites:v2";
const RECENT_KEY = "mh:recent:v2";
const RECENT_LIMIT = 20;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("mh:storage", { detail: { key } }));
  } catch {
    // ignore quota errors
  }
}

function isValid(m: unknown): m is MaterialRef {
  if (!m || typeof m !== "object") return false;
  const r = m as Record<string, unknown>;
  return (
    typeof r.typeId === "string" &&
    typeof r.courseId === "string" &&
    typeof r.folderId === "string" &&
    typeof r.url === "string" &&
    typeof r.title === "string" &&
    typeof r.type === "string"
  );
}

export function getFavorites(): MaterialRef[] {
  return read<MaterialRef[]>(FAV_KEY, []).filter(isValid);
}

export function isFavorite(url: string): boolean {
  return getFavorites().some((m) => m.url === url);
}

export function toggleFavorite(ref: MaterialRef): boolean {
  const list = getFavorites();
  const idx = list.findIndex((m) => m.url === ref.url);
  if (idx >= 0) {
    list.splice(idx, 1);
    write(FAV_KEY, list);
    return false;
  }
  list.unshift(ref);
  write(FAV_KEY, list);
  return true;
}

export function getRecent(): MaterialRef[] {
  return read<MaterialRef[]>(RECENT_KEY, []).filter(isValid);
}

export function pushRecent(ref: MaterialRef) {
  const list = getRecent().filter((m) => m.url !== ref.url);
  list.unshift(ref);
  write(RECENT_KEY, list.slice(0, RECENT_LIMIT));
}

export function clearRecent() {
  write(RECENT_KEY, []);
}

export function onStorageChange(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const fn = () => handler();
  window.addEventListener("mh:storage", fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener("mh:storage", fn);
    window.removeEventListener("storage", fn);
  };
}
