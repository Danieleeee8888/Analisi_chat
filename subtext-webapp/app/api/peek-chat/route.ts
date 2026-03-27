import { NextResponse } from "next/server";
import { extractWhatsappTxtFromZipBuffer } from "@/lib/whatsapp-zip";

export const runtime = "nodejs";

const ANDROID_HEADER =
  /^[\u200e\u200f\u200b]*\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s-\s([^:]+):/;
const IOS_HEADER =
  /^[\u200e\u200f\u200b]*\[\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}:\d{2}\]\s([^:]+):/;

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "FormData non valida" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File mancante" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let rawText: string;
  try {
    rawText = extractWhatsappTxtFromZipBuffer(buffer);
  } catch {
    return NextResponse.json({ ok: false, error: "ZIP non valido" }, { status: 400 });
  }

  const lines = rawText.split("\n").slice(0, 300);
  const senderSet = new Set<string>();

  for (const line of lines) {
    const m = line.match(ANDROID_HEADER) || line.match(IOS_HEADER);
    if (m?.[1]) {
      const name = m[1].trim();
      if (
        !name.includes("crittografia") &&
        !name.includes("aggiunto") &&
        !name.includes("rimosso") &&
        name.length < 60
      ) {
        senderSet.add(name);
      }
    }
    if (senderSet.size >= 10) break;
  }

  let approxTotal = 0;
  let firstDate: string | null = null;
  let lastDate: string | null = null;

  const allLines = rawText.split("\n");
  for (const line of allLines) {
    const m = line.match(ANDROID_HEADER) || line.match(IOS_HEADER);
    if (m) {
      approxTotal++;
      if (!firstDate) firstDate = line.slice(0, 10).trim();
      lastDate = line.slice(0, 10).trim();
    }
  }

  return NextResponse.json({
    ok: true,
    participants: Array.from(senderSet),
    approxTotal,
    firstDate,
    lastDate
  });
}
