export type Msg = { role: "system" | "user" | "assistant"; content: string };

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const HF_URL = process.env.HF_TEXTGEN_URL || "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const HF_KEY = process.env.HUGGINGFACE_API_KEY || "";

type Role = "Decider" | "Operations" | "Compliance" | "Finance";

function roleModel(role: Role) {
  // Decider → OpenAI; Specialists → HF (if configured) else OpenAI
  if (role === "Decider") return { provider: "openai", model: process.env.OPENAI_DECIDER_MODEL || "gpt-4o-mini" };
  const preferHF = !!HF_KEY || !!process.env.HF_TEXTGEN_URL;
  return preferHF
    ? { provider: "hf", model: process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct" }
    : { provider: "openai", model: process.env.OPENAI_SPECIALIST_MODEL || "gpt-4o-mini" };
}

export async function generateByRole(role: Role, messages: Msg[], maxTokens = 900): Promise<string> {
  const { provider, model } = roleModel(role);

  if (provider === "openai") {
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${OPENAI_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        // DO NOT pass reasoning.* to non-reasoning models to avoid the 400 error you saw
        temperature: role === "Decider" ? 0.3 : 0.5
      })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || "openai error");
    return j.choices?.[0]?.message?.content || "";
  }

  // Hugging Face (text-generation)
  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
  const r = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${HF_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.5,
        return_full_text: false
      }
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || "hf error");
  // Output schema can be {generated_text} or array; normalize
  const text = Array.isArray(j) ? j[0]?.generated_text : (j.generated_text || j);
  return String(text || "");
}
