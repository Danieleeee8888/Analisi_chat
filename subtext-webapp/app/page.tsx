"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PlansSection } from "@/components/PlansSection";

const steps = [
  {
    title: "Carica e anonimizza",
    description:
      "Export .zip da WhatsApp (anche senza media). Anonimizzazione automatica in memoria: nessun archivio della chat lato servizio.",
    highlight: "Nessun dato salvato dopo l'analisi",
    Icon: StepIconUpload,
    accentClass: "text-accent3",
    numColor: "#f97316",
    visualClass: "bg-gradient-to-br from-[#fff7ed] to-[#fed7aa]",
  },
  {
    title: "Metriche e lettura AI",
    description:
      "Pre-analisi gratuita: ritmo, turni, volumi. Poi Claude legge il testo già anonimo per temi, toni e contesto — non solo conteggi.",
    highlight: "Elaborazione sicura + AI (Claude)",
    Icon: StepIconChart,
    accentClass: "text-accent",
    numColor: "#6366f1",
    visualClass: "bg-gradient-to-br from-[#eef2ff] to-[#c7d2fe]",
  },
  {
    title: "Report e PDF",
    description:
      "Metriche incrociate con sintesi linguistica: argomenti ricorrenti, sfumature di tono, suggerimenti pratici. PDF scaricabile, solo tuo.",
    highlight: "PDF scaricabile",
    Icon: StepIconReport,
    accentClass: "text-accent2",
    numColor: "#0d9488",
    visualClass: "bg-gradient-to-br from-[#f0fdfa] to-[#99f6e4]",
  },
] as const;

