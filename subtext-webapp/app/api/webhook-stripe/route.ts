import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markCheckoutPaid } from "@/lib/checkout-session-store";
import { getStripe, isStripeConfigured } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!isStripeConfigured() || !whSecret) {
    return new NextResponse("Webhook non configurato (STRIPE_WEBHOOK_SECRET)", {
      status: 501
    });
  }

  if (!stripe) {
    return new NextResponse("Stripe non inizializzato", { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sess = event.data.object as Stripe.Checkout.Session;
    const id = sess.metadata?.subtext_internal_id;
    if (id) {
      markCheckoutPaid(id);
    }
  }

  return NextResponse.json({ received: true });
}
