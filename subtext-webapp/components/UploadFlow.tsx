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
    <>
      <p className="font-ui text-sm text-muted">
        <Link href="/" className="nav-link text-muted hover:text-foreground">
          ← Home
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {isEnt ? "Carica la conversazione da analizzare" : "Carica la tua chat"}
      </h1>
      <p className="font-ui mt-3 max-w-xl leading-relaxed text-muted">
        {isEnt ? (
          <>
            Export WhatsApp (.zip) di canali con clienti, fornitori o team. Stesso trattamento
            sicuro: parsing in memoria, anonimizzazione prima dell&apos;AI, listino e contesto
            modulati per organizzazioni.
          </>
        ) : (
          <>
            Esporta la conversazione da WhatsApp come file .zip (senza media se vuoi ridurre le
            dimensioni). L&apos;elaborazione avviene sul server in memoria: nessun salvataggio
            persistente della chat lato applicazione, come da policy in evoluzione.
          </>
        )}
      </p>

      <section className="mt-10">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          1. File
        </h2>
        <div className="mt-4">
          <UploadZone
            file={file}
            onFileChange={setFile}
            disabled={isSubmitting}
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
        <section className="mt-12 border-t border-[var(--border)] pt-12">
          <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            2. Contesto
          </h2>
          <p className="font-ui mt-2 max-w-xl text-sm text-muted">
            {isEnt
              ? "Contesto e obiettivo guidano il report professionale: metriche oggettive, linguaggio orientato a decisioni e chiarezza."
              : "Rispondi alle domande per contestualizzare l&apos;analisi. I dati sono pensati per arricchire il report, non per identificarti."}
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
    </>
  );
}
