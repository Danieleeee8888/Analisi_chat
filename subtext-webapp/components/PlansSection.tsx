"use client";

import Link from "next/link";
import { useState } from "react";

type TabKey = "personal" | "professional";

const personalFeaturesA = [
  "Argomenti ricorrenti e toni per tema",
  "Chi fa più domande, chi schiva",
  "Segnali di interesse vs cortesia",
  "Pattern di coinvolgimento emotivo",
  "Suggerimenti pratici su come procedere",
];

const personalFeaturesB = [
  "Ritmi, turni e latenze",
  "Chi porta il peso dell'iniziativa",
  "Asimmetrie comunicative nel tempo",
  "Pattern di tensione e riparazione",
  "Evoluzione mese per mese",
  "Aree di crescita con suggerimenti",
];

const personalFeaturesC = [
  "Tutto del piano Comunicativo",
  "Tutto del piano Tematico",
  "Ogni fase della relazione nel tempo",
  "Confronto inizio vs periodo recente",
  "Report più lungo e approfondito",
  "Analisi alert se presenti pattern critici",
];

export function PlansSection() {
  const [tab, setTab] = useState<TabKey>("personal");

  return (
    <section
      className="section-reveal border-b border-[var(--border)] bg-background"
      aria-labelledby="plans-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <p className="font-ui text-xs font-semibold uppercase tracking-widest text-accent">
          Piani e servizi
        </p>
        <h2
          id="plans-heading"
          className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Scegli il percorso giusto per te
        </h2>
        <p className="font-ui mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Pre-analisi gratuita su ogni export. Paga solo il report completo quando vuoi andare in profondità.
        </p>

        <div
          className="mt-8 inline-flex rounded-full border border-[var(--border)] bg-surface p-1"
          role="tablist"
          aria-label="Tipo di offerta"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "personal"}
            className={[
              "font-ui rounded-full px-5 py-2 text-sm font-semibold transition",
              tab === "personal"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => setTab("personal")}
          >
            Persone
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "professional"}
            className={[
              "font-ui rounded-full px-5 py-2 text-sm font-semibold transition",
              tab === "professional"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => setTab("professional")}
          >
            Professionisti
          </button>
        </div>

        {tab === "personal" ? (
          <>
            <p className="font-ui mt-8 max-w-2xl text-sm text-muted">
              Tutti i piani includono: pre-analisi gratuita, anonimizzazione automatica, metriche strutturali
              e lettura del testo da Claude AI. Cambia il focus e la profondità temporale.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Piano A — Tematico */}
              <div className="flex flex-col rounded-2xl border-2 border-accent3/30 bg-white p-6">
                <span className="self-start rounded-full bg-accent3-light px-3 py-0.5 font-ui text-[11px] font-semibold text-accent3-dark">
                  Nuove conoscenze
                </span>
                <h3 className="font-display mt-3 text-xl font-bold text-foreground">Tematico</h3>
                <div className="mt-2">
                  <span className="font-display text-3xl font-bold text-foreground">4,99€</span>
                  <span className="font-ui ml-1 text-sm text-muted">· 2 mesi</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {personalFeaturesA.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="text-sm text-accent3">✓</span>
                      <span className="font-ui text-sm text-foreground">{line}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/upload?focus=dating"
                  className="font-ui mt-6 w-full rounded-lg bg-accent3 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent3-dark"
                >
                  Inizia
                </Link>
              </div>

              {/* Piano B — Comunicativo */}
              <div className="relative flex flex-col rounded-2xl border-2 border-accent/40 bg-white p-6 pt-8 ring-2 ring-accent/20">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 font-ui text-[11px] font-bold text-white shadow-sm">
                  ⭐ Più scelto
                </span>
                <span className="self-start rounded-full bg-accent-light px-3 py-0.5 font-ui text-[11px] font-semibold text-accent">
                  Coppia e famiglia
                </span>
                <h3 className="font-display mt-3 text-xl font-bold text-foreground">Comunicativo</h3>
                <div className="mt-2">
                  <span className="font-display text-3xl font-bold text-foreground">4,99€</span>
                  <span className="font-ui ml-1 text-sm text-muted">· 6 mesi</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {personalFeaturesB.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="text-sm text-accent">✓</span>
                      <span className="font-ui text-sm text-foreground">{line}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/upload?focus=coppia"
                  className="font-ui mt-6 w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  Inizia
                </Link>
              </div>

              {/* Piano C — Completo */}
              <div className="flex flex-col rounded-2xl border-2 border-accent2/30 bg-white p-6">
                <span className="self-start rounded-full bg-accent2-light px-3 py-0.5 font-ui text-[11px] font-semibold text-accent2">
                  Tutta la chat
                </span>
                <h3 className="font-display mt-3 text-xl font-bold text-foreground">
                  Comunicativo + Tematico
                </h3>
                <div className="mt-2">
                  <span className="font-display text-3xl font-bold text-foreground">9,99€</span>
                  <span className="font-ui ml-1 text-sm text-muted">· cronologia completa</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {personalFeaturesC.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="text-sm text-accent2">✓</span>
                      <span className="font-ui text-sm text-foreground">{line}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/upload?focus=completo"
                  className="font-ui mt-6 w-full rounded-lg bg-accent2 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0f766e]"
                >
                  Inizia
                </Link>
              </div>
            </div>
            <p className="font-ui mt-6 text-center text-xs text-muted">
              Tutti i piani: metriche strutturali · lettura testo AI · suggerimenti pratici · PDF scaricabile ·
              zero archivio della chat
            </p>
          </>
        ) : (
          <>
            <p className="font-ui mt-8 max-w-2xl text-sm text-muted">
              Per team, manager e professionisti. Stessa pipeline sicura — report calibrati su contesti
              professionali.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex min-h-full flex-col rounded-2xl border-2 border-accent/30 bg-white p-7">
                <span className="mb-3 text-4xl" aria-hidden>
                  ⚙️
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Analisi team e gruppo di lavoro
                </h3>
                <p className="font-ui mt-2 text-sm leading-relaxed text-muted">
                  Chi domina i thread, chi è ai margini, chi non viene mai interpellato direttamente. Pattern di
                  decisione, distribuzione del carico comunicativo, sottogruppi impliciti. Per manager e HR prima
                  di retro o riorganizzazioni.
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {[
                    "Distribuzione turni e monologhi",
                    "Chi blocca le sequenze decisionali",
                    "Analisi sottogruppi impliciti",
                    "Report per manager, people ops o HR",
                  ].map((line) => (
                    <li key={line} className="font-ui text-sm text-foreground">
                      <span className="text-muted">·</span> {line}
                    </li>
                  ))}
                </ul>
                <p className="font-display mt-6 text-2xl font-bold text-foreground">da 29,99€</p>
                <p className="font-ui mt-1 text-xs text-muted">
                  per finestra temporale — listino completo all&apos;upload
                </p>
                <div className="mt-auto flex flex-col gap-4 pt-5">
                  <Link
                    href="/upload?audience=aziende&focus=team"
                    className="font-ui w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-dark"
                  >
                    Esplora
                  </Link>
                  <span className="self-start rounded-full bg-accent-light px-3 py-0.5 font-ui text-[11px] font-semibold text-accent">
                    People &amp; Team
                  </span>
                </div>
              </div>

              <div className="flex min-h-full flex-col rounded-2xl border-2 border-[#7c3aed]/30 bg-white p-7">
                <span className="mb-3 text-4xl" aria-hidden>
                  🧠
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">Supporto a professionisti</h3>
                <p className="font-ui mt-2 text-sm leading-relaxed text-muted">
                  Per terapeuti, counselor, coach e HR. Analisi strutturale e tematica su export anonimi —
                  supporto alla preparazione e alla supervisione. Non sostituto del giudizio clinico. Report
                  difendibile e condivisibile.
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {[
                    "Anonimizzazione pre-AI garantita",
                    "Sintesi pattern emotivi e comunicativi",
                    "Sequenze tensione → riparazione",
                    "Calibrato su linguaggio clinico e professionale",
                  ].map((line) => (
                    <li key={line} className="font-ui text-sm text-foreground">
                      <span className="text-muted">·</span> {line}
                    </li>
                  ))}
                </ul>
                <p className="font-display mt-6 text-2xl font-bold text-foreground">da 49,99€</p>
                <p className="font-ui mt-1 text-xs text-muted">piano dedicato — contattaci per casi personalizzati</p>
                <div className="mt-auto flex flex-col gap-4 pt-5">
                  <Link
                    href="/upload?audience=aziende&focus=pro"
                    className="font-ui w-full rounded-lg bg-[#7c3aed] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
                  >
                    Esplora
                  </Link>
                  <span className="self-start rounded-full bg-[#f5f3ff] px-3 py-0.5 font-ui text-[11px] font-semibold text-[#7c3aed]">
                    Clinica &amp; Coaching
                  </span>
                </div>
              </div>
            </div>
            <p className="font-ui mt-8 text-center text-sm text-muted">
              Cerchi qualcosa di diverso?{" "}
              <Link
                href="/contatti"
                className="font-semibold text-accent2 underline-offset-2 hover:underline"
              >
                Contattaci per un piano su misura →
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
