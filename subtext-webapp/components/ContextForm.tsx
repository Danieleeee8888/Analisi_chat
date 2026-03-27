"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AGE_BAND_OPTIONS,
  createEmptyForm,
  HOW_LONG_OPTIONS,
  periodOptionsForSegment,
  RELATIONSHIP_OPTIONS,
  RELATIONSHIP_OPTIONS_ENTERPRISE,
  type AudienceSegment,
  type ContextFormData
} from "@/lib/context-form-types";

export interface ContextFormProps {
  /** Da URL / home: determina copy, prezzi e opzioni periodo. */
  audienceSegment: AudienceSegment;
  disabled?: boolean;
  /** Disabilita campi e mostra stato invio (API). */
  isSubmitting?: boolean;
  onSubmit: (data: ContextFormData) => void;
  participants?: string[];
  chatMeta?: {
    approxTotal: number;
    firstDate: string | null;
    lastDate: string | null;
  } | null;
}

function formatPeekDateFragment(raw: string | null): string {
  if (!raw) return "—";
  const s = raw.replace(/,\s*$/, "").trim();
  return s || "—";
}

export function ContextForm({
  audienceSegment,
  disabled,
  isSubmitting,
  onSubmit,
  participants = [],
  chatMeta = null
}: ContextFormProps) {
  const isEnt = audienceSegment === "enterprise";
  const [data, setData] = useState(() => createEmptyForm(audienceSegment));
  const locked = Boolean(disabled || isSubmitting);
  const periodOpts = periodOptionsForSegment(audienceSegment);
  const relOpts = isEnt ? RELATIONSHIP_OPTIONS_ENTERPRISE : RELATIONSHIP_OPTIONS;

  const fieldClass = [
    "mt-1.5 w-full rounded-lg border bg-white px-3 py-2 font-ui text-sm text-foreground shadow-sm placeholder:text-muted focus:outline-none disabled:opacity-50",
    isEnt
      ? "border-teal-200/85 focus:border-accent2 focus:ring-2 focus:ring-accent2/25"
      : "border-[var(--border)] focus:border-accent focus:ring-2 focus:ring-accent/25",
  ].join(" ");

  const radioAccentClass = isEnt ? "accent-teal-600" : "accent-indigo-500";

  const update = <K extends keyof ContextFormData>(key: K, value: ContextFormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    onSubmit({ ...data, audienceSegment });
  };

  const canSubmit =
    data.whoAreYou.trim().length > 0 &&
    data.howLongKnown.length > 0 &&
    data.ageBand.length > 0;

  const selectedPeriod = periodOpts.find((o) => o.value === data.analysisPeriod);
  const buttonLabel = isSubmitting
    ? "Elaborazione in corso…"
    : `Analizza · ${selectedPeriod?.price ?? (isEnt ? "59,99€" : "4,99€")}`;

  const periodAccentSelected = isEnt
    ? "border-accent2 bg-accent2-light"
    : "border-accent bg-accent-light";
  const periodAccentHover = isEnt ? "hover:border-accent2/50" : "hover:border-accent/40";
  const periodPriceSelected = isEnt ? "text-accent2" : "text-accent";
  const submitClass = isEnt
    ? "bg-accent2 hover:bg-[#0f766e] focus-visible:ring-accent2/30"
    : "bg-accent hover:bg-accent-dark focus-visible:ring-accent/25";

  return (
    <>
      {isEnt && (
        <div className="mb-6 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/90 to-white px-5 py-4 font-ui text-sm text-foreground shadow-sm">
          <p className="font-semibold text-accent2">Contesto organizzativo</p>
          <p className="mt-2 leading-relaxed text-muted">
            Stesse garanzie del percorso privato: parsing in memoria, anonimizzazione prima dell’AI, zero
            archivio testuale. Il report unisce{" "}
            <span className="font-medium text-foreground">metriche osservabili</span> e{" "}
            <span className="font-medium text-foreground">lettura di contesto, tono e temi</span> sul testo
            anonimo — utile a decisioni e a preparazione professionale.
          </p>
          <p className="mt-3 rounded-lg border border-teal-200/60 bg-white/80 px-3 py-2 text-[13px] leading-snug text-muted">
            <span className="font-medium text-foreground">Altri canali oltre WhatsApp?</span> Per team e
            organizzazioni sono valutabili{" "}
            <span className="font-medium text-foreground">piani personalizzati</span> (es. Slack, Teams,
            export da altre piattaforme).{" "}
            <Link href="/contatti" className="font-semibold text-accent2 underline-offset-2 hover:underline">
              Scrivici in contatti
            </Link>{" "}
            per strutturare il flusso.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-[13px] leading-snug text-muted">
            <li>
              Terapeuti, psicologi, counselor: sintesi strutturale per supervisione — non sostituto
              clinico.
            </li>
            <li>Manager e capiufficio: ritmo con molti collaboratori, rischio di essere letti come “freddi”.</li>
            <li>Sales / account / HR: handoff, escalation, carico asincrono nel thread.</li>
            <li>Brainstorm e progetti: riordino di temi e turni dopo chat lunghe.</li>
          </ul>
        </div>
      )}

      {!isEnt && (
        <div className="mb-6 rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/80 to-white px-5 py-4 font-ui text-sm shadow-sm">
          <p className="font-semibold text-accent">Contesto personale</p>
          <p className="mt-2 leading-relaxed text-muted">
            Coppie, nuove conoscenze, famiglia, amici. Il campo libero può indicare cosa vuoi chiarire
            (es. dopo un periodo difficile): il modello incrocia numeri e linguaggio sul testo anonimo.
          </p>
        </div>
      )}

      {chatMeta && (
        <div
          className="mb-6 flex flex-row flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-surface px-4 py-3"
          role="status"
          aria-live="polite"
        >
          <p className="font-ui text-[13px] leading-snug text-[var(--text-secondary)]">
            <span aria-hidden>📊 </span>
            {chatMeta.approxTotal} messaggi · Dal {formatPeekDateFragment(chatMeta.firstDate)} al{" "}
            {formatPeekDateFragment(chatMeta.lastDate)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="relationship" className="font-ui block text-sm font-medium text-foreground">
            1. {isEnt ? "Contesto della conversazione" : "Tipo di relazione"}
          </label>
          <select
            id="relationship"
            className={fieldClass}
            value={data.relationshipType}
            onChange={(e) =>
              update("relationshipType", e.target.value as ContextFormData["relationshipType"])
            }
            disabled={locked}
          >
            {relOpts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-2 font-ui text-[12px] leading-snug text-[var(--text-secondary)]">
            {isEnt
              ? "Usato per calibrare lessico e sezioni del report (B2B, team, trattativa)."
              : "Allinea le sezioni del report al tipo di legame (es. coppia vs nuova conoscenza)."}
          </p>
        </div>

        <div>
          <label htmlFor="whoAreYou" className="font-ui block text-sm font-medium text-foreground">
            2.{" "}
            {isEnt
              ? "Il tuo ruolo (come compare nella chat)"
              : "Chi sei tu in questa chat?"}
          </label>
          {participants.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="self-center font-ui text-xs text-muted">Trovati:</span>
              {participants.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => update("whoAreYou", name)}
                  disabled={locked}
                  className={`rounded-full border px-3 py-1 font-ui text-xs font-medium transition-all ${
                    data.whoAreYou === name
                      ? isEnt
                        ? "border-accent2 bg-accent2 text-white"
                        : "border-accent bg-accent text-white"
                      : isEnt
                        ? "border-[var(--border)] bg-surface text-muted hover:border-accent2 hover:text-accent2"
                        : "border-[var(--border)] bg-surface text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          <input
            id="whoAreYou"
            type="text"
            autoComplete="off"
            placeholder={
              isEnt
                ? "Es. nome e ruolo come in WhatsApp / Slack export"
                : "Es. il mio nome come compare in WhatsApp"
            }
            className={fieldClass}
            value={data.whoAreYou}
            onChange={(e) => update("whoAreYou", e.target.value)}
            disabled={locked}
          />
          <p className="mt-1.5 font-ui text-[11px] text-[var(--text-secondary)]">
            Il nome verrà anonimizzato prima dell’analisi AI
          </p>
        </div>

        <div>
          <label htmlFor="howLong" className="font-ui block text-sm font-medium text-foreground">
            3.{" "}
            {isEnt
              ? "Da quanto tempo è attivo questo rapporto o progetto?"
              : "Da quanto vi sentite o conoscete?"}
          </label>
          <select
            id="howLong"
            className={fieldClass}
            value={data.howLongKnown}
            onChange={(e) => update("howLongKnown", e.target.value)}
            disabled={locked}
          >
            <option value="">Seleziona…</option>
            {HOW_LONG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset disabled={locked} className="space-y-2">
          <legend className="font-ui text-sm font-medium text-foreground">
            4.{" "}
            {isEnt
              ? "Stesso ufficio, stesso ecosistema digitale o collaborazione solo remota?"
              : "Vivete o lavorate insieme?"}
          </legend>
          <div className="flex gap-6 pt-1">
            <label className="font-ui flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="radio"
                name="liveTogether"
                className={radioAccentClass}
                checked={data.liveOrWorkTogether === "si"}
                onChange={() => update("liveOrWorkTogether", "si")}
              />
              Stesso contesto fisico / organizzativo
            </label>
            <label className="font-ui flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="radio"
                name="liveTogether"
                className={radioAccentClass}
                checked={data.liveOrWorkTogether === "no"}
                onChange={() => update("liveOrWorkTogether", "no")}
              />
              {isEnt ? "Principalmente remoto / esterno" : "No"}
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="ageBand" className="font-ui block text-sm font-medium text-foreground">
            5.{" "}
            {isEnt
              ? "Fascia d’età prevalente del gruppo (o preferisci non indicare)"
              : "Età tua e dell’altra persona (fascia)"}
          </label>
          <select
            id="ageBand"
            className={fieldClass}
            value={data.ageBand}
            onChange={(e) => update("ageBand", e.target.value)}
            disabled={locked}
          >
            <option value="">Seleziona…</option>
            {AGE_BAND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="specific" className="font-ui block text-sm font-medium text-foreground">
            6.{" "}
            {isEnt
              ? "Obiettivo analitico o ipotesi da verificare (opzionale)"
              : "C’è qualcosa di specifico che vuoi capire?"}{" "}
            <span className="font-normal text-muted">(opzionale)</span>
          </label>
          <textarea
            id="specific"
            rows={3}
            placeholder={
              isEnt
                ? "Es. capire se il cliente percepisce ritardi strutturali, o se il team evita decisioni…"
                : "Es. capire se ci sono pattern dopo le litigate…"
            }
            className={`${fieldClass} resize-y`}
            value={data.specificQuestion}
            onChange={(e) => update("specificQuestion", e.target.value)}
            disabled={locked}
          />
        </div>

        <div>
          <p className="font-ui text-sm font-medium text-foreground">7. Quanto vuoi analizzare?</p>
          <p className="mt-0.5 font-ui text-[12px] text-[var(--text-secondary)]">
            {isEnt
              ? "Finestra temporale e profondità del report — listino dedicato organizzazioni"
              : "Influisce sul prezzo e sulla profondità dell’analisi"}
          </p>
          <div className="mt-3 flex w-full flex-col gap-3">
            {periodOpts.map((opt) => {
              const selected = data.analysisPeriod === opt.value;
              const badgeClass =
                opt.value === "full"
                  ? "bg-accent2-light text-accent2"
                  : opt.value === "2months"
                    ? "bg-accent3-light text-accent3-dark"
                    : isEnt
                      ? "bg-accent2 text-white"
                      : "bg-accent text-white";
              const label = `Analisi ${opt.label}, prezzo ${opt.price}`;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("analysisPeriod", opt.value)}
                  disabled={locked}
                  aria-pressed={selected}
                  aria-label={label}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    selected ? periodAccentSelected : `border-[var(--border)] bg-white ${periodAccentHover}`
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 gap-y-1.5">
                        <p className="font-ui text-sm font-semibold text-foreground">{opt.label}</p>
                        {opt.badge ? (
                          <span
                            className={`inline-flex max-w-full rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-tight ${badgeClass}`}
                          >
                            {opt.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 font-ui text-xs leading-relaxed text-muted">{opt.sublabel}</p>
                    </div>
                    <p
                      className={`shrink-0 font-mono text-lg font-bold tabular-nums sm:pt-0.5 sm:text-right ${
                        selected ? periodPriceSelected : "text-foreground"
                      }`}
                    >
                      {opt.price}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={locked || !canSubmit}
          className={`font-ui w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${submitClass}`}
        >
          {buttonLabel}
        </button>
        {!canSubmit && !locked && (
          <p className="font-ui text-xs text-muted">
            Compila i campi obbligatori (2, 3 e 5) per abilitare l’analisi.
          </p>
        )}
      </form>
    </>
  );
}
