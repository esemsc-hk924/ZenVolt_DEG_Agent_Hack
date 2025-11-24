// src/app/api/beckn/events/route.ts
import { NextRequest, NextResponse } from "next/server";

// Prevent build-time evaluation / static collection
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    // Guard DB env at runtime (don't throw at import time)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          events: [],
          error:
            "DATABASE_URL is not set. Add it in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    // Import Prisma ONLY inside handler
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    // If your table/model name differs, change `becknEvent`
    const events = await prisma.becknEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // Disconnect in serverless to avoid connection leaks
    await prisma.$disconnect();

    return NextResponse.json({ ok: true, events });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        events: [],
        error: e?.message || "Failed to fetch Beckn events.",
      },
      { status: 500 }
    );
  }
}
