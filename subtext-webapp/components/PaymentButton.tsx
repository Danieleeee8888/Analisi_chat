"use client";

import { useState } from "react";
import { PREVIEW_SESSION_KEY, parsePreviewPayload } from "@/lib/preview-storage";

export function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setErr(null);
    const raw = sessionStorage.getItem(PREVIEW_SESSION_KEY);
    const p = parsePreviewPayload(raw);
    if (!p) {
      setErr("Sessione non trovata. Torna a Carica chat e ripeti l’analisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymizedChat: p.anonymizedChat,
          metrics: p.metrics,
          formData: p.formData,
          participantMap: p.participantMap
        })
      });

      let data: { ok?: boolean; url?: string; error?: string; code?: string };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setErr("Risposta dal server non valida.");
        return;
      }

      if (data.code === "STRIPE_NOT_CONFIGURED") {
        setErr(
          data.error ??
            "Pagamenti non ancora attivi sul server (manca STRIPE_SECRET_KEY)."
        );
        return;
      }

      if (!data.ok || !data.url) {
        setErr(data.error ?? "Impossibile avviare il pagamento.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setErr("Errore di rete. Riprova tra un momento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full rounded-lg bg-stone-900 px-4 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {loading ? "Collegamento a Stripe…" : "Ottieni il report completo — 4,99€"}
      </button>
      {err ? (
        <p className="text-sm text-red-800" role="alert">
          {err}
        </p>
      ) : (
        <p className="text-xs text-amber-900/80">
          Il pagamento si apre su Stripe Checkout in ambiente sicuro. Senza chiavi
          configurate, il pulsante mostrerà un messaggio finché non aggiungi{" "}
          <code className="rounded bg-amber-100/80 px-1">STRIPE_SECRET_KEY</code> in{" "}
          <code className="rounded bg-amber-100/80 px-1">.env.local</code>.
        </p>
      )}
    </div>
  );
}
