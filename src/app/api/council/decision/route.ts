import OpenAI from "openai";
import orgDemo from "@/data/org_demo.json";
import { MOCK_DECISION } from "@/lib/council/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  prompt: string;
  transcript: { agentId: string; role: string; content: string }[];
};

export async function POST(req: Request) {
  try {
    const { prompt, transcript } = (await req.json()) as Body;
    
    // Auto-detect mock mode: use mocks if no API key
    const useMocks = !process.env.OPENAI_API_KEY;
    
    if (useMocks) {
      console.log("[API] Using MOCK decision - OPENAI_API_KEY not found in environment");
      // Use production-grade mock decision
      return new Response(JSON.stringify(MOCK_DECISION), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log("[API] Using REAL OpenAI API for decision - OPENAI_API_KEY detected");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const org = (orgDemo as any)?.org ?? {};
    const debate = transcript.map(
      (m) => `${m.role}: ${m.content}`
    ).join("\n");

    const sys =
      `You are the Council Synthesizer. Produce a crisp, board-ready action plan. ` +
      `Return valid JSON only with keys: title, rationale, actions[], risks[], metrics[]. ` +
      `Each action has: title, owner, effort ("S/M/L"), impact ("L/M/H"), costRange ("£x–£y"), timeline ("<90d"/"Quarter"/"Year"), notes. ` +
      `Do NOT repeat the prompt. Keep it practical and consistent with the transcript.`;

    const user =
      `Org context: ${JSON.stringify(org).slice(0, 2000)}\n\n` +
      `Objective: ${prompt}\n\n` +
      `Debate transcript:\n${debate}\n\n` +
      `Now respond with JSON only.`;

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });

    const raw = resp.choices[0]?.message?.content || "{}";
    // Best effort parse
    const jsonText = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonText);

    // Guard: ensure arrays exist
    data.actions ||= [];
    data.risks ||= [];
    data.metrics ||= [];

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    console.error("[/api/council/decision] ERROR - Falling back to mocks:", e?.message || e);
    console.error("[/api/council/decision] Error details:", {
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
      hasApiKey: !!process.env.OPENAI_API_KEY,
    });
    // Fallback to mocks on error
    return new Response(JSON.stringify(MOCK_DECISION), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