const chiSeiCards = [
  {
    emoji: "💑",
    title: "Coppia o relazione stabile",
    body: "Equilibrio, silenzi, riprese: capire chi porta l’iniziativa e come evolve il dialogo nel tempo.",
    href: "/upload?focus=coppia",
    cta: "Vai al percorso coppia",
    borderClass: "border-accent/25 hover:border-accent/45",
  },
  {
    emoji: "✨",
    title: "Nuove conoscenze",
    body: "Interesse reale o cortesia? Ritmo, domande e toni quando la relazione è ancora in fase di esplorazione.",
    href: "/upload?focus=dating",
    cta: "Vai al percorso tematico",
    borderClass: "border-accent3/30 hover:border-accent3/50",
  },
  {
    emoji: "🏠",
    title: "Famiglia e amici",
    body: "Gruppi e sottogruppi: chi media, chi resta ai margini, quali temi tornano sempre nel thread.",
    href: "/upload?focus=coppia",
    cta: "Analizza il gruppo",
    borderClass: "border-accent/20 hover:border-accent/40",
  },
  {
    emoji: "💼",
    title: "Team e professionisti",
    body: "Carico comunicativo, decisioni async, export anonimi per HR, manager, studio o supervisione.",
    href: "/upload?audience=aziende",
    cta: "Percorso organizzazioni",
    borderClass: "border-accent2/30 hover:border-accent2/50",
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

/** Hero: conversazione animata (decorativo) — keyframe in globals.css.
 *  Non avvolgere in .hero-fade-up: opacity+transform sul parent possono bloccare
 *  le animazioni opacity dei figli in alcuni browser. */
function HeroConversationVisual() {
  const bubble = "max-w-[88%] rounded-2xl px-3.5 py-2.5 font-ui text-[13px] leading-snug shadow-sm";
  return (
    <div
      className="relative mx-auto w-full max-w-[400px] select-none lg:mx-0 lg:ml-auto lg:max-w-[420px]"
      aria-hidden
    >
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-violet-200/50 via-amber-100/40 to-teal-100/50 opacity-90 blur-3xl" />
      <div className="relative rounded-[24px] border border-[var(--border)] bg-white/95 p-4 shadow-[0_24px_60px_rgba(99,102,241,0.14)]">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <span className="font-ui text-[11px] font-semibold text-muted">Anteprima conversazione</span>
          <div className="flex items-center gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent"
                style={{
                  animation: "bounceDot 1.1s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div
            className={`hero-conv-animated ${bubble} ml-0 mr-auto text-white`}
            style={{
              opacity: 0,
              background: "#6366f1",
              animation: "chatBubbleIn 0.45s ease-out 0.15s both",
            }}
          >
            Possiamo parlarne domani?
          </div>
          <div
            className={`hero-conv-animated ${bubble} ml-auto mr-0 text-foreground`}
            style={{
              opacity: 0,
              background: "#f3f4f6",
              animation: "chatBubbleIn 0.45s ease-out 0.38s both",
            }}
          >
            Sì, però ho bisogno che ci sia chiarezza prima.
          </div>
          <div
            className={`hero-conv-animated ${bubble} ml-0 mr-auto text-white`}
            style={{
              opacity: 0,
              background: "#6366f1",
              animation: "chatBubbleIn 0.45s ease-out 0.61s both",
            }}
          >
            Ok. Io ci sto.
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div
            className="hero-conv-animated rounded-xl border border-accent2/25 bg-accent2-light/90 px-3 py-2.5"
            style={{
              opacity: 0,
              animation: "insightFadeIn 0.55s ease-out 0.95s both",
            }}
          >
            <p className="font-mono text-[9px] font-medium uppercase tracking-widest text-accent2">Segnale</p>
            <p className="font-ui mt-1 text-[12px] leading-snug text-foreground">
              Ripresa rapida dopo tensione — pattern visibile nel thread.
            </p>
          </div>
          <div
            className="hero-conv-animated rounded-xl border border-accent/25 bg-accent-light/90 px-3 py-2.5"
            style={{
              opacity: 0,
              animation: "insightFadeIn 0.55s ease-out 1.58s both",
            }}
          >
            <p className="font-mono text-[9px] font-medium uppercase tracking-widest text-accent">Struttura</p>
            <p className="font-ui mt-1 text-[12px] leading-snug text-foreground">
              Richiesta di chiarezza seguita da adesione — sequenza tensione → riparazione nel testo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const useCasesPersonal = [
  {
    emoji: "💬",
    title: "State parlando. O vi state perdendo?",
    body: "Ritmo e reciprocità, ma anche temi che spariscono e registri di tono: numeri e linguaggio insieme.",
    tag: "Coppia",
    tagClass: "bg-accent-light text-accent",
  },
  {
    emoji: "🔍",
    title: "Interesse reale. O solo abitudine?",
    body: "Frequenze e lunghezze, più lettura di come si parla quando c’è (o non c’è) coinvolgimento.",
    tag: "Nuove conoscenze",
    tagClass: "bg-accent3-light text-accent3-dark",
  },
  {
    emoji: "🏠",
    title: "Famiglia: chi tiene il filo, chi sparisce.",
    body: "Gruppi e sottogruppi impliciti: chi media, chi resta ai margini — struttura oltre le battute.",
    tag: "Famiglia",
    tagClass: "bg-accent-light text-accent",
  },
  {
    emoji: "🫂",
    title: "Amici e gruppi: rumore e gerarchie.",
    body: "Chi monopolizza il turno, dove le idee si perdono, quali argomenti tornano sempre.",
    tag: "Amici / gruppo",
    tagClass: "bg-accent3-light text-accent3-dark",
  },
  {
    emoji: "🛡️",
    title: "Quando qualcosa non torna.",
    body: "Pattern oggettivi (controllo, isolamento, cicli tensione/perdono). Non diagnostica: segnala.",
    tag: "Sicurezza",
    tagClass: "bg-[#fef2f2] text-[#dc2626]",
  },
  {
    emoji: "🧠",
    title: "Profilo Pro (roadmap)",
    body: "Stessa persona, chat diverse: impronta comunicativa trasversale — da roadmap prodotto, in arrivo.",
    tag: "Pro",
    tagClass: "bg-accent2-light text-accent2",
  },
] as const;

const useCasesEnterprise = [
  {
    emoji: "🧑‍⚕️",
    title: "Studio e supervisione: meno scrolling, più struttura",
    body: "Terapeuti, psicologi, counselor: sintesi di contesto, tono e temi su export anonimo — supporto al colloquio, non sostituto clinico.",
    tag: "Clinica & counseling",
    tagClass: "bg-[#eef2ff] text-accent",
  },
  {
    emoji: "🤝",
    title: "Clienti e partner: cosa succede nel thread",
    body: "Metriche più lettura del linguaggio (urgenza, deferenza, chiusure): sales e account con evidenza mista.",
    tag: "Sales & account",
    tagClass: "bg-accent2-light text-accent2",
  },
  {
    emoji: "⚙️",
    title: "Team async: chi tira il carico",
    body: "Monologhi, silenzi dopo le decisioni, escalation implicita — quantificato e contestualizzato nel testo.",
    tag: "People & team",
    tagClass: "bg-[#eef2ff] text-accent",
  },
  {
    emoji: "📋",
    title: "HR e leadership: debrief difendibili",
    body: "Export anonimi con metriche e sintesi tematica per colloqui e retro, senza gossip.",
    tag: "HR / Leadership",
    tagClass: "bg-[#f0fdf4] text-[#15803d]",
  },
  {
    emoji: "💡",
    title: "Brainstorm e progetti",
    body: "Dopo chat lunghe: temi ricorrenti, chi non entra nel turno, idee che non atterrano mai.",
    tag: "Workshop",
    tagClass: "bg-accent3-light text-accent3-dark",
  },
  {
    emoji: "🔐",
    title: "Privacy che regge il confronto",
    body: "Niente training sui vostri messaggi, niente archivio dopo l’analisi.",
    tag: "Compliance-ready",
    tagClass: "bg-surface text-foreground ring-1 ring-[var(--border)]",
  },
] as const;

const HERO_TITLE_WORDS = [
  "Il",
  "sottotesto",
  "non",
  "si",
  "scorre.",
  "Si",
  "estrae",
  "con",
  "metodo.",
] as const;

const PATTERN_TYPING_LINES = [
  "Turn-taking e latenze: chi governa l’apertura dei turni, chi li chiude in fretta, chi lascia cadere.",
  "Attraversamento delle frizioni — o deviazioni: dove il testo cambia registro prima che il tema sia risolto.",
  "Reciprocità misurabile: quanto del carico conversazionale resta su una sola parte della coppia.",
] as const;

function PatternIndigoSection({
  sectionRef,
  parallaxY,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  parallaxY: number;
}) {
  const lines = PATTERN_TYPING_LINES;
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [col, setCol] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    if (!started) return;
    if (lineIdx >= lines.length) return;
    const full = lines[lineIdx];
    if (col < full.length) {
      const ch = full[col];
      const delay =
        ch === "." ? 320 : ch === "," ? 220 : ch === " " ? 42 : 28 + Math.floor(Math.random() * 44);
      const t = setTimeout(() => setCol((c) => c + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCompleted((d) => [...d, full]);
      setLineIdx((i) => i + 1);
      setCol(0);
    }, 480);
    return () => clearTimeout(t);
  }, [started, lineIdx, col, lines]);

  const taglineDone = lineIdx >= lines.length;
  const currentFull = lineIdx < lines.length ? lines[lineIdx] : "";
  const partial = currentFull.slice(0, col);

  return (
    <section ref={sectionRef} className="section-indigo bg-accent">
      <div
        className="will-change-transform"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mono min-h-[168px] max-w-3xl space-y-3 text-[15px] leading-relaxed text-white/95 sm:min-h-[180px] sm:text-[17px]">
            {completed.map((l, i) => (
              <p key={`${l}-${i}`} className="border-l-2 border-white/30 pl-4">
                {l}
              </p>
            ))}
            {started && lineIdx < lines.length ? (
              <p className="pattern-type-cursor border-l-2 border-white/45 pl-4">{partial}</p>
            ) : null}
          </div>
          {taglineDone ? (
            <div className="hero-fade-up">
              <p className="font-display mt-10 text-2xl font-bold leading-snug text-white sm:text-3xl">
                Non è intuizione. È struttura che regge il confronto con i dati.
              </p>
              <div className="mt-8">
                <Link
                  href="/upload"
                  className="font-ui cta-glow-primary inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-accent shadow-md"
                >
                  Scopri i tuoi pattern
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [indigoParallaxPx, setIndigoParallaxPx] = useState(0);
  const [reportDate, setReportDate] = useState("");
  const [howItProgress, setHowItProgress] = useState(0);
  const comeFunzionaRef = useRef<HTMLUListElement>(null);
  const howItSectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const section = howItSectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = vh + r.height;
      const raw = (vh * 0.55 - r.top) / span;
      setHowItProgress(Math.max(0, Math.min(1, raw)));
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
    const els = document.querySelectorAll<HTMLElement>(".section-reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-bg-animated pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.65)_0%,transparent_55%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-400/18 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-amber-300/22 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-[1200px] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,440px)] lg:gap-10 xl:gap-14">
            <div className="min-w-0">
              <p
                className="hero-fade-up mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm sm:text-xs"
                style={{ animationDelay: "0s" }}
              >
                <span className="text-accent">Pattern</span>
                <span className="hidden text-[var(--text-secondary)] sm:inline">·</span>
                <span className="text-[var(--text-secondary)]">metodo + Claude</span>
              </p>

              <div className="hero-title-wrap max-w-[38rem]">
                <h1 className="hero-h1 font-display text-balance font-bold leading-[1.08] tracking-tight text-foreground">
                  {HERO_TITLE_WORDS.map((w, i) => (
                    <span
                      key={`${w}-${i}`}
                      className="hero-word"
                      style={{ animationDelay: `${0.06 + i * 0.055}s` }}
                    >
                      {w}
                    </span>
                  ))}
                </h1>
              </div>

              <p
                className="hero-fade-up font-ui mt-5 max-w-xl text-pretty text-lg leading-snug text-[var(--text-secondary)] sm:text-xl"
                style={{ animationDelay: "0.2s" }}
              >
                Metriche sul timing si incontrano con la lettura del linguaggio: temi che tornano,
                sfumature di tono, contesto tra un messaggio e l&apos;altro. Non solo conteggi —
                comprensione strutturata di come state comunicando.
              </p>

              <div
                className="hero-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                style={{ animationDelay: "0.26s" }}
              >
                <Link
                  href="/upload"
                  className="cta-glow-primary font-ui inline-flex items-center justify-center rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-accent-dark"
                >
                  Analizza la tua chat
                </Link>
                <Link
                  href="#esempio-reale"
                  className="cta-glow-secondary font-ui inline-flex items-center justify-center rounded-xl border-2 border-violet-200 bg-white/95 px-7 py-3.5 text-sm font-bold text-foreground shadow-sm transition hover:border-accent/40"
                >
                  Vedi un esempio reale
                </Link>
              </div>

              <div
                className="hero-fade-up mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
                style={{ animationDelay: "0.32s" }}
              >
                <Link
                  href="/#come-funziona"
                  className="font-ui text-sm font-semibold text-foreground underline-offset-4 transition hover:underline"
                >
                  Come funziona
                </Link>
                <span className="text-[var(--text-secondary)]">·</span>
                <span className="font-ui text-sm text-muted">
                  Psicologi e studio: percorso{" "}
                  <Link href="/upload?audience=aziende" className="font-semibold text-foreground underline-offset-2 hover:underline">
                    organizzazioni
                  </Link>
                  .
                </span>
              </div>
            </div>

            <div className="flex min-w-0 justify-center lg:justify-end">
              <HeroConversationVisual />
            </div>
          </div>
        </div>
      </section>

      <PatternIndigoSection sectionRef={indigoRef} parallaxY={indigoParallaxPx} />

      <section
        ref={howItSectionRef}
        id="come-funziona"
        className="section-reveal border-b border-[var(--border)] bg-background"
      >
        <div className="howit-track relative mx-auto max-w-[1200px] px-4 sm:px-6">
          <svg
            className="howit-connector-svg"
            viewBox="0 0 400 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="howitConnectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
            <path
              pathLength={1}
              strokeDasharray={1}
              className="howit-connector-path"
              style={{ strokeDashoffset: 1 - howItProgress }}
              d="M 48 4 L 200 4 L 352 4"
            />
          </svg>
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

          <ul
            ref={comeFunzionaRef}
            className="relative z-[1] grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="card-reveal home-lift-card group flex flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 ease-out"
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

      <section
        id="chi-sei"
        className="section-reveal scroll-mt-24 border-b border-[var(--border)] bg-surface/60"
        aria-labelledby="chi-sei-heading"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-accent2">Per te</p>
          <h2
            id="chi-sei-heading"
            className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Chi sei in questa chat?
          </h2>
          <p className="font-ui mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Scegli il contesto che ti avvicina di più: stesso metodo, stessa privacy, focus calibrato sul tipo di
            relazione o gruppo che stai analizzando.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {chiSeiCards.map((card) => (
              <li key={card.title}>
                <div
                  className={[
                    "home-lift-card flex h-full flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition",
                    card.borderClass,
                  ].join(" ")}
                >
                  <span className="text-3xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold text-foreground">{card.title}</h3>
                  <p className="font-ui mt-2 flex-1 text-sm leading-relaxed text-muted">{card.body}</p>
                  <Link
                    href={card.href}
                    className="font-ui mt-5 inline-flex text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    {card.cta} →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PlansSection />

      <section
        className="section-reveal border-b border-[var(--border)] bg-[#1e1b4b]"
        aria-labelledby="pro-plan-heading"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 font-ui text-xs font-bold text-white/70">
                Pro · In arrivo
              </span>
              <h2
                id="pro-plan-heading"
                className="font-display mt-5 text-3xl font-bold text-white sm:text-4xl"
              >
                La tua impronta comunicativa
              </h2>
              <p className="font-ui mt-4 max-w-xl text-base leading-relaxed text-white/70">
                Come comunichi tu — indipendentemente dall&apos;interlocutore. Carica più chat diverse: con il
                partner, con un amico, con un collega. Subtext Pro identifica i pattern che si ripetono in tutti i
                contesti: il tuo stile sotto stress, le tendenze strutturali che riproduci ovunque, le
                contraddizioni tra come ti presenti in relazioni diverse.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Analisi trasversale su più chat diverse",
                  "Il tuo stile comunicativo dominante",
                  "Come cambi in base all'interlocutore",
                  "Pattern ricorrenti indipendenti dal contesto",
                  "Contraddizioni tra relazioni diverse",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent3" aria-hidden />
                    <span className="font-ui text-sm text-white/80">{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <span className="font-display text-4xl font-bold text-white">19,99€</span>
                <span className="font-ui ml-2 text-sm text-white/50">per profilo trasversale</span>
              </div>
              <p className="font-ui mt-2 text-xs text-white/40">
                Richiede account. Multi-chat. In sviluppo.
              </p>
              <button
                type="button"
                className="font-ui mt-6 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-white/60"
              >
                Notificami al lancio
              </button>
            </div>

            <div className="hidden lg:block" aria-hidden>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
                <p className="mb-5 font-mono text-[9px] uppercase tracking-widest text-white/40">
                  PROFILO PRO — ANTEPRIMA
                </p>
                <div className="space-y-5">
                  <div>
                    <p className="mb-1.5 font-ui text-xs text-white/50">Con il partner</p>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[65%] rounded-full bg-accent transition-all" />
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-white/35">65% iniziativa</p>
                  </div>
                  <div>
                    <p className="mb-1.5 font-ui text-xs text-white/50">Con gli amici</p>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[42%] rounded-full bg-accent3 transition-all" />
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-white/35">42% iniziativa</p>
                  </div>
                  <div>
                    <p className="mb-1.5 font-ui text-xs text-white/50">Al lavoro</p>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[28%] rounded-full bg-accent2 transition-all" />
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-white/35">28% iniziativa</p>
                  </div>
                </div>
                <div className="mt-5 border-t border-white/10" />
                <div className="mt-4 rounded-xl border border-white/10 bg-white/6 p-4">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-white/35">
                    PATTERN RILEVATO
                  </p>
                  <p className="font-ui text-[12px] leading-relaxed text-white/70">
                    Prendi l&apos;iniziativa nelle relazioni intime ma aspetti gli altri nel lavoro. Pattern
                    trasversale — 3 chat analizzate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-reveal border-b border-[var(--border)]"
        aria-labelledby="use-cases-heading"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="font-ui text-[12px] font-semibold uppercase tracking-widest text-accent2">
            Persone · Professionisti e organizzazioni
          </p>
          <h2
            id="use-cases-heading"
            className="font-display mt-3 max-w-3xl text-[32px] font-bold tracking-tight text-foreground sm:text-[36px]"
          >
            Stesso metodo. Due mondi.
          </h2>

          <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-h-full min-w-0 flex-col border-b border-[var(--border)] bg-gradient-to-b from-violet-50/70 via-white to-white px-4 py-14 sm:px-6 lg:border-b-0 lg:border-r lg:border-[var(--border)] lg:py-16">
            <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col lg:mx-auto">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-violet-700">
                Persone
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-foreground">
                Capisci cosa sta succedendo davvero tra voi
              </h3>
              <p className="font-ui mt-3 text-sm leading-relaxed text-muted">
                Coppie, nuove conoscenze, famiglie, amici: la pre-analisi ti dà numeri; il report unisce{" "}
                <span className="font-medium text-foreground">metriche e lettura linguistica</span>{" "}
                (temi, toni, ripetizioni) così vedi la conversazione intera, non solo il conteggio messaggi.
              </p>
              <div className="mt-6 rounded-2xl border border-violet-200/90 bg-white/90 p-5 shadow-sm">
                <p className="font-ui text-[13px] font-semibold text-foreground">
                  Percorsi tipici (privati)
                </p>
                <ul className="font-ui mt-3 list-disc space-y-2 pl-4 text-[13px] leading-snug text-muted">
                  <li>
                    <span className="font-medium text-foreground">Coppie e convivenze:</span> equilibrio,
                    silenzi, argomenti tabù — con supporto quantitativo e sintesi dei registri emotivi nel
                    testo.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Nuove conoscenze:</span> reciprocità,
                    ritmo, come si parla quando c’è interesse reale rispetto a cortesia di superficie.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Famiglia:</span> gruppi e sottogruppi,
                    chi media e chi resta ai margini — oltre le battute, la struttura del thread.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Amici e gruppi:</span> chi domina il
                    turno, dove le discussioni si perdono, quali temi tornano sempre.
                  </li>
                </ul>
                <Link
                  href="/metodo"
                  className="font-ui mt-4 inline-flex text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  Metodo, limiti e riferimenti culturali →
                </Link>
              </div>
              <ul className="mt-8 grid flex-1 grid-cols-1 content-start gap-5 sm:grid-cols-2">
                {useCasesPersonal.map((uc, i) => {
                  const isLastOdd =
                    i === useCasesPersonal.length - 1 && useCasesPersonal.length % 2 === 1;
                  return (
                    <li
                      key={uc.title}
                      className={[
                        "home-lift-card home-card-tap home-card-person flex h-full cursor-default flex-col rounded-2xl border border-violet-100 bg-white px-5 py-6 shadow-sm transition duration-200",
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
                  className="font-ui cta-glow-primary inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-dark sm:w-auto"
                >
                  Analizza — persone
                </Link>
              </div>
            </div>
          </div>

          <div className="flex min-h-full min-w-0 flex-col bg-gradient-to-b from-teal-50/60 via-white to-amber-50/30 px-4 py-14 sm:px-6 lg:py-16">
            <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col lg:mx-auto">
              <p className="font-ui text-xs font-bold uppercase tracking-widest text-accent2">
                Organizzazioni e professionisti
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-foreground">
                Trasforma le conversazioni in decisioni
              </h3>
              <p className="font-ui mt-3 text-sm leading-relaxed text-muted">
                Come nel privato: <span className="font-medium text-foreground">dati osservabili</span>{" "}
                incrociati con <span className="font-medium text-foreground">comprensione del testo</span>{" "}
                (tono, temi, sfumature). Utile a chi deve decidere o preparare colloqui — da studio clinico
                a boardroom.
              </p>
              <div className="mt-6 rounded-2xl border border-teal-200/90 bg-white/90 p-5 shadow-sm">
                <p className="font-ui text-[13px] font-semibold text-foreground">
                  Percorsi tipici (professionisti e organizzazioni)
                </p>
                <ul className="font-ui mt-3 list-disc space-y-2 pl-4 text-[13px] leading-snug text-muted">
                  <li>
                    <span className="font-medium text-foreground">Terapeuti, psicologi, counselor:</span>{" "}
                    mappa strutturale e tematica su export anonimo per supervisione o preparazione —
                    senza sostituire il rapporto clinico.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Capiufficio e middle manager:</span>{" "}
                    molte persone sotto, poco tempo: il “freddo” percepito spesso è asincronia o monologhi
                    nel thread — prima di attribuire intenti.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Sales, account, HR:</span> clienti e team
                    con export anonimo e tono B2B in upload — roadmap SUBTEXT WORK.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Workshop e brainstorm:</span> dopo chat
                    lunghe, temi ricorrenti e partecipazione al turno per riallineare priorità.
                  </li>
                </ul>
                <Link
                  href="/metodo"
                  className="font-ui mt-4 inline-flex text-sm font-semibold text-accent2 underline-offset-4 hover:underline"
                >
                  Cosa misuriamo davvero (e cosa no) →
                </Link>
              </div>
              <ul className="mt-8 grid flex-1 grid-cols-1 content-start gap-5 sm:grid-cols-2">
                {useCasesEnterprise.map((uc) => (
                  <li
                    key={uc.title}
                    className="home-lift-card home-card-tap home-card-org flex h-full cursor-default flex-col rounded-2xl border border-teal-100 bg-white px-5 py-6 shadow-sm transition duration-200"
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
                  className="font-ui inline-flex w-full items-center justify-center rounded-lg bg-accent2 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0f766e] sm:w-auto"
                >
                  Analizza — team
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="section-reveal border-b border-[var(--border)] bg-background">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="security-warning-block mx-auto max-w-full flex-col gap-5 rounded-2xl border-2 border-[#fdba74] bg-[#fff7ed] px-6 py-6 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl font-bold tracking-tight text-[#9a3412] sm:text-2xl">
                Alcuni pattern non sono normali.
              </h3>
              <p className="font-ui mt-3 max-w-2xl text-[15px] leading-snug text-[#92400e]">
                Controllo, isolamento, richieste ripetute.
                <br />
                Quando si ripetono, non sono dettagli.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <Link
                href="/faq"
                className="font-ui inline-flex items-center justify-center rounded-lg bg-[#ea580c] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#c2410c]"
              >
                Scopri quando preoccuparti
              </Link>
              <a
                href="https://www.1522.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-center text-[13px] font-semibold text-[#c2410c] underline-offset-2 transition hover:underline sm:text-right"
              >
                Numero Verde 1522 →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="esempio-reale"
        className="section-reveal border-b border-[var(--border)] bg-background scroll-mt-24"
        aria-labelledby="why-ai-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-14">
          <div ref={reportMockRef} className="slide-in-right flex justify-center lg:justify-start">
            <ReportMockupCard dateLabel={reportDate} />
          </div>
          <div className="min-w-0">
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-accent">
              Esempio reale
            </p>
            <h2
              id="why-ai-heading"
              className="font-display mt-2 text-2xl font-bold tracking-tight text-foreground"
            >
              Professionisti: metodo, non terapia in chat
            </h2>
            <p className="font-display mt-4 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
              Dati e linguaggio insieme: metriche verificate, lettura del testo responsabile.
            </p>
            <p className="font-ui mt-4 text-base leading-relaxed text-muted">
              Il motore statistico misura ritmo e simmetrie; il modello linguistico (Claude, Anthropic)
              lavora sul corpus già anonimo per temi ricorrenti, sfumature di tono e contesto tra i
              messaggi. Il risultato è un report che unisce{" "}
              <span className="font-medium text-foreground">evidenza numerica</span> e{" "}
              <span className="font-medium text-foreground">comprensione della conversazione</span> — il
              senso profondo e la decisione restano sempre tuoi.
            </p>
            <p className="font-ui mt-3 text-sm">
              <Link href="/metodo" className="font-semibold text-accent underline-offset-4 hover:underline">
                Approfondisci metodo, limiti e bibliografia →
              </Link>
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "Nessuna diagnosi clinica",
                "Metriche + sintesi tematica e toni sul testo",
                "Claude su conversazione già anonimizzata",
              ].map((label) => (
                <li
                  key={label}
                  className="home-lift-card font-ui flex items-center gap-3 rounded-full border border-[var(--border)] bg-surface px-5 py-3 text-sm font-medium text-foreground sm:text-[14px]"
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
            <Link
              href="/upload"
              className="font-ui cta-glow-primary mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
            >
              Analizza la tua chat
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-trust-badges section-reveal bg-[var(--surface)]"
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
              className="home-lift-card font-ui inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[12px] text-[var(--text-secondary)]"
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
