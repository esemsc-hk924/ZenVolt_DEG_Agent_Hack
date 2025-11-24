import OpenAI from "openai";
import orgDemo from "@/data/org_demo.json";
import { getMockCouncilResponse } from "@/lib/council/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "system" | "user" | "assistant"; content: string };
type Body = {
  prompt: string;
  transcript: { agentId: string; role: string; content: string }[];
  agentId: string; // one of: ops|fin|comp|it
  round?: number;
};

const AGENTS: Record<string, { name: string; role: string; style: string }> = {
  ops: {
    name: "Operations",
    role: "Implementation",
    style:
      "2–4 sentences. React to prior points. Focus on operational feasibility, sequencing, blockers. No fluff.",
  },
  fin: {
    name: "Finance",
    role: "Cost & ROI",
    style:
      "2–4 sentences. Quantify costs/savings, quick wins vs capex, simple payback. Don't repeat the objective.",
  },
  comp: {
    name: "Compliance",
    role: "Regulatory",
    style:
      "2–4 sentences. Reference likely obligations (e.g., SECR, CSRD) and risk of non-compliance. Be specific.",
  },
  it: {
    name: "Data/IT",
    role: "Data & Systems",
    style:
      "2–4 sentences. Data availability, integration, security, and measurement reliability. React to others.",
  },
};

function makeSystem(agentId: string) {
  const a = AGENTS[agentId];
  const org = (orgDemo as any)?.org ?? {};
  return [
    {
      role: "system",
      content:
        `You are ${a.name}, the ${a.role} voice on an AI sustainability council. ` +
        `Write like a senior consultant: crisp, concrete, and additive. ` +
        `Never repeat the user's prompt verbatim. Never say "here's my brief". ` +
        `If others already mentioned something, either build on it or disagree with a reason. ` +
        `If a user asks a question, address it directly and thoughtfully.\n\n` +
        `Organization context (for grounding): ${JSON.stringify(org).slice(0, 2000)}\n\n` +
        `Style: ${a.style}`,
    },
  ] as Msg[];
}

function lastTurnsSummary(transcript: Body["transcript"], take = 8) {
  const recent = transcript.slice(-take);
  if (!recent.length) return "No prior remarks.";
  const lines = recent.map(
    (m, i) => {
      if (m.agentId === "user") {
        return `${i + 1}. User: ${m.content}`;
      }
      return `${i + 1}. ${AGENTS[m.agentId]?.name ?? m.role}: ${m.content}`;
    }
  );
  return lines.join("\n");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { prompt, transcript, agentId, round = 1 } = body;
  if (!agentId || !(agentId in AGENTS))
    return new Response("Unknown agentId", { status: 400 });

  try {
    // Auto-detect mock mode: use mocks if no API key
    const useMocks = !process.env.OPENAI_API_KEY;

    if (useMocks) {
      console.log("[API] Using MOCK responses - OPENAI_API_KEY not found in environment");
      // Simulate realistic API delay (1-2 seconds before starting to stream)
      const initialDelay = 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, initialDelay));

      // Get production-grade mock data
      const fullContent = getMockCouncilResponse(agentId as "ops" | "fin" | "comp" | "it", round, transcript);

      // Create a streaming response that sends word-by-word
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const words = fullContent.split(/(\s+)/); // Split by spaces but keep them

          for (let i = 0; i < words.length; i++) {
            const word = words[i];

            // Send chunk as JSON: { chunk: "word ", done: false }
            const chunk = JSON.stringify({ chunk: word, done: false }) + "\n";
            controller.enqueue(encoder.encode(chunk));

            // Delay between words (30-50ms for natural typing speed)
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
          }

          // Send final message with timestamp
          const final = JSON.stringify({
            chunk: "",
            done: true,
            ts: Date.now()
          }) + "\n";
          controller.enqueue(encoder.encode(final));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Real OpenAI API call with streaming
    console.log("[API] Using REAL OpenAI API - OPENAI_API_KEY detected");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const msgs: Msg[] = [
      ...makeSystem(agentId),
      {
        role: "user",
        content:
          `Objective (do not repeat verbatim): ${prompt}\n\n` +
          `Recent council remarks and user messages (read carefully and respond to specific points):\n${lastTurnsSummary(transcript, 8)}\n\n` +
          `Your task: Add a thoughtful contribution (2–4 sentences) that directly responds to what others just said. If there's a user question, address it directly. Reference specific points, build on ideas, challenge assumptions constructively, or propose alternatives. Be conversational like a podcast discussion—agents talking TO each other and TO the user, not just stating positions. Do not restate the objective. No headings.`,
      },
    ];

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 220,
      messages: msgs,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const data = JSON.stringify({ chunk: content, done: false }) + "\n";
              controller.enqueue(encoder.encode(data));
            }
          }
          // Send final message
          const final = JSON.stringify({
            chunk: "",
            done: true,
            ts: Date.now()
          }) + "\n";
          controller.enqueue(encoder.encode(final));
          controller.close();
        } catch (error: any) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e: any) {
    console.error("[/api/council/turn] ERROR - Falling back to mocks:", e?.message || e);
    console.error("[/api/council/turn] Error details:", {
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
      agentId,
      round,
      hasApiKey: !!process.env.OPENAI_API_KEY,
    });
    // Fallback to mocks on error - also streamed
    const fullContent = getMockCouncilResponse(agentId as "ops" | "fin" | "comp" | "it", round, transcript);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = fullContent.split(/(\s+)/);

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const chunk = JSON.stringify({ chunk: word, done: false }) + "\n";
          controller.enqueue(encoder.encode(chunk));
          await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
        }

        const final = JSON.stringify({ chunk: "", done: true, ts: Date.now() }) + "\n";
        controller.enqueue(encoder.encode(final));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }
}
