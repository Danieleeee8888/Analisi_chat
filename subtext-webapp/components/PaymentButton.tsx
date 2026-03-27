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
        className="font-ui w-full rounded-lg bg-white px-4 py-3.5 text-sm font-bold text-accent shadow-sm transition hover:bg-white/95 active:scale-[0.98] disabled:cursor-wait disabled:opacity-90 sm:w-auto"
      >
        {loading ? "Collegamento a Stripe…" : "Ottieni il report completo"}
      </button>
      {err ? (
        <p className="font-ui text-sm font-medium text-red-100" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}
