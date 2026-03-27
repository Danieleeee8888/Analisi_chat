"use client";

import type { ReactNode } from "react";
import { PaymentButton } from "@/components/PaymentButton";
import type { ContextFormData } from "@/lib/context-form-types";

type DaypartKey = "mattina" | "pomeriggio" | "sera" | "notte";

const DAYPART_LABEL: Record<DaypartKey, string> = {
  mattina: "Mattina (6–12)",
  pomeriggio: "Pomeriggio (12–18)",
  sera: "Sera (18–24)",
  notte: "Notte (0–6)"
};

function formatMedianShort(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  if (seconds < 60) return `${Math.round(seconds)} s`;
  if (seconds < 3600) {
    const min = seconds / 60;
    const s = min >= 10 ? min.toFixed(0) : min.toFixed(1).replace(".", ",");
    return `${s} min`;
  }
  const h = seconds / 3600;
  const s = h >= 10 ? h.toFixed(0) : h.toFixed(1).replace(".", ",");
  return `${s} h`;
}

function periodCoveredHuman(timespanDays: number, dateStart?: string, dateEnd?: string): string {
  let days = timespanDays;
  if (days <= 0 && dateStart && dateEnd) {
    const parse = (iso: string) => {
      const p = iso.split("-").map(Number);
      if (p.length !== 3 || p.some(Number.isNaN)) return null;
      return new Date(p[0], p[1] - 1, p[2]);
    };
    const a = parse(dateStart);
    const b = parse(dateEnd);
    if (a && b) {
      days = Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
    }
  }
  if (days <= 0) return "—";
  const months = Math.max(1, Math.round(days / 30.44));
  if (months < 12) {
    return `${months} ${months === 1 ? "mese" : "mesi"}`;
  }
  const y = Math.floor(months / 12);
  const m = months % 12;
  const yPart = y === 1 ? "1 anno" : `${y} anni`;
  if (m === 0) return yPart;
  return `${yPart} e ${m} ${m === 1 ? "mese" : "mesi"}`;
}

function pctDisplay(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  return `${(x * 100).toFixed(1).replace(".", ",")}%`;
}

function messageSharePhrase(share: number | undefined): string {
  const p = (share ?? 0) * 100;
  if (p > 60) return "Scrive molto più dell'altro";
  if (p >= 50) return "Scrive leggermente di più";
  if (p >= 40) return "Contribuisce in modo equilibrato";
  return "Scrive meno dell'altro";
}

function medianResponsePhrase(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return "";
  const min = seconds / 60;
  if (min < 5) return "Risponde quasi subito";
  if (min <= 30) return "Risponde in tempi brevi";
  if (min <= 120) return "Risponde con calma";
  return "Prende tempo prima di rispondere";
}

