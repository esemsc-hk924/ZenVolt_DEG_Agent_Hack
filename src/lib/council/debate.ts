import { generateByRole, Msg } from "@/lib/rag/llm/router";

export type DebateTurn = { speaker: string; content: string };
export type DebateResult = { transcript: DebateTurn[]; consensus: string };

const ROLE_ORDER: Array<"Operations"|"Finance"|"Compliance"> = ["Operations","Finance","Compliance"];

export async function runDebate(question: string, rounds = 2): Promise<DebateResult> {
  let transcript: DebateTurn[] = [];
  let shared = `QUESTION: ${question}\n`;

  for (let r = 1; r <= rounds; r++) {
    for (const role of ROLE_ORDER) {
      const context = transcript.slice(-3).map(t => `${t.speaker}: ${t.content}`).join("\n");
      const out = await generateByRole(role, [
        { role: "system", content: `You are ${role}. Be concise, cite [doc_id] if referencing policy. Respond to prior remarks.` },
        { role: "user", content: `${shared}\nPRIOR:\n${context}` }
      ], 400);
      transcript.push({ speaker: role, content: out });
      shared += `\n${role}: ${out}`;
    }
  }

  const consensus = await generateByRole("Decider", [
    { role: "system", content: "You are the Chair. Produce a short consensus plan with owners, cost bands, and citations." },
    { role: "user", content: transcript.map(t => `${t.speaker}: ${t.content}`).join("\n") }
  ], 900);

  return { transcript, consensus };
}
