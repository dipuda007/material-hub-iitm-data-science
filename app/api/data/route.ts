import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import seedRaw from "@/data/courses.json";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOB_PATHNAME = "data.json";
const SEED = seedRaw as AppData;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

function checkToken(req: Request): boolean {
  const expected = process.env.ADMIN_PASS ?? "18122005";
  const got =
    req.headers.get("x-admin-token") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  return !!got && got === expected;
}

function isAppData(x: unknown): x is AppData {
  if (!x || typeof x !== "object") return false;
  const v = x as { types?: unknown };
  return Array.isArray(v.types);
}

async function readFromBlob(): Promise<AppData> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return SEED;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    const target = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    if (!target) return SEED;
    const res = await fetch(target.url, { cache: "no-store" });
    if (!res.ok) return SEED;
    const parsed = (await res.json()) as unknown;
    if (!isAppData(parsed)) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

export async function GET() {
  const data = await readFromBlob();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

export async function PUT(req: Request) {
  if (!checkToken(req)) return unauthorized();
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!isAppData(body)) return badRequest("Invalid shape: expected { types: [...] }");

  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    for (const b of blobs) {
      if (b.pathname === BLOB_PATHNAME) {
        try {
          await del(b.url);
        } catch {
          // ignore
        }
      }
    }
    const result = await put(BLOB_PATHNAME, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return NextResponse.json({ ok: true, url: result.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Write failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!checkToken(req)) return unauthorized();
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: true });
  }
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    for (const b of blobs) {
      if (b.pathname === BLOB_PATHNAME) {
        try {
          await del(b.url);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
