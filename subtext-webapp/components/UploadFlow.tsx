"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContextForm } from "@/components/ContextForm";
import { UploadZone } from "@/components/UploadZone";
import type { AudienceSegment, ContextFormData } from "@/lib/context-form-types";
import { PREVIEW_SESSION_KEY, type PreviewSessionPayload } from "@/lib/preview-storage";

type ProcessChatOk = {
  ok: true;
  anonymizedChat: string;
  metrics: unknown;
  formData: ContextFormData;
  participantMap: string[];
};

type ProcessChatErr = {
  ok: false;
  error: string;
};

export function UploadFlow({
  audienceSegment = "personal"
}: {
  audienceSegment?: AudienceSegment;
}) {
  const isEnt = audienceSegment === "enterprise";
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [chatMeta, setChatMeta] = useState<{
    approxTotal: number;
    firstDate: string | null;
    lastDate: string | null;
  } | null>(null);
  const [isPeeking, setIsPeeking] = useState(false);

  useEffect(() => {
    if (!file) setApiError(null);
  }, [file]);

  useEffect(() => {
    if (!file) {
      setParticipants([]);
      setChatMeta(null);
      return;
    }

    setParticipants([]);
    setChatMeta(null);

    const peek = async () => {
      setIsPeeking(true);
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/peek-chat", { method: "POST", body: fd });
        const data = (await res.json()) as {
          ok?: boolean;
          participants?: string[];
          approxTotal?: number;
          firstDate?: string | null;
          lastDate?: string | null;
        };
        if (data.ok) {
          setParticipants(data.participants ?? []);
          setChatMeta({
            approxTotal: data.approxTotal ?? 0,
            firstDate: data.firstDate ?? null,
            lastDate: data.lastDate ?? null
          });
        }
      } catch {
        /* peek opzionale */
      } finally {
        setIsPeeking(false);
      }
    };

    void peek();
  }, [file]);

  const handleAnalyze = async (formData: ContextFormData) => {
    if (!file) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("context", JSON.stringify(formData));

      const res = await fetch("/api/process-chat", {
        method: "POST",
        body: fd
      });

      let data: ProcessChatOk | ProcessChatErr;
      try {
        data = (await res.json()) as ProcessChatOk | ProcessChatErr;
      } catch {
        setApiError("Risposta del server non valida.");
        return;
      }

      if (!data.ok) {
        setApiError(data.error ?? "Elaborazione non riuscita.");
        return;
      }

      const payload: PreviewSessionPayload = {
        anonymizedChat: data.anonymizedChat,
        metrics: data.metrics,
        formData: data.formData,
        participantMap: data.participantMap
      };
      try {
        sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(payload));
      } catch {
        setApiError(
          "Impossibile salvare il risultato nel browser (sessionStorage bloccato o pieno)."
        );
        return;
      }

      if (typeof window !== "undefined") {
        console.info("[Subtext] Risultato process-chat salvato in sessionStorage");
      }
      router.push("/preview");
    } catch {
      setApiError("Impossibile contattare il server. Controlla la connessione e riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={[
        "upload-page-root flex min-h-0 flex-1 flex-col",
        isEnt ? "upload-page-root--enterprise" : "upload-page-root--personal",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden border-b border-[var(--border)]",
          isEnt ? "upload-hero--ent" : "upload-hero--personal",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 upload-hero-gradient" aria-hidden />
        <div
          className={[
            "pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full blur-3xl",
            isEnt ? "bg-teal-400/20" : "bg-violet-400/25",
          ].join(" ")}
          aria-hidden
        />
        <div
          className={[
            "pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full blur-3xl",
            isEnt ? "bg-amber-300/15" : "bg-amber-300/20",
          ].join(" ")}
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="font-ui text-sm">
            <Link href="/" className="nav-link text-muted hover:text-foreground">
              ← Home
            </Link>
            <span className="mx-2 text-[var(--border)]">/</span>
            <Link
              href={isEnt ? "/upload?audience=aziende" : "/upload"}
              className="font-medium text-foreground"
            >
              Caricamento
            </Link>
          </p>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
            <div className="min-w-0">
              <span
                className={[
                  "inline-flex rounded-full px-3 py-1 font-ui text-[11px] font-bold uppercase tracking-widest",
                  isEnt
                    ? "bg-teal-100 text-teal-900 ring-1 ring-teal-200/80"
                    : "bg-violet-100 text-violet-900 ring-1 ring-violet-200/80",
                ].join(" ")}
              >
                {isEnt ? "Subtext · organizzazioni" : "Subtext · persone"}
              </span>
              <h1 className="font-display mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {isEnt
                  ? "Da export a insight operativo, senza archiviare il dialogo"
                  : "Carica la conversazione. Estrai la struttura, non solo i messaggi."}
              </h1>
              <p className="font-ui mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {isEnt ? (
                  <>
                    Team, clienti, fornitori, workshop — e professionisti che usano export anonimi per
                    preparare colloqui: stesso flusso sicuro, report con metriche e sintesi tematica.
                    Listino dedicato; per <span className="font-medium text-foreground">altri canali</span>{" "}
                    (Slack, Teams, formati su misura){" "}
                    <Link href="/contatti" className="font-semibold text-accent2 underline-offset-2 hover:underline">
                      contattaci
                    </Link>{" "}
                    per <span className="font-medium text-foreground">piani personalizzati</span>.
                  </>
                ) : (
                  <>
                    File .zip da WhatsApp (anche senza media). Pre-analisi gratuita in locale; report
                    completo che unisce ritmi misurabili e lettura di temi e toni sul testo già
                    anonimizzato.
                  </>
                )}
              </p>
              <ul className="font-ui mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      isEnt ? "bg-accent2" : "bg-accent",
                    ].join(" ")}
                    aria-hidden
                  />
                  Nessun archivio della chat
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      isEnt ? "bg-accent2" : "bg-accent",
                    ].join(" ")}
                    aria-hidden
                  />
                  Anonimizzazione pre-AI
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      isEnt ? "bg-accent2" : "bg-accent",
                    ].join(" ")}
                    aria-hidden
                  />
                  Pre-analisi gratuita
                </li>
              </ul>
            </div>

            <div
              className={[
                "upload-hero-orbit hidden rounded-2xl border p-6 shadow-sm lg:flex lg:flex-col lg:items-center lg:justify-center",
                isEnt
                  ? "border-teal-200/80 bg-gradient-to-br from-teal-50/90 to-white"
                  : "border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-white",
              ].join(" ")}
              aria-hidden
            >
              <div
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md",
                  isEnt ? "bg-accent2" : "bg-accent",
                ].join(" ")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 4v11m0 0 4-4m-4 4-4-4M5 18h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-ui mt-4 text-center text-[11px] font-semibold uppercase tracking-widest text-muted">
                Step 1
              </p>
              <p className="font-display mt-1 text-center text-sm font-bold text-foreground">
                .zip WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:max-w-3xl sm:px-6 sm:py-14">
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2
              className={[
                "font-ui text-xs font-semibold uppercase tracking-[0.2em]",
                isEnt ? "text-accent2" : "text-accent",
              ].join(" ")}
            >
              1. File
            </h2>
            <Link
              href="/metodo"
              className="font-ui hidden text-xs font-medium text-muted underline-offset-4 hover:text-foreground hover:underline sm:inline"
            >
              Perché misuriamo il testo →
            </Link>
          </div>
          <div className="mt-4">
            <UploadZone
              file={file}
              onFileChange={setFile}
              disabled={isSubmitting}
              variant={isEnt ? "enterprise" : "personal"}
            />
          </div>
        </section>

        {file && isPeeking && (
          <div
            className="font-ui mt-6 flex items-center gap-2 py-4 text-sm text-muted"
            role="status"
            aria-live="polite"
          >
            <div
              className={`h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent ${
                isEnt ? "border-accent2" : "border-accent"
              }`}
              aria-hidden
            />
            Lettura chat in corso...
          </div>
        )}

        {file && (
          <section
            className={[
              "mt-12 border-t pt-12",
              isEnt ? "border-teal-200/50" : "border-[var(--border)]",
            ].join(" ")}
          >
            <h2
              className={[
                "font-ui text-xs font-semibold uppercase tracking-[0.2em]",
                isEnt ? "text-accent2" : "text-accent",
              ].join(" ")}
            >
              2. Contesto
            </h2>
            <p className="font-ui mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {isEnt
                ? "Ruolo, tipo di rapporto e obiettivo: il report resta su evidenza (timing + linguaggio) per decisioni o preparazione professionale — studio incluso."
                : "Le risposte orientano il report su relazione, tempo e domande aperte: metriche e lettura del testo restano agganciate a ciò che ti interessa capire."}
            </p>
            <div className="mt-6 max-w-lg">
              <ContextForm
                key={audienceSegment}
                audienceSegment={audienceSegment}
                disabled={!file}
                isSubmitting={isSubmitting}
                onSubmit={handleAnalyze}
                participants={participants}
                chatMeta={chatMeta}
              />
            </div>
          </section>
        )}

        {apiError && (
          <div
            className="font-ui mt-8 border border-[color-mix(in_oklab,var(--danger)_45%,var(--border))] bg-[var(--danger-bg)] px-4 py-3 text-sm text-foreground"
            role="alert"
          >
            {apiError}
          </div>
        )}
      </div>
    </div>
  );
}
