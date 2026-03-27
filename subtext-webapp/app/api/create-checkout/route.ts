import { NextResponse } from "next/server";
import type { ContextFormData, RelationshipType } from "@/lib/context-form-types";
import { putCheckoutBundle } from "@/lib/checkout-session-store";
import { getStripe, isStripeConfigured } from "@/lib/stripe-server";

export const runtime = "nodejs";

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "coppia",
  "conoscenza",
  "amicizia",
  "famiglia",
  "gruppo",
  "lavoro"
];

function isContextFormData(o: unknown): o is ContextFormData {
  if (!o || typeof o !== "object") return false;
  const x = o as Record<string, unknown>;
  return (
    typeof x.relationshipType === "string" &&
    RELATIONSHIP_TYPES.includes(x.relationshipType as RelationshipType) &&
    typeof x.whoAreYou === "string" &&
    typeof x.howLongKnown === "string" &&
    typeof x.ageBand === "string" &&
    (x.liveOrWorkTogether === "si" || x.liveOrWorkTogether === "no") &&
    typeof x.specificQuestion === "string"
  );
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        ok: false as const,
        code: "STRIPE_NOT_CONFIGURED",
        error:
          "Pagamenti non attivi: aggiungi STRIPE_SECRET_KEY in .env.local quando sei pronto."
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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Body mancante" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (typeof b.anonymizedChat !== "string" || !b.anonymizedChat.trim()) {
    return NextResponse.json({ ok: false, error: "Chat anonima mancante" }, { status: 400 });
  }
  if (!isContextFormData(b.formData)) {
    return NextResponse.json({ ok: false, error: "Dati modulo non validi" }, { status: 400 });
  }
  if (!Array.isArray(b.participantMap) || !b.participantMap.every((x) => typeof x === "string")) {
    return NextResponse.json({ ok: false, error: "participantMap non valido" }, { status: 400 });
  }

  const internalId = putCheckoutBundle({
    anonymizedChat: b.anonymizedChat,
    metrics: b.metrics,
    formData: b.formData,
    participantMap: b.participantMap as string[]
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const unitAmount = parseInt(process.env.REPORT_PRICE_EUR || "499", 10);
  if (Number.isNaN(unitAmount) || unitAmount < 50) {
    return NextResponse.json({ ok: false, error: "REPORT_PRICE_EUR non valido" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { subtext_internal_id: internalId },
      success_url: `${baseUrl}/report?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preview`,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            product_data: {
              name: "Report Subtext",
              description: "Report completo analisi chat (una tantum)"
            }
          },
          quantity: 1
        }
      ]
    });

    if (!session.url) {
      return NextResponse.json({ ok: false, error: "URL checkout mancante" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true as const,
      url: session.url
    });
  } catch (e) {
    console.error("[create-checkout]", e);
    return NextResponse.json(
      { ok: false, error: "Errore Stripe. Controlla le chiavi e la dashboard." },
      { status: 502 }
    );
  }
}
