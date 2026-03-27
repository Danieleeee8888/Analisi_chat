import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Placeholder Step 8 — Puppeteer o altra pipeline PDF. */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Esportazione PDF non ancora abilitata. Usa Stampa → PDF dal browser come alternativa temporanea."
    },
    { status: 501 }
  );
}