function reopenPhrase(share: number | undefined): string {
  const p = (share ?? 0) * 100;
  if (p > 65) return "Riapre spesso i silenzi";
  if (p >= 35) return "Equilibrato nell'iniziare";
  return "Aspetta che sia l'altro a scrivere";
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
      {
        message_share?: number;
        conversation_start_share?: number;
      }
    >;
    daypart_usage?: {
      messages_by_daypart?: Record<
        DaypartKey,
        { total?: number; by_participant?: Record<string, number> }
      >;
    };
    response_dynamics?: {
      median_response_time_seconds_by_participant?: Record<string, number | null>;
    };
    questions?: {
      question_rate_by_participant?: Record<string, number>;
    };
  } | null;

  const meta = m?.chat_metadata;
  const order = m?.participants_order ?? participantMap;
  const pm = m?.participant_metrics ?? {};
  const day = m?.daypart_usage?.messages_by_daypart;
  const medianByP = m?.response_dynamics?.median_response_time_seconds_by_participant ?? {};
  const questionRateByP = m?.questions?.question_rate_by_participant ?? {};

  const daypartEntries: [DaypartKey, number][] = [
    ["mattina", day?.mattina?.total ?? 0],
    ["pomeriggio", day?.pomeriggio?.total ?? 0],
    ["sera", day?.sera?.total ?? 0],
    ["notte", day?.notte?.total ?? 0]
  ];
  const peak = daypartEntries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const peakLabel =
    peak[1] > 0 ? DAYPART_LABEL[peak[0]] : "—";

  const activeDays = meta?.active_days ?? 0;
  const spanDays = meta?.timespan_days ?? 0;
  const who = formData.whoAreYou.trim();

  const pA = order[0] ?? "PersonaA";
  const pB = order[1] ?? "PersonaB";

  const rates = order.map((id) => ({ id, r: questionRateByP[id] ?? 0 }));
  const sortedRates = [...rates].sort((a, b) => b.r - a.r);
  const top = sortedRates[0];
  const second = sortedRates[1];
  let questionBody: ReactNode;
  if (order.length >= 2 && top && second && Math.abs((top.r - second.r) * 100) < 2) {
    questionBody = (
      <p className="font-ui text-base leading-relaxed text-foreground">
        Entrambi fate domande in modo simile — un segno di conversazione bilanciata.
      </p>
    );
  } else if (top && order.length >= 2) {
    const otherId = order.find((id) => id !== top.id) ?? second?.id ?? "";
    const otherRate = questionRateByP[otherId] ?? 0;
    const pctTop = (top.r * 100).toFixed(1).replace(".", ",");
    let comparison = "";
    if (otherRate > 0.0005) {
      const ratio = top.r / otherRate;
      if (ratio >= 1.02) {
        const rStr = ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1).replace(".", ",");
        comparison = ` — ${rStr} volte più spesso di ${otherId}`;
      }
    } else {
      comparison = ` — molto più spesso di ${otherId}`;
    }
    questionBody = (
      <p className="font-ui text-base leading-relaxed text-foreground">
        <span className="font-semibold">{top.id}</span> usa il punto di domanda nel{" "}
        <span className="mono font-semibold text-accent">{pctTop}%</span> dei suoi messaggi
        {comparison}. Le domande segnalano chi cerca connessione, conferme, o guida la direzione
        della conversazione.
      </p>
    );
  } else {
    questionBody = (
      <p className="font-ui text-base text-muted">
        Dati sulle domande non disponibili per questa sessione.
      </p>
    );
  }

  const reportBullets = [
    `I temi su cui ${pA} si accende di più — e quelli che ${pB} evita sistematicamente`,
    "I momenti in cui il tono cambia: quando le conversazioni diventano più brevi, più tese, più distanti",
    "Chi tende a riconciliarsi per primo dopo una frizione — e con quali parole",
    "L'evoluzione nel tempo: come è cambiata la comunicazione mese per mese",
    "I pattern di affetto e cura: chi li esprime di più, in quali momenti",
    "Se presenti: segnali oggettivi di squilibrio comunicativo da osservare",
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-[var(--border)] bg-white p-7 shadow-sm">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
          Il quadro in numeri
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-muted">
              Messaggi totali
            </p>
            <p className="mono mt-2 text-4xl font-bold tabular-nums text-accent">
              {meta?.total_messages ?? "—"}
            </p>
            <p className="font-ui mt-1 text-sm text-muted">messaggi analizzati</p>
          </div>
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-muted">
              Periodo coperto
            </p>
            <p className="font-ui mt-2 text-2xl font-bold leading-snug text-foreground">
              {periodCoveredHuman(spanDays, meta?.date_start, meta?.date_end)}
            </p>
            <p className="font-ui mt-1 text-sm text-muted">di conversazione</p>
          </div>
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-muted">
              Giorni attivi
            </p>
            <p className="mono mt-2 text-2xl font-bold tabular-nums text-foreground">
              {spanDays > 0 ? `${activeDays} su ${spanDays}` : "—"}
            </p>
            <p className="font-ui mt-1 text-sm text-muted">giorni in cui vi siete scritti</p>
          </div>
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-muted">
              Ora di punta
            </p>
            <p className="font-ui mt-2 text-xl font-bold leading-snug text-foreground">
              {peakLabel}
            </p>
            <p className="font-ui mt-1 text-sm text-muted">quando parlate di più</p>
          </div>
        </div>
      </section>

      <div>
        <h2 className="font-ui text-xl font-bold text-foreground">Chi siete in questa chat</h2>
        <p className="font-ui mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
          Questi dati emergono dalla struttura dei messaggi — non dal contenuto.
        </p>
        {who ? (
          <p className="font-ui mt-3 text-sm text-muted">
            Nel modulo hai indicato: <span className="font-semibold text-foreground">«{who}»</span>.
            Le etichette qui sotto sono anonime; nel report il contesto allinea le metriche a come vi
            scrivete.
          </p>
        ) : null}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {order.map((id, idx) => {
            const share = pm[id]?.message_share;
            const med = medianByP[id];
            const cs = pm[id]?.conversation_start_share;
            const nameColor = idx === 0 ? "text-accent" : "text-accent2";
            return (
              <section
                key={id}
                className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm"
              >
                <h3 className={`font-ui text-base font-bold ${nameColor}`}>{id}</h3>
                <p className="mono mt-4 text-3xl font-bold tabular-nums text-foreground">
                  {pctDisplay(share)}
                </p>
                <p className="font-ui mt-1 text-sm text-muted">dei messaggi totali</p>
                <p className="font-ui mt-4 text-sm font-medium text-foreground">
                  {messageSharePhrase(share)}
                </p>
                <p className="font-ui mt-3 text-sm text-muted">
                  <span className="font-semibold text-foreground">Tempo mediano di risposta:</span>{" "}
                  <span className="mono font-semibold text-foreground">{formatMedianShort(med)}</span>
                  {medianResponsePhrase(med) ? ` — ${medianResponsePhrase(med)}` : ""}
                </p>
                <p className="font-ui mt-3 text-sm text-muted">
                  <span className="font-semibold text-foreground">Chi riprende i silenzi:</span>{" "}
                  {pctDisplay(cs)} — {reopenPhrase(cs)}
                </p>
                <p className="font-ui mt-4 text-[11px] italic leading-relaxed text-muted">
                  Dati basati su pattern strutturali, non sul contenuto dei messaggi.
                </p>
              </section>
            );
          })}
        </div>
      </div>

      <section className="rounded-xl border border-[#c7d2fe] bg-accent-light px-7 py-6">
        <h2 className="font-ui text-base font-bold text-accent">Un dato che sorprende</h2>
        <h3 className="font-ui mt-1 text-sm font-semibold text-foreground">Chi fa più domande?</h3>
        <div className="mt-4">{questionBody}</div>
        <p className="font-ui mt-4 text-[13px] leading-relaxed text-muted">
          Nel report completo analizziamo anche il tipo di domande: pratiche, emotive, retoriche.
        </p>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-surface p-7">
        <h2 className="font-ui text-[22px] font-bold leading-tight text-foreground">
          Cosa vedresti nel report completo
        </h2>
        <ul className="mt-6 space-y-4">
          <li className="font-ui flex gap-3 text-base leading-relaxed text-foreground">
            <span className="mt-0.5 shrink-0 text-accent3" aria-hidden>
              ✦
            </span>
            <span>{reportBullets[0]}</span>
          </li>
          {reportBullets.slice(1).map((line) => (
            <li key={line} className="font-ui flex gap-3 text-base leading-relaxed text-foreground">
              <span className="mt-0.5 shrink-0 text-accent3" aria-hidden>
                ✦
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="font-ui mt-6 text-xs italic leading-relaxed text-muted">
          Il report è generato da Claude AI (Anthropic) su dati già anonimizzati. Il testo della tua chat
          non viene mai conservato.
        </p>
      </section>

      <section className="rounded-xl bg-accent p-8 text-white shadow-sm">
        <h2 className="font-ui text-[26px] font-bold leading-tight">
          Hai i numeri.
          <br />
          Manca solo il significato.
        </h2>
        <p className="font-ui mt-5 max-w-2xl text-base leading-relaxed text-white/80">
          Il report completo incrocia tutto questo con il linguaggio reale della conversazione. Pattern,
          ritmi, evoluzioni nel tempo — in un documento chiaro che puoi rileggere con calma.
        </p>
        <p className="font-ui mb-5 mt-4 text-[13px] text-white/60">
          4,99€ · una tantum · PDF scaricabile
        </p>
        <PaymentButton />
        <p className="font-ui mt-4 text-xs text-white/50">
          Nessun abbonamento · Nessun account · Pagamento sicuro via Stripe
        </p>
      </section>
    </div>
  );
}
