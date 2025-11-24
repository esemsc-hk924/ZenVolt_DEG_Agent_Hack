import kb from "@/data/regulatory_kb.json";

export type KBChunk = {
  id: string; jurisdiction: string; topic: string;
  effective_date: string; source_url: string; text: string; version: string;
};

// Very simple scorer; upgrade to embeddings later
export function retrieveRegulatory(query: string, jurisdictionHint?: string, topK = 5): KBChunk[] {
  const q = query.toLowerCase();
  const hits = (kb as KBChunk[]).map(doc => {
    const t = doc.text.toLowerCase();
    let score = 0;
    const add = (k: string, w = 1) => { if (q.includes(k) || t.includes(k)) score += w; };
    add("secr", 3); add("csrd", 3); add("cbam", 3);
    add("assurance", 2); add("report", 1); add("scope", 1); add("tagging", 1);
    if (jurisdictionHint && doc.jurisdiction.toLowerCase() === jurisdictionHint.toLowerCase()) score += 1;
    return { doc, score };
  });
  return hits.sort((a,b)=>b.score-a.score).slice(0, topK).map(h => h.doc);
}
