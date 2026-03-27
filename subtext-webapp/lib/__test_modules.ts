/**
 * Script manuale Step 1: verifica allineamento con la pipeline desktop (senza .zip).
 * Esecuzione dalla root di subtext-webapp:
 *   npx tsx lib/__test_modules.ts
 */
import * as fs from "fs";
import * as path from "path";
import { anonymizeText, buildParticipantMap } from "./anonymizer";
import { buildRelationalMetricsReport } from "./relational-metrics";

const samplePath = path.join(process.cwd(), "test-data", "sample-chat.txt");
if (!fs.existsSync(samplePath)) {
  console.error("Manca test-data/sample-chat.txt (cwd deve essere subtext-webapp).");
  process.exit(1);
}

const raw = fs.readFileSync(samplePath, "utf8");
const participantMap = buildParticipantMap(raw);
const { anonymizedText, counts } = anonymizeText(raw, participantMap);
const metrics = buildRelationalMetricsReport(anonymizedText);

const out = {
  participantMap: Object.fromEntries(participantMap.entries()),
  anonymization_counts: counts,
  anonymized_preview: anonymizedText.split("\n").slice(0, 5).join("\n") + "\n...",
  metrics
};

console.log(JSON.stringify(out, null, 2));
