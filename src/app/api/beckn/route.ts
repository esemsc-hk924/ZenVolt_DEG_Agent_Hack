import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const action = body?.context?.action ?? "unknown";
  const transactionId = body?.context?.transaction_id ?? "unknown";

  await prisma.becknEvent.create({
    data: {
      action,
      transactionId,
      message: body,
    },
  });

  return NextResponse.json({ received: true });
}
