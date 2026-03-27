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
        <p className="font-ui text-muted">Caricamento…</p>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <p className="font-ui text-sm text-muted">
          <Link href="/upload" className="nav-link text-muted hover:text-foreground">
            ← Carica chat
          </Link>
        </p>
        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground">
          Nessun risultato
        </h1>
        <p className="font-ui mt-4 text-muted">
          Non c&apos;è un&apos;analisi in questa sessione. Torna all&apos;upload,
          invia la chat e poi verrai reindirizzato qui.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:max-w-3xl sm:px-6 sm:py-12">
      <p className="font-ui text-sm text-muted">
        <Link href="/upload" className="nav-link text-muted hover:text-foreground">
          ← Carica un&apos;altra chat
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        La tua pre-analisi gratuita
      </h1>
      <p className="font-ui mt-3 max-w-2xl leading-relaxed text-muted">
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
