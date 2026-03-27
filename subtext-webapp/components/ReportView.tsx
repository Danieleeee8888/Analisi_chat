"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export interface ReportViewProps {
  markdown: string;
  demo?: boolean;
}

export function ReportView({ markdown, demo }: ReportViewProps) {
  const [pdfHint, setPdfHint] = useState<string | null>(null);

  async function tryPdf() {
    setPdfHint(null);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown })
      });
      const data = (await res.json()) as { error?: string };
      setPdfHint(data.error ?? `PDF non disponibile (${res.status}).`);
    } catch {
      setPdfHint("Richiesta PDF non riuscita.");
    }
  }

  return (
    <article className="report-document mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      {demo ? (
        <p className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Stai visualizzando un <strong>report dimostrativo</strong>. Configura
          Anthropic in produzione per il testo generato da Claude.
        </p>
      ) : null}
      <div className="mb-10 flex flex-wrap items-center gap-3 border-b border-stone-200 pb-8">
        <button
          type="button"
          onClick={tryPdf}
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
        >
          Scarica PDF
        </button>
        <span className="text-xs text-stone-500">
          In sviluppo: per ora puoi usare Stampa → Salva come PDF dal browser.
        </span>
      </div>
      {pdfHint ? (
        <p className="mb-6 text-sm text-stone-600" role="status">
          {pdfHint}
        </p>
      ) : null}
      <div
        className={[
          "prose prose-stone max-w-none",
          "prose-headings:font-sans prose-headings:tracking-tight",
          "prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10",
          "prose-p:font-serif prose-p:leading-relaxed",
          "prose-li:font-serif"
        ].join(" ")}
      >
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </article>
  );
}

