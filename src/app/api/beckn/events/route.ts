// src/app/api/beckn/events/route.ts
import { NextResponse } from "next/server";

// Force runtime-only behavior
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * SAFE STUB for deployment.
 * - No Prisma imports
 * - No env reads at module scope
 * - No top-level side effects
 * - Cannot crash Vercel build
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    events: [],
    note: "Beckn events API temporarily stubbed for deployment. Enable DB after deploy.",
  });
}
