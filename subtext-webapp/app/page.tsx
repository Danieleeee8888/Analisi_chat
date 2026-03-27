"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Carica",
    description:
      "Esporti la conversazione da WhatsApp come .zip — anche senza media, se preferisci. Il file viene elaborato sul server secondo le regole del prodotto: messaggi in memoria per il calcolo, senza costruire un archivio personale della tua chat.",
    highlight: "Nessun dato salvato dopo l'analisi",
    Icon: StepIconUpload,
    accentClass: "text-accent3",
    numColor: "#f97316",
    visualClass: "bg-gradient-to-br from-[#fff7ed] to-[#fed7aa]",
  },
  {
    title: "Leggi",
    description:
      "In pochi secondi ottieni una pre-analisi gratuita: chi scrive di più, chi riapre dopo una pausa, come si distribuiscono i messaggi nel tempo. Numeri prima delle parole — così puoi valutare con calma cosa ha senso approfondire.",
    highlight: "Elaborazione locale + AI sicura",
    Icon: StepIconChart,
    accentClass: "text-accent",
    numColor: "#6366f1",
    visualClass: "bg-gradient-to-br from-[#eef2ff] to-[#c7d2fe]",
  },
  {
    title: "Approfondisci",
    description:
      "Il report completo (a pagamento) incrocia le metriche con un testo chiaro, generato con Claude di Anthropic sul dato già anonimizzato. Pattern, ritmi e ripetizioni diventano un documento che puoi rileggere e condividere come preferisci.",
    highlight: "PDF scaricabile, tuo per sempre",
    Icon: StepIconReport,
    accentClass: "text-accent2",
    numColor: "#0d9488",
    visualClass: "bg-gradient-to-br from-[#f0fdfa] to-[#99f6e4]",
  },
] as const;

