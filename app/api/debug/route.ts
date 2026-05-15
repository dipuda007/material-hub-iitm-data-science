import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Diagnostic endpoint. Returns *names* of env vars (never values) so you can
// verify the Vercel Blob token is actually injected into this deployment.
export async function GET() {
  const tokenKeys = Object.keys(process.env).filter((k) =>
    k.endsWith("_READ_WRITE_TOKEN"),
  );
  const adminUserSet = !!process.env.ADMIN_USER;
  const adminPassSet = !!process.env.ADMIN_PASS;
  return NextResponse.json({
    blob_token_env_keys: tokenKeys,
    blob_configured: tokenKeys.length > 0,
    admin_user_env_set: adminUserSet,
    admin_pass_env_set: adminPassSet,
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV ?? null,
  });
}
