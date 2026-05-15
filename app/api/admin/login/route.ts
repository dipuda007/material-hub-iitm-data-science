import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { user?: string; pass?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const user = (body.user ?? "").trim();
  const pass = body.pass ?? "";

  const expectedUser = process.env.ADMIN_USER ?? "dipuda007";
  const expectedPass = process.env.ADMIN_PASS ?? "18122005";

  if (user === expectedUser && pass === expectedPass) {
    return NextResponse.json({ ok: true, token: expectedPass });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
