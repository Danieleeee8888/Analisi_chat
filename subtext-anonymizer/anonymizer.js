const fs = require("fs");
const path = require("path");
const os = require("os");
const AdmZip = require("adm-zip");

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

class AnonymizerWarning extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = "AnonymizerWarning";
    this.code = code;
    this.meta = meta;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function selectTxtEntry(entries) {
  const txtEntries = entries.filter(
    (entry) => !entry.isDirectory && entry.entryName.toLowerCase().endsWith(".txt")
  );
  if (txtEntries.length === 0) return null;

  txtEntries.sort((a, b) => {
    const aName = a.entryName.toLowerCase();
    const bName = b.entryName.toLowerCase();
    const aScore = (aName.includes("_chat") || aName.includes("chat")) ? 1 : 0;
    const bScore = (bName.includes("_chat") || bName.includes("chat")) ? 1 : 0;
    if (aScore !== bScore) return bScore - aScore;
    return b.header.size - a.header.size;
  });

  return txtEntries[0];
}

function extractSender(line) {
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

function hasWhatsappHeaders(text) {
  const headerPattern =
    /(^[\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s-\s[^:]+:)|(^[\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s[^:]+:)/m;
  return headerPattern.test(text);
}

function buildParticipantMap(text) {
  function toAlphabeticLabel(index) {
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
  const map = new Map();
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

function replaceWithCount(text, regex, replacement, countRef) {
  return text.replace(regex, (...args) => {
    const matched = args[0];
    const groups = args.slice(1, -2);
    const replacementText =
      typeof replacement === "function" ? replacement(matched, ...groups) : replacement;
    if (replacementText !== matched) {
      countRef.count += 1;
    }
    return replacementText;
  });
}

function anonymizeText(originalText, participantMap) {
  const counts = {
    partecipanti: 0,
    cifre: 0
  };

  let text = originalText;

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
  // Le righe intestazione (che iniziano con pattern data/ora WhatsApp)
  // vengono lasciate intatte perché le date servono per l'analisi temporale.
  // In tutte le altre righe, ogni cifra [0-9] viene sostituita con *
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

function createLogContent(participantMap, counts) {
  const lines = [];
  lines.push("=== LOG ANONIMIZZAZIONE SUBTEXT ===");
  lines.push("");
  lines.push("Mapping partecipanti (NON condividere questo file):");
  if (participantMap.size === 0) {
    lines.push("- Nessun partecipante identificato");
  } else {
    for (const [real, alias] of participantMap.entries()) {
      lines.push(`- ${real} -> ${alias}`);
    }
  }

  lines.push("");
  lines.push("Conteggio sostituzioni:");
  lines.push(`- nomi partecipanti: ${counts.partecipanti}`);
  lines.push(`- cifre rimosse dal testo: ${counts.cifre}`);
  lines.push("");
  lines.push(
    "Avvertenza: Controlla il file anonimizzato prima di condividerlo. La rimozione automatica potrebbe non essere completa."
  );

  return lines.join("\n");
}

function ensureWritableDir(targetDir) {
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.accessSync(targetDir, fs.constants.W_OK);
  } catch (error) {
    if (error && error.code === "EACCES") {
      const fallbackDir = path.join(os.homedir(), "Desktop");
      throw new AnonymizerWarning(
        "DOWNLOADS_NO_PERMISSION",
        "Permessi mancanti sulla cartella di destinazione. Seleziona un percorso alternativo (es: Desktop).",
        { suggestedPath: fallbackDir }
      );
    }
    throw error;
  }
}

async function anonymizeWhatsappZip(zipPath, options = {}) {
  const {
    confirmLargeFile = false,
    proceedWithoutWhatsappPattern = false,
    outputDir
  } = options;

  const stats = fs.statSync(zipPath);
  if (stats.size > MAX_FILE_SIZE_BYTES && !confirmLargeFile) {
    throw new AnonymizerWarning(
      "FILE_TOO_LARGE",
      "Il file supera 50MB. Vuoi procedere comunque?",
      { sizeBytes: stats.size }
    );
  }

  const zip = new AdmZip(zipPath);
  const txtEntry = selectTxtEntry(zip.getEntries());
  if (!txtEntry) {
    throw new Error("Lo .zip non contiene alcun file .txt.");
  }

  const txtBuffer = txtEntry.getData();
  const originalText = txtBuffer.toString("utf8");

  const whatsappLike = hasWhatsappHeaders(originalText);
  if (!whatsappLike && !proceedWithoutWhatsappPattern) {
    throw new AnonymizerWarning(
      "NOT_WHATSAPP_PATTERN",
      "Il .txt non sembra una chat WhatsApp riconoscibile. Vuoi procedere comunque?"
    );
  }

  const participantMap = buildParticipantMap(originalText);
  const { anonymizedText, counts } = anonymizeText(originalText, participantMap);

  const resolvedOutputDir = outputDir || path.dirname(zipPath);
  ensureWritableDir(resolvedOutputDir);

  const baseName = path.basename(zipPath, path.extname(zipPath));
  const outputFileName = `${baseName}_anonimizzato.txt`;
  const logFileName = `${baseName}_log.txt`;

  const outputPath = path.join(resolvedOutputDir, outputFileName);
  const logPath = path.join(resolvedOutputDir, logFileName);

  fs.writeFileSync(outputPath, anonymizedText, "utf8");
  fs.writeFileSync(logPath, createLogContent(participantMap, counts), "utf8");

  return {
    outputPath,
    logPath,
    outputDir: resolvedOutputDir,
    participants: Array.from(participantMap.entries()).map(([realName, alias]) => ({
      realName,
      alias
    })),
    counts
  };
}

module.exports = {
  anonymizeWhatsappZip,
  AnonymizerWarning
};
