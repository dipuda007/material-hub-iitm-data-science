import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import seedRaw from "@/data/courses.json";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOB_PATHNAME = "data.json";
const SEED = seedRaw as AppData;

// Find a Vercel Blob token even if Vercel injected it under a custom name.
// Vercel may use either BLOB_READ_WRITE_TOKEN or <STORE_NAME>_READ_WRITE_TOKEN.
function findBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [k, v] of Object.entries(process.env)) {
    if (k.endsWith("_READ_WRITE_TOKEN") && v) return v;
  }
  return undefined;
}

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
  const token = findBlobToken();
  if (!token) return SEED;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token });
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
  const blobToken = findBlobToken();
  if (!blobToken) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Add a Vercel Blob store and connect it to this project.",
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
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token: blobToken });
    for (const b of blobs) {
      if (b.pathname === BLOB_PATHNAME) {
        try {
          await del(b.url, { token: blobToken });
        } catch {
          // ignore
        }
      }
    }
    const result = await put(BLOB_PATHNAME, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: blobToken,
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
  const blobToken = findBlobToken();
  if (!blobToken) return NextResponse.json({ ok: true });
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token: blobToken });
    for (const b of blobs) {
      if (b.pathname === BLOB_PATHNAME) {
        try {
          await del(b.url, { token: blobToken });
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
