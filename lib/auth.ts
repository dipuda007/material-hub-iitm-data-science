"use client";

const TOKEN_KEY = "mh:admin-token";

export async function tryLogin(user: string, pass: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean; token?: string };
    if (!data.ok || !data.token) return false;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.dispatchEvent(new CustomEvent("mh:auth"));
    }
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new CustomEvent("mh:auth"));
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(TOKEN_KEY);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
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
