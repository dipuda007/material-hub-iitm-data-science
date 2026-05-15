import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Diagnostic endpoint. Returns whether the env vars are set (never their values).
export async function GET() {
  const binIdSet = !!process.env.JSONBIN_BIN_ID;
  const apiKeySet = !!process.env.JSONBIN_API_KEY;
  return NextResponse.json({
    storage: "jsonbin.io",
    jsonbin_bin_id_set: binIdSet,
    jsonbin_api_key_set: apiKeySet,
    jsonbin_configured: binIdSet && apiKeySet,
    admin_user_env_set: !!process.env.ADMIN_USER,
    admin_pass_env_set: !!process.env.ADMIN_PASS,
    vercel_env: process.env.VERCEL_ENV ?? null,
  });
}
