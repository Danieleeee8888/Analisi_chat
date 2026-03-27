const ANDROID_LINE =
  /^([\u200e\u200f\u200b]*)(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}):(\d{2})(?::(\d{2}))?\s-\s([^:]+):\s?(.*)$/;

const IOS_LINE =
  /^([\u200e\u200f\u200b]*)\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}):(\d{2}):(\d{2})\]\s([^:]+):\s?(.*)$/;

function normalizeYear(yStr: string): number {
  const y = parseInt(yStr, 10);
  if (Number.isNaN(y)) return new Date().getFullYear();
  return y < 100 ? 2000 + y : y;
}

function buildDate(d: number, mo: number, y: string, h: number, mi: number, s: number): Date {
  return new Date(normalizeYear(y), mo - 1, d, h, mi, s || 0);
}

export interface ParsedMessage {
  ts: number;
  date: Date;
  sender: string;
  body: string;
  lineIndex: number;
}

/**
 * Parsa export WhatsApp (Android / iOS). Aggrega righe di continuazione nel messaggio precedente.
 */
export function parseWhatsAppChat(text: string): ParsedMessage[] {
  const normalized = text
    .replace(/\u2028/g, "\n")
    .replace(/\u2029/g, "\n")
    .replace(/\u0085/g, "\n");
  const lines = normalized.split(/\r?\n/);
  const messages: ParsedMessage[] = [];
  let current: ParsedMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m = line.match(ANDROID_LINE);
    let isIos = false;
    if (!m) {
      m = line.match(IOS_LINE);
      isIos = Boolean(m);
    }

    if (m) {
      if (current) {
        messages.push(current);
      }
      let d: number;
      let mo: number;
      let y: string;
      let h: number;
      let mi: number;
      let s: number;
      let sender: string;
      let body: string;
      if (isIos) {
        d = parseInt(m[2], 10);
        mo = parseInt(m[3], 10);
        y = m[4];
        h = parseInt(m[5], 10);
        mi = parseInt(m[6], 10);
        s = parseInt(m[7], 10);
        sender = m[8].trim();
        body = m[9] ?? "";
      } else {
        d = parseInt(m[2], 10);
        mo = parseInt(m[3], 10);
        y = m[4];
        h = parseInt(m[5], 10);
        mi = parseInt(m[6], 10);
        s = m[7] ? parseInt(m[7], 10) : 0;
        sender = m[8].trim();
        body = m[9] ?? "";
      }
      const date = buildDate(d, mo, y, h, mi, s);

      current = {
        ts: date.getTime(),
        date,
        sender,
        body,
        lineIndex: i
      };
    } else if (current && line.length) {
      current.body += `\n${line}`;
    }
  }

  if (current) {
    messages.push(current);
  }

  messages.sort((a, b) => a.ts - b.ts || a.lineIndex - b.lineIndex);
  return messages;
}

function formatAndroidLineDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const sec = d.getSeconds();
  if (sec) {
    return `${dd}/${mm}/${yy}, ${hh}:${mi}:${String(sec).padStart(2, "0")}`;
  }
  return `${dd}/${mm}/${yy}, ${hh}:${mi}`;
}

/**
 * Ricostruisce testo export stile Android (usato dopo filtro periodo).
 */
export function messagesToWhatsAppAndroidExport(messages: ParsedMessage[]): string {
  const lines: string[] = [];
  for (const m of messages) {
    const head = `${formatAndroidLineDate(m.date)} - ${m.sender}: `;
    const parts = m.body.split("\n");
    const first = parts[0] ?? "";
    lines.push(head + first);
    for (let i = 1; i < parts.length; i++) {
      lines.push(parts[i]);
    }
  }
  return lines.join("\n");
}
