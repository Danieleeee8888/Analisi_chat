import Anthropic from "@anthropic-ai/sdk";
import type { ContextFormData } from "./context-form-types";
import { RELATIONSHIP_OPTIONS } from "./context-form-types";
import { stripMetricsForReportPayload } from "./metrics-for-llm";
import { SUBTEXT_SYSTEM_PROMPT } from "./prompt";

function relationshipLabel(v: ContextFormData["relationshipType"]): string {
  return RELATIONSHIP_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

function howLongLabel(v: string): string {
  const map: Record<string, string> = {
    under_6m: "Meno di 6 mesi",
    "6_12m": "6–12 mesi",
    "1_3y": "1–3 anni",
    over_3y: "Più di 3 anni",
    unsure: "Difficile quantificare"
  };
  return map[v] ?? v;
}

function ageLabel(v: string): string {
  const map: Record<string, string> = {
    both_under_25: "Entrambi under 25",
    "25_34": "Prevalentemente 25–34",
    "35_44": "Prevalentemente 35–44",
    "45_plus": "45 o più",
    mixed: "Fasce molto diverse",
    prefer_not: "Preferisco non indicare"
  };
  return map[v] ?? v;
}

export function buildReportUserMessage(
  anonymizedChat: string,
  metrics: object,
  formData: ContextFormData
): string {
  const metricsLite = stripMetricsForReportPayload(metrics);
  const live = formData.liveOrWorkTogether === "si" ? "Sì" : "No";

  return `Analizza questa chat usando le metriche allegate.

DATI DEL FORM:
- Tipo di relazione: ${relationshipLabel(formData.relationshipType)}
- Chi sei tu in chat (come indicato): ${formData.whoAreYou.trim() || "—"}
- Da quanto vi conoscete: ${howLongLabel(formData.howLongKnown)}
- Vivete o lavorate insieme: ${live}
- Fascia età: ${ageLabel(formData.ageBand)}
- Obiettivo / focus: ${formData.specificQuestion.trim() || "—"}

METRICHE (ridotte per analisi):
${JSON.stringify(metricsLite, null, 2)}

CHAT (anonimizzata):
${anonymizedChat}`;
}

export async function generateReport(
  anonymizedChat: string,
  metrics: object,
  formData: ContextFormData
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY non configurata");
  }

  const model =
    process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-20250514";
  const client = new Anthropic({ apiKey });
  const userContent = buildReportUserMessage(anonymizedChat, metrics, formData);

  const msg = await client.messages.create({
    model,
    max_tokens: 2000,
    temperature: 0.3,
    system: SUBTEXT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }]
  });

  const block = msg.content[0];
  if (block.type !== "text") {
    throw new Error("Risposta Claude non testuale");
  }
  return block.text;
}
