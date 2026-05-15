import { NextResponse } from "next/server";
import seedRaw from "@/data/courses.json";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEED = seedRaw as AppData;

// JSONBin.io configuration. Set these in Vercel project env vars:
//   JSONBIN_BIN_ID    - the ID of the bin you created
//   JSONBIN_API_KEY   - your master key from jsonbin.io account
function jsonbinConfig(): { binId?: string; apiKey?: string } {
  return {
    binId: process.env.JSONBIN_BIN_ID,
    apiKey: process.env.JSONBIN_API_KEY,
  };
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

async function readFromBin(): Promise<AppData> {
  const { binId, apiKey } = jsonbinConfig();
  if (!binId || !apiKey) return SEED;
  try {
    // "latest" returns the most recent version; "?meta=false" returns just the data.
    const res = await fetch(
      `https://api.jsonbin.io/v3/b/${binId}/latest?meta=false`,
      {
        method: "GET",
        headers: { "X-Master-Key": apiKey },
        cache: "no-store",
      },
    );
    if (!res.ok) return SEED;
    const parsed = (await res.json()) as unknown;
    if (!isAppData(parsed)) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

async function writeToBin(data: AppData): Promise<{ ok: boolean; error?: string }> {
  const { binId, apiKey } = jsonbinConfig();
  if (!binId || !apiKey) {
    return {
      ok: false,
      error: "JSONBin not configured. Set JSONBIN_BIN_ID and JSONBIN_API_KEY in Vercel env vars.",
    };
  }
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `JSONBin HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function GET() {
  const data = await readFromBin();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

export async function PUT(req: Request) {
  if (!checkToken(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!isAppData(body)) return badRequest("Invalid shape: expected { types: [...] }");
  const result = await writeToBin(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!checkToken(req)) return unauthorized();
  // Reset = write the original seed back so visitors see defaults again.
  const result = await writeToBin(SEED);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
