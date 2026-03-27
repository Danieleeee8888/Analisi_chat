import { NextResponse } from "next/server";
import { deleteCheckoutBundle, getCheckoutBundle } from "@/lib/checkout-session-store";
import { generateReport } from "@/lib/claude";
import { getStripe, isStripeConfigured } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        ok: false as const,
        code: "STRIPE_NOT_CONFIGURED",
        error: "Stripe non configurato."
      },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON non valido" }, { status: 400 });
  }

  const sessionId =
    body && typeof body === "object" && typeof (body as { sessionId?: unknown }).sessionId === "string"
      ? (body as { sessionId: string }).sessionId
      : null;

  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "sessionId mancante" }, { status: 400 });
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ ok: false, error: "Sessione Stripe non trovata" }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ ok: false, error: "Pagamento non completato" }, { status: 402 });
  }

  const internalId = session.metadata?.subtext_internal_id;
  if (!internalId) {
    return NextResponse.json({ ok: false, error: "Metadati sessione mancanti" }, { status: 400 });
  }

  const bundle = getCheckoutBundle(internalId);
  if (!bundle) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Dati non disponibili o già utilizzati. Se hai pagato, contatta il supporto con l’ID sessione."
      },
      { status: 410 }
    );
  }

  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  const demoMode = !hasAnthropic;

  try {
    let markdown: string;
    if (demoMode) {
      markdown = [
        "# Report dimostrativo",
        "",
        "> **Modalità demo**: `ANTHROPIC_API_KEY` non è configurata. Nessuna chiamata a Claude.",
        "",
        "Quando aggiungi la chiave in `.env.local` e riavvii il server, qui comparirà il report completo generato dall’AI.",
        "",
        "---",
        "",
        `**Partecipanti anonimi:** ${bundle.participantMap.join(", ")}`,
        "",
        `**Messaggi in analisi (caratteri):** ${bundle.anonymizedChat.length}`,
        ""
      ].join("\n");
    } else {
      markdown = await generateReport(
        bundle.anonymizedChat,
        bundle.metrics as object,
        bundle.formData
      );
    }

    deleteCheckoutBundle(internalId);

    return NextResponse.json({
      ok: true as const,
      markdown,
      demo: demoMode
    });
  } catch (e) {
    console.error("[generate-report]", e);
    const msg = e instanceof Error ? e.message : "Errore nella generazione del report";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
