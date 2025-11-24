import demo from "@/data/org_demo.json";
import { retrieveRegulatory } from "@/lib/rag/retriever";
import { generateByRole, Msg } from "@/lib/rag/llm/router";

const baseSystem = `
You are a member of an AI Sustainability Council. Cite facts as [doc_id]. Do not invent numbers.
If a calculation is needed, propose a calc plan; the server will compute it. Keep outputs concise and actionable.
`;

const roleSystem: Record<string, string> = {
  Operations: baseSystem + "\nROLE: Operations Lead. Output: 3–5 actions with owners, start dates, expected impact; include [doc_id].",
  Finance: baseSystem + "\nROLE: Finance Partner. Output JSON only: {calc_plan:[{inputs,formula,notes}], risks:[...]}.",
  Compliance: baseSystem + "\nROLE: Compliance Advisor. Output: bullet points with [doc_id] references and what must be disclosed or assured.",
  Decider: baseSystem + "\nROLE: Decider/Chair. Merge others into a one-page plan with a table (action, owner, cost band, start, citation)."
};

export type CouncilOutput = {
  retrieved: Array<{id:string; source_url:string; text:string}>;
  transcript: Array<{role: string; content: string}>;
  decision: string;
};

export async function runCouncilOnce(question: string): Promise<CouncilOutput> {
  const org = (demo as any).org;
  const juris = org?.country || "UK";
  const regs = retrieveRegulatory(question, juris, 5);

  const orgBrief = JSON.stringify({
    org: demo.org, baselines: demo.baselines, thisYear: demo.thisYear,
    targets: demo.org?.targets, kpis: demo.kpis
  });
  const regsBrief = regs.map(r => `[${r.id}] ${r.text} (source: ${r.source_url})`).join("\n");

  const userPrompt = `
ORGANIZATION:
${orgBrief}

REGULATORY_CONTEXT (top matches):
${regsBrief}

QUESTION:
${question}
  `.trim();

  // Round: each specialist produces position
  const roles: Array<"Operations"|"Finance"|"Compliance"> = ["Operations","Finance","Compliance"];
  const outputs: Record<string,string> = {};
  for (const role of roles) {
    const messages: Msg[] = [
      { role: "system", content: roleSystem[role] },
      { role: "user", content: userPrompt }
    ];
    outputs[role] = await generateByRole(role, messages, 900);
  }

  // Debate remix (short): let each specialist react to others (1 turn)
  const debatePrompt = `
You are ${roles.join(", ")}. Below are initial notes. In 4–6 bullet points, highlight conflicts, risks, and the most cost-effective actions. Keep [doc_id] citations.

=== OPERATIONS ===
${outputs.Operations}

=== FINANCE ===
${outputs.Finance}

=== COMPLIANCE ===
${outputs.Compliance}
  `.trim();
  const debateSynthesis = await generateByRole("Operations", [
    { role: "system", content: roleSystem["Operations"] },
    { role: "user", content: debatePrompt }
  ], 600);

  // Decider merges
  const deciderInput = `
=== ORG ===
${orgBrief}

=== CONTEXT ===
${regsBrief}

=== SPECIALISTS ===
- OPERATIONS:
${outputs.Operations}

- FINANCE:
${outputs.Finance}

- COMPLIANCE:
${outputs.Compliance}

=== DEBATE SYNTHESIS ===
${debateSynthesis}

Write the final plan with: actions table (owner, cost band £, start), compliance flags with [doc_id], and a short rationale.
  `.trim();

  const decision = await generateByRole("Decider", [
    { role: "system", content: roleSystem.Decider },
    { role: "user", content: deciderInput }
  ], 1200);

  return {
    retrieved: regs.map(r => ({ id: r.id, source_url: r.source_url, text: r.text })),
    transcript: [
      { role: "Operations", content: outputs.Operations },
      { role: "Finance", content: outputs.Finance },
      { role: "Compliance", content: outputs.Compliance },
      { role: "Operations (debate)", content: debateSynthesis }
    ],
    decision
  };
}