function StepIconUpload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 4v11m0 0 4-4m-4 4-4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepIconChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 19V5m4 14V9m4 10v-6m4 6v-9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepIconReport({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 4h8l2 2v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ReportMockupCard({ dateLabel }: { dateLabel: string }) {
  const blocks = [
    { title: "Ritmo e asimmetria" },
    { title: "Silenzi e riprese" },
    { title: "Temi ricorrenti" },
  ] as const;
  return (
    <div
      className="w-full max-w-[280px] rounded-xl border border-[var(--border)] bg-white p-5 shadow-lg"
      aria-hidden
    >
      <div className="flex items-start justify-between gap-2">
        <p className="mono text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          SUBTEXT REPORT
        </p>
        <p className="mono text-[10px] text-[var(--text-secondary)]">{dateLabel || "—"}</p>
      </div>
      <div className="mt-5 space-y-5">
        {blocks.map((b) => (
          <div key={b.title}>
            <p className="font-display text-sm font-bold text-foreground">{b.title}</p>
            <div className="report-shimmer-line mt-2 w-full" />
            <div className="report-shimmer-line mt-2 w-[92%]" />
          </div>
        ))}
      </div>
      <div className="font-ui mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-[13px] font-bold text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Scarica PDF
      </div>
    </div>
  );
}

/** Visual hero animato (pattern / segnali) — solo decorativo */
function HeroAnimatedVisual() {
  const nBars = 14;
  return (
    <div
      className="hero-make-root relative mx-auto w-full max-w-[400px] select-none lg:mx-0 lg:ml-auto lg:max-w-[440px]"
      aria-hidden
    >
      <div className="hero-make-aurora pointer-events-none absolute -inset-10 -z-10 rounded-[44px] bg-[conic-gradient(from_120deg_at_50%_50%,#a78bfa_0%,#fbbf24_35%,#2dd4bf_70%,#818cf8_100%)] opacity-80 blur-3xl" />

      <div className="relative rounded-[28px] border border-violet-200/70 bg-white/80 p-[3px] shadow-[0_28px_80px_rgba(99,102,241,0.2),0_12px_32px_rgba(249,115,22,0.08)] backdrop-blur-md">
        <div className="relative min-h-[280px] overflow-visible rounded-[25px] bg-gradient-to-br from-white via-violet-50/50 to-amber-50/40 px-5 pb-10 pt-6 sm:min-h-[300px]">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-md">
              Segnali in tempo reale
            </span>
            <div className="flex items-center gap-1.5">
              <span className="hero-make-dot h-2 w-2 rounded-full bg-emerald-500" />
              <span
                className="hero-make-dot h-2 w-2 rounded-full bg-amber-400"
                style={{ animationDelay: "0.25s" }}
              />
              <span
                className="hero-make-dot h-2 w-2 rounded-full bg-violet-500"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>

          <p className="font-ui mt-4 text-center text-[11px] font-semibold uppercase tracking-widest text-violet-600/90">
            Pattern estratti dal testo
          </p>

          <div className="hero-make-waves relative z-[1] mt-6 flex h-[120px] items-end justify-center gap-[5px] px-1 sm:h-[140px] sm:gap-1.5">
            {Array.from({ length: nBars }, (_, i) => (
              <div
                key={i}
                className="hero-make-wave-bar w-[6px] rounded-full bg-gradient-to-t from-violet-600 via-indigo-500 to-amber-400 sm:w-2"
              />
            ))}
          </div>

          <div className="hero-make-spark pointer-events-none absolute left-1/2 top-[52%] z-[2] -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity={0.95}
                />
                <path
                  d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </svg>
            </div>
          </div>

          <div
            className="hero-make-float-tag hero-make-tag-1 pointer-events-none absolute left-[4%] top-[22%] z-[3] rounded-full border border-violet-200 bg-white px-2.5 py-1 font-ui text-[10px] font-bold text-violet-700 shadow-md"
          >
            Ritmo
          </div>
          <div
            className="hero-make-float-tag hero-make-tag-2 pointer-events-none absolute right-[2%] top-[38%] z-[3] rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-ui text-[10px] font-bold text-amber-800 shadow-md"
          >
            Squilibrio
          </div>
          <div
            className="hero-make-float-tag hero-make-tag-3 pointer-events-none absolute bottom-[14%] left-[8%] z-[3] rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 font-ui text-[10px] font-bold text-teal-800 shadow-md"
          >
            Ripresa
          </div>

          <div
            className="hero-make-orbit-ring pointer-events-none absolute left-1/2 top-1/2 z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-200/50 sm:h-[220px] sm:w-[220px]"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

const useCasesPersonal = [
  {
    emoji: "💬",
    title: "State ancora davvero comunicando?",
    body:
      "Dopo anni insieme è facile perdere il filo. Subtext mostra chi ha smesso di fare domande, chi risponde sempre tardi, chi ha cambiato tono negli ultimi mesi — e quali argomenti accendono ancora la conversazione. Non per giudicare, per capire.",
    tag: "Coppia",
    tagClass: "bg-accent-light text-accent",
  },
  {
    emoji: "🔍",
    title: "È davvero interessato a te?",
    body:
      "Quando si conosce qualcuno di nuovo è difficile leggere i segnali. La frequenza, la lunghezza dei messaggi, chi riprende sempre la conversazione e su quali temi l'altro si accende di più — tutto questo racconta un interesse reale o una cortesia di facciata.",
    tag: "Nuove conoscenze",
    tagClass: "bg-accent3-light text-accent3-dark",
  },
  {
    emoji: "🌍",
    title: "La distanza si sente anche nei messaggi.",
    body:
      "Le coppie lontane comunicano quasi solo per testo. Subtext analizza se il ritmo di contatto è cambiato nel tempo, se le conversazioni si accorciano, se uno dei due porta sempre il peso di ricominciare — e se certi argomenti sono spariti dal vostro vocabolario.",
    tag: "Long distance",
    tagClass: "bg-accent-light text-accent",
  },
  {
    emoji: "🛡️",
    title: "Quando qualcosa non torna.",
    body:
      "Subtext rileva pattern oggettivi che possono indicare squilibri: richieste di localizzazione ripetute, isolamento progressivo da amici e famiglia, cicli ravvicinati di tensione e riconciliazione. Non diagnostica — segnala. Con rispetto e senza allarmismi. Per i casi più seri indica risorse concrete come il Numero Verde 1522.",
    tag: "Sicurezza",
    tagClass: "bg-[#fef2f2] text-[#dc2626]",
  },
  {
    emoji: "🧠",
    title: "Come comunichi tu, in ogni relazione?",
    body:
      "Carica più chat diverse — coppia, amici, lavoro — e scopri il tuo stile comunicativo trasversale. Sei chi fa domande o chi risponde? Chi riapre i silenzi o chi li lascia cadere? Quali temi porti sempre tu e quali eviti? La consapevolezza è il primo passo per migliorare.",
    tag: "Self-awareness",
    tagClass: "bg-accent2-light text-accent2",
  },
] as const;

const useCasesEnterprise = [
  {
    emoji: "🤝",
    title: "Qualità reale del rapporto con clienti e partner",
    body:
      "Tempi di risposta, lunghezza dei messaggi, chi traina le trattative e dove si interrompe il flusso: segnali comportamentali utili a sales, customer success e consulenti — senza interpretazioni da tisaniera.",
    tag: "Sales & account",
    tagClass: "bg-accent2-light text-accent2",
  },
  {
    emoji: "⚙️",
    title: "Team asincroni: chi porta il carico invisibile?",
    body:
      "Nei canali di progetto emergono monopolisti del thread, silenzi prolungati dopo le decisioni, escalation implicite. Dati per 1:1 più onesti e per ridisegnare responsabilità.",
    tag: "People & team",
    tagClass: "bg-[#eef2ff] text-accent",
  },
  {
    emoji: "📋",
    title: "Leadership: feedback tra righe",
    body:
      "Manager e HR possono usare export anonimizzati per preparare colloqui, debrief post-progetto o momenti di coaching — sempre con metriche osservabili, mai con gossip.",
    tag: "HR / Leadership",
    tagClass: "bg-[#f0fdf4] text-[#15803d]",
  },
  {
    emoji: "🔐",
    title: "Workflow sobrio e difendibile",
    body:
      "Niente training sui vostri messaggi, niente archivio a fine analisi: adatto a contesti in cui privacy e reputazione contano quanto l’insight.",
    tag: "Compliance-ready",
    tagClass: "bg-surface text-foreground ring-1 ring-[var(--border)]",
  },
] as const;

export default function Home() {
  const [indigoParallaxPx, setIndigoParallaxPx] = useState(0);
  const [reportDate, setReportDate] = useState("");
  const comeFunzionaRef = useRef<HTMLUListElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const reportMockRef = useRef<HTMLDivElement>(null);
  const indigoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setReportDate(
      new Date().toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = indigoRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const mid = r.top + r.height / 2;
      const raw = (vh / 2 - mid) * 0.1;
      const offset = Math.max(-28, Math.min(28, raw));
      setIndigoParallaxPx(offset);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    };

    const observers: IntersectionObserver[] = [];

    const observeCardReveals = (root: HTMLElement | null) => {
      if (!root) return;
      const els = root.querySelectorAll<HTMLElement>("li.card-reveal");
      if (!els.length) return;
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      }, options);
      for (const el of els) io.observe(el);
      observers.push(io);
    };

    observeCardReveals(comeFunzionaRef.current);

    const statsEl = statsRef.current;
    if (statsEl) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) e.target.classList.add("visible");
          }
        },
        { threshold: 0.2 },
      );
      io.observe(statsEl);
      observers.push(io);
    }

    const reportEl = reportMockRef.current;
    if (reportEl) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) e.target.classList.add("visible");
          }
        },
        { threshold: 0.15 },
      );
      io.observe(reportEl);
      observers.push(io);
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.14)_0%,transparent_42%),linear-gradient(225deg,rgba(249,115,22,0.11)_0%,transparent_45%),linear-gradient(180deg,rgba(13,148,136,0.08)_0%,transparent_55%),linear-gradient(90deg,rgba(253,230,138,0.15)_0%,transparent_35%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-amber-300/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/15 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-[1200px] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,440px)] lg:gap-10 xl:gap-14">
            <div className="min-w-0">
              <p
                className="hero-fade-up mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm sm:text-xs"
                style={{ animationDelay: "0s" }}
              >
                <span className="text-accent">Analisi</span>
                <span className="hidden text-[var(--text-secondary)] sm:inline">·</span>
                <span className="text-[var(--text-secondary)]">metodo + AI (Claude)</span>
              </p>

              <div className="hero-title-wrap max-w-[36rem]">
                <h1
                  className="hero-fade-up hero-h1 font-display text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
                  style={{ animationDelay: "0.08s" }}
                >
                  Lettura professionale dei pattern nelle conversazioni digitali.
                </h1>
              </div>

              <p
                className="hero-fade-up font-ui mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl"
                style={{ animationDelay: "0.15s" }}
              >
                La vera svolta è il <strong className="font-semibold text-foreground">metodo</strong>{" "}
                con cui trasformiamo migliaia di messaggi in{" "}
                <strong className="font-semibold text-foreground">pattern e segnali</strong> che, a
                colpo d&apos;occhio, passerebbero inosservati — ritmo, pause, squilibri, ripartenze.
                Poi entra in gioco l&apos;
                <strong className="font-semibold text-foreground">AI</strong> (Claude): dà voce ai
                numeri e ti restituisce un report leggibile in pochi minuti. Niente fuffa: struttura
                resa chiara, per privati e per team che vogliono decidere con dati, non con
                sensazioni.
              </p>

              <div
                className="hero-fade-up hero-accent-bar mt-8 max-w-md"
                style={{ animationDelay: "0.22s" }}
                aria-hidden
              />
            </div>

            <div
              className="hero-fade-up flex min-w-0 justify-center lg:justify-end"
              style={{ animationDelay: "0.18s" }}
            >
              <HeroAnimatedVisual />
            </div>
          </div>

          <div
            className="hero-fade-up mt-12 grid gap-5 md:grid-cols-2 md:gap-6 lg:mt-14"
            style={{ animationDelay: "0.28s" }}
          >
            <Link
              href="/upload"
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-violet-200 bg-white p-7 shadow-[0_20px_50px_rgba(99,102,241,0.12)] transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_24px_60px_rgba(99,102,241,0.18)]"
            >
              <span className="font-ui text-[11px] font-bold uppercase tracking-widest text-violet-600">
                Persone &amp; relazioni
              </span>
              <h2 className="font-display mt-3 text-2xl font-bold text-foreground sm:text-[26px]">
                Coppie, amicizie, nuove conoscenze
              </h2>
              <p className="font-ui mt-3 flex-1 text-sm leading-relaxed text-muted">
                Stessi strumenti che usano linguisti e ricercatori sul testo: ritmo, reciprocità,
                silenzi. Pensato per chi vuole capire — non per chi cerca drama.
              </p>
              <span className="font-ui mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">
                Inizia — pre-analisi gratuita
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
              <span className="font-ui mt-2 text-xs text-muted">Report da 4,99€ · solo italiano</span>
            </Link>

            <Link
              href="/upload?audience=aziende"
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50/80 p-7 shadow-[0_20px_50px_rgba(13,148,136,0.1)] transition hover:-translate-y-0.5 hover:border-accent2 hover:shadow-[0_24px_60px_rgba(13,148,136,0.16)]"
            >
              <span className="font-ui text-[11px] font-bold uppercase tracking-widest text-accent2">
                Organizzazioni
              </span>
              <h2 className="font-display mt-3 text-2xl font-bold text-foreground sm:text-[26px]">
                Team, clienti, stakeholder
              </h2>
              <p className="font-ui mt-3 flex-1 text-sm leading-relaxed text-muted">
                Listino e moduli dedicati: linguaggio orientato a decisioni, handoff e carico
                comunicativo. Utile a HR, sales e leader che lavorano con dati, non con voci di
                corridoio.
              </p>
              <span className="font-ui mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent2">
                Area aziende — analizza
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
              <span className="font-ui mt-2 text-xs text-muted">Report da 29,99€ · export anonimo</span>
            </Link>
          </div>

          <div
            className="hero-fade-up mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.36s" }}
          >
            <Link
              href="/#come-funziona"
              className="font-ui text-sm font-semibold text-foreground underline-offset-4 transition hover:underline"
            >
              Come funziona (3 passi)
            </Link>
            <span className="hidden h-4 w-px bg-[var(--border)] sm:block" aria-hidden />
            <p className="font-ui text-[13px] text-muted">
              Pensato anche per <strong className="font-semibold text-foreground">psicologi</strong>,{" "}
              <strong className="font-semibold text-foreground">coach</strong> e{" "}
              <strong className="font-semibold text-foreground">people team</strong> — come supporto
              a colloqui e supervisioni, non sostituto clinico.
            </p>
          </div>
        </div>
      </section>

      <section id="come-funziona" className="border-b border-[var(--border)] bg-background">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-accent">
            Come funziona
          </p>
          <h2 className="font-display mt-3 text-[36px] font-bold tracking-tight text-foreground">
            Tre passi. Zero rumore.
          </h2>
          <div className="mb-12 flex items-center gap-2" aria-hidden>
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#f97316]" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#6366f1]" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#0d9488]" />
          </div>

          <ul ref={comeFunzionaRef} className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="card-reveal group flex flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                style={{ transitionDelay: i === 0 ? "0s" : i === 1 ? "0.15s" : "0.3s" }}
              >
                <div
                  className={[
                    "relative h-[180px] w-full shrink-0 overflow-hidden",
                    step.visualClass,
                  ].join(" ")}
                >
                  <div className="relative z-[1] flex h-full w-full items-center justify-center px-4">
                    {i === 0 && (
                      <svg
                        viewBox="0 0 220 180"
                        className="h-auto w-full max-w-[220px]"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden
                      >
                        <circle cx="38" cy="44" r="11" fill="#f97316" fillOpacity="0.08" />
                        <circle cx="182" cy="128" r="13" fill="#f97316" fillOpacity="0.08" />
                        <circle cx="22" cy="148" r="9" fill="#f97316" fillOpacity="0.08" />
                        <circle cx="192" cy="52" r="7" fill="#f97316" fillOpacity="0.08" />
                        <rect
                          x="78"
                          y="56"
                          width="52"
                          height="80"
                          rx="8"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2"
                        />
                        <rect
                          x="86"
                          y="68"
                          width="30"
                          height="12"
                          rx="6"
                          fill="#f97316"
                          fillOpacity="0.3"
                        />
                        <rect
                          x="86"
                          y="86"
                          width="38"
                          height="16"
                          rx="6"
                          fill="#f97316"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M 104 56 Q 124 26 156 36"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 152 40 c 0 -6 5 -11 11 -11 c 3 -8 13 -9 18 -3 c 6 -5 14 -1 14 8 c 0 7 -5 12 -12 12 h -26 c -7 0 -12 -5 -12 -11 Z"
                          fill="#f97316"
                          fillOpacity="0.8"
                        />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg
                        viewBox="0 0 220 180"
                        className="h-auto w-full max-w-[220px]"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden
                      >
                        <defs>
                          <pattern
                            id={`howit-dots-${i}`}
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="2" cy="2" r="1" fill="#6366f1" fillOpacity="0.06" />
                          </pattern>
                        </defs>
                        <rect x="0" y="0" width="220" height="180" fill={`url(#howit-dots-${i})`} />
                        <rect
                          x="72"
                          y="98"
                          width="16"
                          height="40"
                          rx="4"
                          fill="#6366f1"
                          fillOpacity="0.7"
                        />
                        <rect
                          x="100"
                          y="72"
                          width="16"
                          height="66"
                          rx="4"
                          fill="#6366f1"
                          fillOpacity="0.5"
                        />
                        <rect
                          x="128"
                          y="108"
                          width="16"
                          height="30"
                          rx="4"
                          fill="#6366f1"
                          fillOpacity="0.9"
                        />
                        <line
                          x1="62"
                          y1="88"
                          x2="158"
                          y2="88"
                          stroke="#6366f1"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <rect
                          x="156"
                          y="74"
                          width="40"
                          height="8"
                          rx="999"
                          fill="#6366f1"
                          fillOpacity="0.15"
                        />
                        <rect
                          x="156"
                          y="110"
                          width="40"
                          height="8"
                          rx="999"
                          fill="#6366f1"
                          fillOpacity="0.15"
                        />
                        <circle cx="108" cy="72" r="8" fill="#6366f1" fillOpacity="0.3" />
                        <circle cx="108" cy="72" r="4" fill="#6366f1" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg
                        viewBox="0 0 220 180"
                        className="h-auto w-full max-w-[220px]"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden
                      >
                        <rect
                          x="74"
                          y="44"
                          width="70"
                          height="88"
                          rx="6"
                          fill="#ffffff"
                          fillOpacity="0.6"
                          stroke="#0d9488"
                          strokeWidth="2"
                        />
                        <circle cx="87" cy="59" r="3" fill="#0d9488" />
                        <rect
                          x="94"
                          y="56"
                          width="28"
                          height="4"
                          rx="2"
                          fill="#0d9488"
                          fillOpacity="0.2"
                        />
                        <rect
                          x="82"
                          y="68"
                          width="54"
                          height="4"
                          rx="2"
                          fill="#0d9488"
                          fillOpacity="0.2"
                        />
                        <rect
                          x="82"
                          y="80"
                          width="32"
                          height="4"
                          rx="2"
                          fill="#0d9488"
                          fillOpacity="0.2"
                        />
                        <rect
                          x="82"
                          y="92"
                          width="48"
                          height="4"
                          rx="2"
                          fill="#0d9488"
                          fillOpacity="0.2"
                        />
                        <rect
                          x="82"
                          y="104"
                          width="22"
                          height="4"
                          rx="2"
                          fill="#0d9488"
                          fillOpacity="0.2"
                        />
                        <g transform="translate(148, 22) scale(1.35)">
                          <path
                            d="M 10 2 L 12 8 L 18 10 L 12 12 L 10 18 L 8 12 L 2 10 L 8 8 Z"
                            fill="#0d9488"
                          />
                          <circle cx="22" cy="4" r="2.5" fill="#0d9488" fillOpacity="0.4" />
                          <circle cx="-2" cy="14" r="2" fill="#0d9488" fillOpacity="0.4" />
                          <circle cx="18" cy="22" r="2" fill="#0d9488" fillOpacity="0.4" />
                        </g>
                      </svg>
                    )}
                  </div>
                  <span
                    className="mono pointer-events-none absolute bottom-[-10px] right-3 select-none text-[80px] font-extrabold leading-none"
                    style={{ color: step.numColor, opacity: 0.15 }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                  <div className="flex items-center gap-3">
                    <step.Icon className={`h-7 w-7 shrink-0 ${step.accentClass}`} />
                    <h3 className="font-display text-[18px] font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="font-ui mt-3 text-[14px] leading-[1.65] text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
                <p className="font-ui mt-auto w-full border-t border-[var(--border)] bg-accent-light px-4 py-3 text-center text-xs font-semibold text-accent">
                  {step.highlight}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[var(--border)]" aria-labelledby="use-cases-heading">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="font-ui text-[12px] font-semibold uppercase tracking-widest text-accent2">
            Due percorsi, stessa disciplina
          </p>
          <h2
            id="use-cases-heading"
            className="font-display mt-3 max-w-3xl text-[32px] font-bold tracking-tight text-foreground sm:text-[36px]"
          >
            Scegli il contesto: il metodo resta rigoroso.
          </h2>

          <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-h-full min-w-0 flex-col border-b border-[var(--border)] bg-gradient-to-b from-violet-50/70 via-white to-white px-4 py-14 sm:px-6 lg:border-b-0 lg:border-r lg:border-[var(--border)] lg:py-16">
            <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col lg:mx-auto">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-violet-700">
                Persone
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-foreground">
                Relazioni e benessere comunicativo
              </h3>
              <p className="font-ui mt-3 text-sm leading-relaxed text-muted">
                I casi che già conosci — con tono adulto e senza infantilizzare chi si interroga.
              </p>
              <ul className="mt-8 grid flex-1 grid-cols-1 content-start gap-5 sm:grid-cols-2">
                {useCasesPersonal.map((uc, i) => {
                  const isLastOdd =
                    i === useCasesPersonal.length - 1 && useCasesPersonal.length % 2 === 1;
                  return (
                    <li
                      key={uc.title}
                      className={[
                        "flex h-full flex-col rounded-2xl border border-violet-100 bg-white px-5 py-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
                        isLastOdd ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md" : "",
                      ].join(" ")}
                    >
                      <span className="text-[40px] leading-none" aria-hidden>
                        {uc.emoji}
                      </span>
                      <h4 className="font-display mt-3 text-base font-bold leading-snug text-foreground">
                        {uc.title}
                      </h4>
                      <p className="font-ui mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                        {uc.body}
                      </p>
                      <p
                        className={[
                          "font-ui mt-4 inline-flex self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          uc.tagClass,
                        ].join(" ")}
                      >
                        {uc.tag}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-10 shrink-0 border-t border-violet-100/80 pt-8 lg:mt-auto">
                <Link
                  href="/upload"
                  className="font-ui inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark sm:w-auto"
                >
                  Percorso persone →
                </Link>
              </div>
            </div>
          </div>

          <div className="flex min-h-full min-w-0 flex-col bg-gradient-to-b from-teal-50/60 via-white to-amber-50/30 px-4 py-14 sm:px-6 lg:py-16">
            <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col lg:mx-auto">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-accent2">
                Organizzazioni
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-foreground">
                Produttività relazionale e chiarezza operativa
              </h3>
              <p className="font-ui mt-3 text-sm leading-relaxed text-muted">
                Metriche utili a decisioni: meno storytelling da riunione, più segnali nel testo.
              </p>
              <ul className="mt-8 grid flex-1 grid-cols-1 content-start gap-5 sm:grid-cols-2">
                {useCasesEnterprise.map((uc) => (
                  <li
                    key={uc.title}
                    className="flex h-full flex-col rounded-2xl border border-teal-100 bg-white px-5 py-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="text-[40px] leading-none" aria-hidden>
                      {uc.emoji}
                    </span>
                    <h4 className="font-display mt-3 text-base font-bold leading-snug text-foreground">
                      {uc.title}
                    </h4>
                    <p className="font-ui mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                      {uc.body}
                    </p>
                    <p
                      className={[
                        "font-ui mt-4 inline-flex self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        uc.tagClass,
                      ].join(" ")}
                    >
                      {uc.tag}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 shrink-0 border-t border-teal-100/80 pt-8 lg:mt-auto">
                <Link
                  href="/upload?audience=aziende"
                  className="font-ui inline-flex w-full items-center justify-center rounded-lg bg-accent2 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f766e] sm:w-auto"
                >
                  Area organizzazioni →
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section
        ref={statsRef}
        className="home-strip-stats stats-strip border-b border-[var(--border)] bg-[var(--text-primary)]"
        aria-label="Numeri chiave e listini"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14">
          <div className="grid gap-10 md:grid-cols-2 md:gap-6">
            <div className="stat-count-up rounded-2xl border border-white/10 bg-white/5 p-8 text-center md:text-left">
              <p className="font-ui text-[11px] font-bold uppercase tracking-widest text-violet-200">
                Persone
              </p>
              <p className="font-display mt-2 text-4xl font-bold text-white sm:text-5xl">da 4,99€</p>
              <p className="font-ui mt-2 text-sm text-[#c4b5fd]">Pre-analisi gratuita · report completo</p>
              <p className="font-ui mt-4 text-xs leading-relaxed text-[#9ca3af]">
                ~5 min · 0 dati conservati · Claude AI su testo anonimo
              </p>
            </div>
            <div className="stat-count-up rounded-2xl border border-white/10 bg-teal-950/40 p-8 text-center md:text-left">
              <p className="font-ui text-[11px] font-bold uppercase tracking-widest text-teal-200">
                Organizzazioni
              </p>
              <p className="font-display mt-2 text-4xl font-bold text-white sm:text-5xl">da 29,99€</p>
              <p className="font-ui mt-2 text-sm text-[#5eead4]">
                Finestre temporali ampie · moduli e tono B2B in checkout
              </p>
              <p className="font-ui mt-4 text-xs leading-relaxed text-[#9ca3af]">
                Stessa pipeline sicura · listino dedicato in pagina upload
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-background">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mx-auto flex max-w-full flex-col gap-4 rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex w-full items-center gap-4 sm:flex-1">
              <svg
                className="h-7 w-7 shrink-0 self-start sm:self-center"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 3.5 5 6v6c0 4.5 3.2 8.2 7 9.5 3.8-1.3 7-5 7-9.5V6l-7-2.5Z"
                  stroke="#f97316"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.2c2.5-1.8 4-3.9 4-6.2 0-1.5-1-2.8-2.3-3.2-.6-.2-1.3-.2-1.9 0C10.5 7.2 9.5 8.5 9.5 10c0 2.3 1.5 4.4 4 6.2Z"
                  stroke="#f97316"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-ui flex-1 text-[14px] leading-relaxed text-[#92400e] sm:text-left">
                Subtext è anche uno strumento di autoconsapevolezza. Richieste di localizzazione
                ripetute, isolamento progressivo, cicli di tensione e perdono — certi pattern
                hanno un nome.
              </p>
            </div>
            <span
              className="hidden h-8 w-px shrink-0 self-center bg-[#fed7aa] sm:block"
              aria-hidden
            />
            <a
              href="https://www.1522.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui mx-auto shrink-0 text-center text-[13px] font-semibold text-[#ea580c] underline-offset-2 transition hover:underline sm:mx-0 sm:text-left sm:whitespace-nowrap"
            >
              Numero Verde 1522 →
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-background" aria-labelledby="why-ai-heading">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-14">
          <div ref={reportMockRef} className="slide-in-right flex justify-center lg:justify-start">
            <ReportMockupCard dateLabel={reportDate} />
          </div>
          <div className="min-w-0">
            <h2
              id="why-ai-heading"
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              Strumento per professionisti — non una terapia in chat
            </h2>
            <p className="font-display mt-5 text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-[28px]">
              L&apos;AI qui è metodo di codifica, non voce autoritaria sul vissuto.
            </p>
            <p className="font-ui mt-5 text-base leading-relaxed text-muted">
              Nella pratica clinica e organizzativa si lavora da sempre su segnali osservabili
              (turn-taking, evitamenti, escalation). Il testo digitale è un comportamento pubblico,
              misurabile: frequenze, latenze, simmetrie. Subtext estrae quella struttura; Claude
              (Anthropic) traduce numeri e pattern in linguaggio leggibile. Il senso profondo,
              l&apos;etica e la decisione restano umani.
            </p>
            <p className="font-ui mt-5 text-base leading-relaxed text-muted">
              Per psicologi, coach e people team può fungere da supporto a colloqui e supervisioni —
              come stimolo a domande precise, mai come etichetta. Per le aziende è un modo sobrio
              di allineare percezioni su clienti e team senza passare da strumenti opachi.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "Nessuna diagnosi clinica",
                "Metriche osservabili sul testo (corpus-style)",
                "AI Anthropic su dato già anonimizzato",
              ].map((label) => (
                <li
                  key={label}
                  className="font-ui flex items-center gap-3 rounded-full border border-[var(--border)] bg-surface px-5 py-3 text-sm font-medium text-foreground sm:px-5 sm:text-[14px]"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent2-light text-accent2"
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 12.5 10 17l9-10"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={indigoRef} className="section-indigo bg-accent">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div
            className="max-w-3xl space-y-5 will-change-transform"
            style={{ transform: `translateY(${indigoParallaxPx}px)` }}
          >
            <p className="font-display text-2xl font-semibold italic leading-snug text-white sm:text-3xl">
              Chi inizia sempre le conversazioni — e chi aspetta sempre che lo faccia l&apos;altro.
            </p>
            <p className="font-display text-2xl font-semibold italic leading-snug text-white sm:text-3xl">
              Di cosa parlate quando siete felici. Di cosa smettete di parlare quando qualcosa non
              va.
            </p>
            <p className="font-display text-2xl font-semibold italic leading-snug text-white sm:text-3xl">
              Chi usa il tuo nome solo quando è arrabbiato. Chi sparisce per ore e poi risponde come
              se nulla fosse.
            </p>
          </div>
          <p className="font-ui mt-8 max-w-3xl text-[15px] leading-relaxed text-white/70">
            Questi pattern esistono in ogni conversazione. Subtext li rende visibili — con dati, non
            con interpretazioni.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/upload"
              className="font-ui inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Persone — inizia gratis
            </Link>
            <Link
              href="/upload?audience=aziende"
              className="font-ui inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition hover:bg-violet-50"
            >
              Organizzazioni — listino dedicato
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-trust-badges bg-[var(--surface)]"
        aria-label="Partner e fiducia"
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-8 px-4 sm:px-6">
          {[
            { icon: "🔒", label: "Privacy GDPR" },
            { icon: "🧠", label: "Metodo + AI" },
            { icon: "💳", label: "Stripe" },
            { icon: "🛡️", label: "1522" },
            { icon: "🏢", label: "B2B & privati" },
          ].map((b) => (
            <div
              key={b.label}
              className="font-ui inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[12px] text-[var(--text-secondary)]"
            >
              <span aria-hidden>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
