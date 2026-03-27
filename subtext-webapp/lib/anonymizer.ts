function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True se il testo contiene almeno una riga intestazione export WhatsApp (Android o iOS). */
export function hasWhatsappHeaders(text: string): boolean {
  const headerPattern =
    /(^[\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s-\s[^:]+:)|(^[\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s[^:]+:)/m;
  return headerPattern.test(text);
}

/** LS/PS/NEXT LINE spesso presenti in export o copia-incolla; normalizza a \n per parser e editor. */
export function normalizeUnusualLineTerminators(text: string): string {
  return text
    .replace(/\u2028/g, "\n")
    .replace(/\u2029/g, "\n")
    .replace(/\u0085/g, "\n");
}

function extractSender(line: string): string | null {
  const android =
    /^[\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s-\s([^:]+):/;
  const ios =
    /^[\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s([^:]+):/;

  const androidMatch = line.match(android);
  if (androidMatch) return androidMatch[1].trim();

  const iosMatch = line.match(ios);
  if (iosMatch) return iosMatch[1].trim();

  return null;
}

export function buildParticipantMap(text: string): Map<string, string> {
  function toAlphabeticLabel(index: number): string {
    let n = index + 1;
    let label = "";
    while (n > 0) {
      const remainder = (n - 1) % 26;
      label = String.fromCharCode(65 + remainder) + label;
      n = Math.floor((n - 1) / 26);
    }
    return label;
  }

  const lines = text.split(/\r?\n/);
  const map = new Map<string, string>();
  let nextIndex = 0;

  for (const line of lines) {
    const sender = extractSender(line);
    if (!sender) continue;
    if (!map.has(sender)) {
      map.set(sender, `Persona${toAlphabeticLabel(nextIndex)}`);
      nextIndex += 1;
    }
  }

  return map;
}

function replaceWithCount(
  text: string,
  regex: RegExp,
  replacement: string | ((matched: string, ...args: string[]) => string),
  countRef: { count: number }
): string {
  return text.replace(regex, (...args: string[]) => {
    const matched = args[0];
    const groups = args.slice(1, -2);
    const replacementText =
      typeof replacement === "function"
        ? (replacement as (m: string, ...g: string[]) => string)(matched, ...groups)
        : replacement;
    if (replacementText !== matched) {
      countRef.count += 1;
    }
    return replacementText;
  });
}

export function anonymizeText(
  originalText: string,
  participantMap: Map<string, string>
): { anonymizedText: string; counts: { partecipanti: number; cifre: number } } {
  const counts = {
    partecipanti: 0,
    cifre: 0
  };

  let text = normalizeUnusualLineTerminators(originalText);

  // STEP 4 - Nomi partecipanti
  const participantCounter = { count: 0 };
  const androidHeaderPattern =
    /^([\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s-\s)([^:]+)(:\s?)(.*)$/;
  const iosHeaderPattern =
    /^([\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s)([^:]+)(:\s?)(.*)$/;

  text = text
    .split(/\r?\n/)
    .map((line) => {
      const androidMatch = line.match(androidHeaderPattern);
      const iosMatch = line.match(iosHeaderPattern);
      const headerMatch = androidMatch || iosMatch;

      if (!headerMatch) return line;

      const prefix = headerMatch[1];
      const sender = headerMatch[2];
      const separator = headerMatch[3];
      const body = headerMatch[4];

      const senderMapAlias = participantMap.get(sender.trim());
      if (senderMapAlias) {
        participantCounter.count += 1;
        return `${prefix}${senderMapAlias}${separator}${body}`;
      }

      let updatedSender = sender;
      for (const [realName, alias] of participantMap.entries()) {
        const exactRegex = new RegExp(`\\b${escapeRegExp(realName)}\\b`, "gi");
        updatedSender = replaceWithCount(updatedSender, exactRegex, alias, participantCounter);
      }

      return `${prefix}${updatedSender}${separator}${body}`;
    })
    .join("\n");
  counts.partecipanti = participantCounter.count;

  // STEP 6 - Rimozione di tutte le cifre nel corpo dei messaggi
  const androidBodyHeaderPattern = /^[\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}/;
  const iosBodyHeaderPattern =
    /^[\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]/;
  let replacedDigitsCount = 0;
  text = text
    .split(/\r?\n/)
    .map((line) => {
      if (androidBodyHeaderPattern.test(line) || iosBodyHeaderPattern.test(line)) {
        return line;
      }
      return line.replace(/\d/g, () => {
        replacedDigitsCount += 1;
        return "*";
      });
    })
    .join("\n");
  counts.cifre = replacedDigitsCount;

  return { anonymizedText: text, counts };
}
