"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PreviewMetrics } from "@/components/PreviewMetrics";
import {
  PREVIEW_SESSION_KEY,
  parsePreviewPayload,
  type PreviewSessionPayload
} from "@/lib/preview-storage";

export function PreviewClient() {
  const [payload, setPayload] = useState<PreviewSessionPayload | null | undefined>(
    undefined
  );

  useEffect(() => {
    const raw = sessionStorage.getItem(PREVIEW_SESSION_KEY);
    setPayload(parsePreviewPayload(raw));
  }, []);

  if (payload === undefined) {
    return (
      <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-stone-600">Caricamento…</p>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-sm text-stone-500">
          <Link href="/upload" className="text-stone-700 hover:text-stone-900">
            ← Carica chat
          </Link>
        </p>
        <h1 className="mt-6 text-2xl font-semibold text-stone-900">
          Nessun risultato
        </h1>
        <p className="mt-4 text-stone-600">
          Non c&apos;è un&apos;analisi in questa sessione. Torna all&apos;upload,
          invia la chat e poi verrai reindirizzato qui.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:max-w-3xl sm:px-6 sm:py-12">
      <p className="text-sm text-stone-500">
        <Link href="/upload" className="text-stone-700 hover:text-stone-900">
          ← Carica un&apos;altra chat
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        La tua pre-analisi gratuita
      </h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Metriche calcolate sul testo anonimizzato. I dati restano solo in questa
        sessione del browser finché non chiudi la scheda.
      </p>

      <div className="mt-10">
        <PreviewMetrics
          metrics={payload.metrics}
          formData={payload.formData}
          participantMap={payload.participantMap}
        />
      </div>
    </div>
  );
}
