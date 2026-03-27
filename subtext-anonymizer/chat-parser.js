const ANDROID_LINE =
  /^([\u200e\u200f\u200b]*)(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}):(\d{2})(?::(\d{2}))?\s-\s([^:]+):\s?(.*)$/;

const IOS_LINE =
  /^([\u200e\u200f\u200b]*)\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}):(\d{2}):(\d{2})\]\s([^:]+):\s?(.*)$/;

function normalizeYear(yStr) {
  const y = parseInt(yStr, 10);
  if (Number.isNaN(y)) return new Date().getFullYear();
  return y < 100 ? 2000 + y : y;
}

function buildDate(d, mo, y, h, mi, s) {
  return new Date(normalizeYear(y), parseInt(mo, 10) - 1, parseInt(d, 10), h, mi, s || 0);
}

/**
 * Parsa export WhatsApp (Android / iOS). Aggrega righe di continuazione nel messaggio precedente.
 * @returns {{ ts: number, date: Date, sender: string, body: string, lineIndex: number }[]}
 */
function parseWhatsAppChat(text) {
  const lines = text.split(/\r?\n/);
  const messages = [];
  let current = null;

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
      let d;
      let mo;
      let y;
      let h;
      let mi;
      let s;
      let sender;
      let body;
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

module.exports = {
  parseWhatsAppChat
};
