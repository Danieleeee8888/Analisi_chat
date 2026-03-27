import { NextResponse } from "next/server";
import {
  anonymizeText,
  buildParticipantMap,
  hasWhatsappHeaders
} from "@/lib/anonymizer";
import { messagesToWhatsAppAndroidExport, parseWhatsAppChat } from "@/lib/chat-parser";
import {
  parseAnalysisPeriod,
  parseAudienceSegment,
  type AnalysisPeriod,
  type ContextFormData,
  type RelationshipType
} from "@/lib/context-form-types";
import { MAX_ZIP_BYTES, MIN_MESSAGES_FOR_ANALYSIS } from "@/lib/process-chat-constants";
import { buildRelationalMetricsReport } from "@/lib/relational-metrics";
import { extractWhatsappTxtFromZipBuffer } from "@/lib/whatsapp-zip";

export const runtime = "nodejs";

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "coppia",
  "conoscenza",
  "amicizia",
  "famiglia",
  "gruppo",
  "lavoro"
];

function isRelationshipType(v: unknown): v is RelationshipType {
  return typeof v === "string" && RELATIONSHIP_TYPES.includes(v as RelationshipType);
}

function parseContextJson(raw: unknown): ContextFormData | null {
  if (typeof raw !== "string") return null;
  let o: unknown;
  try {
    o = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!o || typeof o !== "object") return null;
  const c = o as Record<string, unknown>;
  if (!isRelationshipType(c.relationshipType)) return null;
  if (typeof c.whoAreYou !== "string") return null;
  if (typeof c.howLongKnown !== "string") return null;
  if (c.liveOrWorkTogether !== "si" && c.liveOrWorkTogether !== "no") return null;
  if (typeof c.ageBand !== "string") return null;
  if (typeof c.specificQuestion !== "string" && c.specificQuestion !== undefined) return null;

  const analysisPeriod: AnalysisPeriod = parseAnalysisPeriod(c.analysisPeriod);
  const audienceSegment = parseAudienceSegment(c.audienceSegment);

  return {
    audienceSegment,
    relationshipType: c.relationshipType,
    whoAreYou: c.whoAreYou,
    howLongKnown: c.howLongKnown,
    liveOrWorkTogether: c.liveOrWorkTogether,
    ageBand: c.ageBand,
    specificQuestion: typeof c.specificQuestion === "string" ? c.specificQuestion : "",
    analysisPeriod
  };
}

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    { ok: false as const, error: message, ...(code ? { code } : {}) },
    { status }
  );
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonError("Richiesta non valida.", 400);
  }

  const context = parseContextJson(formData.get("context"));
  if (!context) {
    return jsonError("Dati del modulo non validi o mancanti.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("File .zip mancante.", 400);
  }

  if (file.size === 0) {
    return jsonError("Il file è vuoto.", 400);
  }

  if (file.size > MAX_ZIP_BYTES) {
    return jsonError("Il file supera la dimensione massima consentita (50 MB).", 413);
  }

  const name = file.name.toLowerCase();
  if (!name.endsWith(".zip")) {
    return jsonError("È richiesto un file .zip (export WhatsApp).", 400);
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return jsonError("Impossibile leggere il file caricato.", 400);
  }

  let rawText: string;
  try {
    rawText = extractWhatsappTxtFromZipBuffer(buffer);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Zip non valido.";
    return jsonError(msg, 400);
  }

  if (!hasWhatsappHeaders(rawText)) {
    return jsonError(
      "Il testo estratto non sembra un export WhatsApp riconoscibile. " +
        "Controlla di aver caricato l’export chat corretto.",
      400,
      "NOT_WHATSAPP_PATTERN"
    );
  }

  let allMessages;
  try {
    allMessages = parseWhatsAppChat(rawText);
  } catch {
    return jsonError("Impossibile analizzare il formato dei messaggi.", 400);
  }

  if (allMessages.length === 0) {
    return jsonError("Nessun messaggio trovato nel file.", 400);
  }

  const cutoffDate = new Date();
  const period = context.analysisPeriod;
  let filteredMessages = allMessages;
  if (period === "2months") {
    cutoffDate.setMonth(cutoffDate.getMonth() - 2);
    filteredMessages = allMessages.filter((m) => m.date >= cutoffDate);
  } else if (period === "6months") {
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    filteredMessages = allMessages.filter((m) => m.date >= cutoffDate);
  }

  if (filteredMessages.length === 0) {
    return jsonError(
      "Nessun messaggio nel periodo selezionato. Prova «Tutta la chat» o un export più recente.",
      400,
      "PERIOD_EMPTY"
    );
  }

  if (filteredMessages.length < MIN_MESSAGES_FOR_ANALYSIS) {
    return jsonError(
      `Servono almeno ${MIN_MESSAGES_FOR_ANALYSIS} messaggi per l’analisi nel periodo scelto. ` +
        `Ne risultano ${filteredMessages.length}. Scegli un periodo più ampio o un export più completo.`,
      400,
      "TOO_FEW_MESSAGES"
    );
  }

  const filteredText = messagesToWhatsAppAndroidExport(filteredMessages);

  const participantMap = buildParticipantMap(filteredText);
  const { anonymizedText } = anonymizeText(filteredText, participantMap);
  const metrics = buildRelationalMetricsReport(anonymizedText);
  if ("error" in metrics && typeof metrics.error === "string" && metrics.error) {
    return jsonError(`Elaborazione metriche: ${metrics.error}`, 500);
  }
  if (!("participants_order" in metrics) || !Array.isArray(metrics.participants_order)) {
    return jsonError("Elaborazione metriche: struttura non valida.", 500);
  }
  const participantMapArray = metrics.participants_order;

  return NextResponse.json({
    ok: true as const,
    anonymizedChat: anonymizedText,
    metrics,
    formData: context,
    participantMap: participantMapArray
  });
}
