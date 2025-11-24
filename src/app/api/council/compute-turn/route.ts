import OpenAI from "openai";
import { getMockCouncilResponse } from "@/lib/council/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "system" | "user" | "assistant"; content: string };
type Body = {
  prompt: string;
  transcript: { agentId: string; role: string; content: string }[];
  agentId: string; // compute|grid|storage|finance
  round?: number;
};

// Compute-Energy specific agents
const COMPUTE_AGENTS: Record<string, { name: string; role: string; style: string }> = {
  compute: {
    name: "Compute Agent",
    role: "Workload Management",
    style:
      "2–4 sentences. Focus on compute job scheduling, GPU capacity, workload windows, and job optimization. React to grid signals and energy availability.",
  },
  grid: {
    name: "Grid Agent",
    role: "Energy & Carbon Signals",
    style:
      "2–4 sentences. Provide real-time carbon intensity, energy prices, renewable share, and flexibility market opportunities. React to compute demands.",
  },
  storage: {
    name: "Storage Agent",
    role: "Battery & Flexibility",
    style:
      "2–4 sentences. Discuss battery discharge capacity, storage availability, flexibility participation, and P415 market opportunities.",
  },
  finance: {
    name: "Finance Agent",
    role: "Cost Optimization",
    style:
      "2–4 sentences. Quantify cost per inference, savings from deferrals, flexibility rewards, and ROI of carbon-aware scheduling.",
  },
};

// Map compute agents to base agent format for mock data
const AGENT_MAP: Record<string, "ops" | "fin" | "comp" | "it"> = {
  compute: "ops",
  grid: "it",
  storage: "comp",
  finance: "fin",
};

function makeSystem(agentId: string) {
  const a = COMPUTE_AGENTS[agentId];
  return [
    {
      role: "system",
      content:
        `You are ${a.name}, the ${a.role} in a compute-energy orchestration system. ` +
        `You coordinate AI compute workloads with energy grid signals to minimize cost per inference while staying under carbon caps. ` +
        `Write like a technical expert: precise, data-driven, and action-oriented. ` +
        `Never repeat the user's prompt verbatim. ` +
        `If others already mentioned something, either build on it or provide alternative perspective. ` +
        `Reference specific metrics: carbon intensity (gCO₂/kWh), energy price (£/kWh), compute capacity, flexibility rewards. ` +
        `Style: ${a.style}`,
    },
  ] as Msg[];
}

function lastTurnsSummary(transcript: Body["transcript"], take = 8) {
  const recent = transcript.slice(-take);
  if (!recent.length) return "No prior remarks.";
  const lines = recent.map((m, i) => {
    if (m.agentId === "user") {
      return `${i + 1}. User: ${m.content}`;
    }
    return `${i + 1}. ${COMPUTE_AGENTS[m.agentId]?.name ?? m.role}: ${m.content}`;
  });
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
  if (!agentId || !(agentId in COMPUTE_AGENTS))
    return new Response("Unknown agentId", { status: 400 });

  try {
    const useMocks = !process.env.OPENAI_API_KEY;

    if (useMocks) {
      console.log("[API] Using MOCK responses for compute-energy agents");
      const initialDelay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, initialDelay));

      // Use mapped agent for mock data, but adapt the response
      const mappedAgent = AGENT_MAP[agentId];
      const baseContent = getMockCouncilResponse(
        mappedAgent,
        round,
        transcript.map((t) => ({
          ...t,
          agentId: AGENT_MAP[t.agentId as keyof typeof AGENT_MAP] || t.agentId,
        }))
      );

      // Adapt mock response for compute-energy context
      const adaptedContent = adaptToComputeEnergy(baseContent, agentId);

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const words = adaptedContent.split(/(\s+)/);

          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const chunk = JSON.stringify({ chunk: word, done: false }) + "\n";
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
          }

          const final = JSON.stringify({
            chunk: "",
            done: true,
            ts: Date.now(),
          }) + "\n";
          controller.enqueue(encoder.encode(final));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Real OpenAI API call
    console.log("[API] Using REAL OpenAI API for compute-energy agents");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const msgs: Msg[] = [
      ...makeSystem(agentId),
      {
        role: "user",
        content:
          `Objective: ${prompt}\n\n` +
          `Recent agent remarks:\n${lastTurnsSummary(transcript, 8)}\n\n` +
          `Your task: Add a thoughtful contribution (2–4 sentences) about compute-energy orchestration. ` +
          `Reference carbon intensity, energy prices, compute capacity, flexibility markets. ` +
          `Be conversational and respond to specific points from other agents.`,
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
          const final = JSON.stringify({
            chunk: "",
            done: true,
            ts: Date.now(),
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
        Connection: "keep-alive",
      },
    });
  } catch (e: any) {
    console.error("[/api/council/compute-turn] ERROR:", e?.message || e);
    // Fallback to mocks
    const mappedAgent = AGENT_MAP[agentId];
    const baseContent = getMockCouncilResponse(mappedAgent, round, transcript);
    const adaptedContent = adaptToComputeEnergy(baseContent, agentId);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = adaptedContent.split(/(\s+)/);

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const chunk = JSON.stringify({ chunk: word, done: false }) + "\n";
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
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
        Connection: "keep-alive",
      },
    });
  }
}

function adaptToComputeEnergy(content: string, agentId: string): string {
  // Simple adaptation - replace generic terms with compute-energy context
  const adaptations: Record<string, string[]> = {
    compute: ["compute workload", "GPU capacity", "job scheduling", "inference cost"],
    grid: ["carbon intensity", "energy price", "renewable share", "grid signals"],
    storage: ["battery discharge", "flexibility", "P415 market", "storage capacity"],
    finance: ["cost per inference", "flexibility rewards", "carbon savings", "ROI"],
  };

  const terms = adaptations[agentId] || [];
  // For now, return as-is. In production, you'd do more sophisticated adaptation
  return content;
}

