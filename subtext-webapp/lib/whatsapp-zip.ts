import AdmZip from "adm-zip";
import type { IZipEntry } from "adm-zip";
import { normalizeUnusualLineTerminators } from "./anonymizer";

/** Stessa logica di `selectTxtEntry` in `subtext-anonymizer/anonymizer.js`. */
export function selectTxtEntry(entries: IZipEntry[]): IZipEntry | null {
  const txtEntries = entries.filter(
    (entry) => !entry.isDirectory && entry.entryName.toLowerCase().endsWith(".txt")
  );
  if (txtEntries.length === 0) return null;

  txtEntries.sort((a, b) => {
    const aName = a.entryName.toLowerCase();
    const bName = b.entryName.toLowerCase();
    const aScore = aName.includes("_chat") || aName.includes("chat") ? 1 : 0;
    const bScore = bName.includes("_chat") || bName.includes("chat") ? 1 : 0;
    if (aScore !== bScore) return bScore - aScore;
    return b.header.size - a.header.size;
  });

  return txtEntries[0] ?? null;
}

/**
 * Legge uno zip in memoria e restituisce il testo UTF-8 del .txt della chat.
 * @throws Error messaggio utente se non c'è .txt
 */
export function extractWhatsappTxtFromZipBuffer(buffer: Buffer): string {
  const zip = new AdmZip(buffer);
  const txtEntry = selectTxtEntry(zip.getEntries());
  if (!txtEntry) {
    throw new Error("Lo zip non contiene alcun file .txt.");
  }
  return normalizeUnusualLineTerminators(txtEntry.getData().toString("utf8"));
}
