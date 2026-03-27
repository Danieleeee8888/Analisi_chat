"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContextForm } from "@/components/ContextForm";
import { UploadZone } from "@/components/UploadZone";
import type { ContextFormData } from "@/lib/context-form-types";
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

export function UploadFlow() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) setApiError(null);
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
      <p className="text-sm text-stone-500">
        <Link href="/" className="text-stone-700 hover:text-stone-900">
          ← Home
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold text-stone-900">
        Carica la tua chat
      </h1>
      <p className="mt-3 max-w-xl text-stone-600">
        Esporta la conversazione da WhatsApp come file .zip (senza media se vuoi
        ridurre le dimensioni). L&apos;elaborazione avviene sul server in memoria:
        nessun salvataggio persistente della chat lato applicazione, come da
        policy in evoluzione.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
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

      {file && (
        <section className="mt-12 border-t border-stone-200 pt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            2. Contesto
          </h2>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            Rispondi alle domande per contestualizzare l&apos;analisi. I dati sono
            pensati per arricchire il report, non per identificarti.
          </p>
          <div className="mt-6 max-w-lg">
            <ContextForm
              disabled={!file}
              isSubmitting={isSubmitting}
              onSubmit={handleAnalyze}
            />
          </div>
        </section>
      )}

      {apiError && (
        <div
          className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {apiError}
        </div>
      )}
    </>
  );
}
