"use client";

// NOTE: credentials are hardcoded client-side as requested.
// This is a soft UX gate, NOT real security — anyone viewing the JS bundle
// or DevTools can bypass it. Do not store anything truly sensitive here.

const ADMIN_USER = "dipuda007";
const ADMIN_PASS = "18122005";
const KEY = "mh:admin";

export function tryLogin(user: string, pass: string): boolean {
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ user, at: Date.now() }),
      );
      window.dispatchEvent(new CustomEvent("mh:auth"));
    }
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("mh:auth"));
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { user?: string };
    return parsed?.user === ADMIN_USER;
  } catch {
    return false;
  }
}

export function onAuthChange(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const fn = () => handler();
  window.addEventListener("mh:auth", fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener("mh:auth", fn);
    window.removeEventListener("storage", fn);
  };
}
