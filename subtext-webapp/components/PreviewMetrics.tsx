"use client";

import { PaymentButton } from "@/components/PaymentButton";
import type { ContextFormData } from "@/lib/context-form-types";

type DaypartKey = "mattina" | "pomeriggio" | "sera" | "notte";

const DAYPART_LABEL: Record<DaypartKey, string> = {
  mattina: "Mattina (6–12)",
  pomeriggio: "Pomeriggio (12–18)",
  sera: "Sera (18–24)",
  notte: "Notte (0–6)"
};

function formatItDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return iso;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function pct(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  return `${(x * 100).toFixed(1).replace(".", ",")}%`;
}

function describeBalance(
  participation: number | null | undefined,
  initiative: number | null | undefined
): string {
  const p = participation ?? 0;
  const i = initiative ?? 0;
  if (p < 0.15 && i < 0.25) {
    return "Complessivamente la chat appare piuttosto equilibrata: volumi simili e nessuno dei due monopolizza l’apertura dei filoni dopo una pausa.";
  }
  if (p >= 0.25 && i < 0.25) {
    return "C’è uno sbilanciamento nei volumi: uno dei due partecipanti invia sensibilmente più messaggi dell’altro.";
  }
  if (i >= 0.35) {
    return "Chi riprende la conversazione dopo un silenzio lungo non è simmetrico: uno tende a riaprire molto più spesso.";
  }
  if (p >= 0.15 && i >= 0.25) {
    return "Si notano differenze sia nei volumi sia in chi tende a riaprire: utili da approfondire nel report.";
  }
  return "Le metriche non indicano un profilo estremo: dettaglio e contesto nel report possono chiarire le dinamiche.";
}

export interface PreviewMetricsProps {
  metrics: unknown;
  formData: ContextFormData;
  participantMap: string[];
}

export function PreviewMetrics({ metrics, formData, participantMap }: PreviewMetricsProps) {
  const m = metrics as {
    chat_metadata?: {
      date_start?: string;
      date_end?: string;
      total_messages?: number;
      active_days?: number;
      timespan_days?: number;
    };
    participants_order?: string[];
    participant_metrics?: Record<
      string,
      { message_share?: number; conversation_start_share?: number }
    >;
    daypart_usage?: {
      messages_by_daypart?: Record<
        DaypartKey,
        { total?: number; by_participant?: Record<string, number> }
      >;
    };
    synthetic_indices?: {
      participation_balance_index?: number | null;
      initiative_balance_index?: number | null;
      responsiveness_balance_index?: number | null;
    };
  } | null;

  const meta = m?.chat_metadata;
  const order = m?.participants_order ?? participantMap;
  const pm = m?.participant_metrics ?? {};
  const day = m?.daypart_usage?.messages_by_daypart;
  const synth = m?.synthetic_indices;

  const daypartEntries: [DaypartKey, number][] = [
    ["mattina", day?.mattina?.total ?? 0],
    ["pomeriggio", day?.pomeriggio?.total ?? 0],
    ["sera", day?.sera?.total ?? 0],
    ["notte", day?.notte?.total ?? 0]
  ];
  const peak = daypartEntries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const peakLabel =
    peak[1] > 0 ? DAYPART_LABEL[peak[0]] : "— (nessun messaggio classificato)";

  const activeDays = meta?.active_days ?? 0;
  const spanDays = meta?.timespan_days ?? 0;

  const who = formData.whoAreYou.trim();

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Panoramica
        </h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-stone-500">Periodo</dt>
            <dd className="mt-0.5 font-medium text-stone-900">
              {meta?.date_start && meta?.date_end
                ? `Dal ${formatItDate(meta.date_start)} al ${formatItDate(meta.date_end)}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Messaggi totali</dt>
            <dd className="mt-0.5 font-medium text-stone-900">
              {meta?.total_messages ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Giorni attivi / arco temporale</dt>
            <dd className="mt-0.5 font-medium text-stone-900">
              {spanDays > 0 ? `${activeDays} / ${spanDays}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Fascia oraria più attiva</dt>
            <dd className="mt-0.5 font-medium text-stone-900">{peakLabel}</dd>
          </div>
        </dl>
      </section>

      {who ? (
        <p className="rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-700">
          <span className="font-medium text-stone-900">Nel modulo hai indicato: </span>
          «{who}». I codici qui sotto (PersonaA, PersonaB…) sono anonimi; nel report
          completo il contesto serve ad allineare le metriche a come vi scrivete.
        </p>
      ) : null}

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Distribuzione messaggi
        </h2>
        <ul className="mt-4 space-y-3">
          {order.map((id) => {
            const share = pm[id]?.message_share;
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="font-medium text-stone-900">{id}</span>
                <span className="tabular-nums text-stone-700">{pct(share)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Chi riprende le conversazioni
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Quota di segmenti in cui ciascuno ha inviato per primo un messaggio dopo
          una pausa lunga (come da criteri tecnici dell’analisi).
        </p>
        <ul className="mt-4 space-y-3">
          {order.map((id) => {
            const cs = pm[id]?.conversation_start_share;
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="font-medium text-stone-900">{id}</span>
                <span className="tabular-nums text-stone-700">{pct(cs)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Equilibrio comunicativo
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-stone-700">
          {describeBalance(
            synth?.participation_balance_index ?? null,
            synth?.initiative_balance_index ?? null
          )}
        </p>
        <p className="mt-3 text-xs text-stone-500">
          Indicatore descrittivo basato su volumi e aperture di conversazione, non
          una valutazione della relazione.
        </p>
      </section>

      <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
        <p className="text-sm font-medium leading-relaxed text-amber-950">
          Abbiamo analizzato la struttura della tua chat. Questi sono i tuoi dati
          reali. Per scoprire cosa significano davvero — pattern comunicativi,
          dinamiche relazionali, aree di crescita e molto altro — il report
          completo è a 4,99€.
        </p>
        <div className="mt-5">
          <PaymentButton />
        </div>
      </section>
    </div>
  );
}
