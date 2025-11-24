// src/app/api/orchestrate/route.ts

import { NextResponse } from "next/server";
import { beckn } from "@/lib/beckn/client";
import type { BecknEnvelope } from "@/lib/beckn/client";

/**
 * POST /api/orchestrate
 * Sends a Beckn SEARCH to the configured gateway.
 */
export async function POST() {
  try {
    // -----------------------------
    // Your original intent payload
    // -----------------------------
    const intent = {
      item: {
        descriptor: { name: "AI Flex Compute Slot" },
        tags: [
          {
            code: "compute",
            list: [{ code: "gpu" }, { code: "flex" }],
          },
        ],
      },
      fulfillment: {
        tags: [
          {
            code: "energy",
            list: [{ code: "low_carbon" }, { code: "low_price" }],
          },
        ],
      },
    };

    // -------------------------------------------------------
    // Wrap into a BecknEnvelope (context + message required)
    // -------------------------------------------------------
    const envelope: BecknEnvelope = {
      context: {
        domain: process.env.BECKN_DOMAIN || "deg:compute",
        action: "search",
        version: "1.1.0",
        transaction_id: `txn-${Date.now()}`,
        message_id: `msg-${Date.now()}`,
        bap_id: process.env.BECKN_BAP_ID || "zenvolt.bap",
        bap_uri:
          process.env.BECKN_BAP_URI || process.env.NEXT_PUBLIC_BASE_URL || "",
        timestamp: new Date().toISOString(),
        ttl: "PT30S",
      },
      message: {
        intent,
      },
    };

    // Send SEARCH
    const res = await beckn.search(envelope);

    // transaction id in our envelope is the canonical one
    const txnId = envelope.context.transaction_id;

    return NextResponse.json({
      ok: true,
      transactionId: txnId,
      gatewayResponse: res?.data ?? res,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown orchestration error" },
      { status: 500 }
    );
  }
}
