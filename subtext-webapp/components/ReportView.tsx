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
    <article className="report-document mx-auto max-w-[680px] bg-white px-4 py-10 sm:px-6 sm:py-14">
      {demo ? (
        <p className="font-ui mb-8 rounded-xl border border-accent-light bg-accent-light px-4 py-3 text-sm text-accent-dark">
          Stai visualizzando un <strong>report dimostrativo</strong>. Configura
          Anthropic in produzione per il testo generato da Claude.
        </p>
      ) : null}
      <div className="mb-10 flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-8">
        <button
          type="button"
          onClick={tryPdf}
          className="font-ui rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-surface active:scale-[0.98]"
        >
          Scarica PDF
        </button>
        <span className="font-ui text-xs text-muted">
          In sviluppo: per ora puoi usare Stampa → Salva come PDF dal browser.
        </span>
      </div>
      {pdfHint ? (
        <p className="font-ui mb-6 text-sm text-muted" role="status">
          {pdfHint}
        </p>
      ) : null}
      <div
        className={[
          "prose prose-report max-w-none text-foreground",
          "prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10",
          "prose-p:text-[17px] prose-p:leading-[1.8]",
          "prose-li:text-[17px] prose-li:leading-[1.8]"
        ].join(" ")}
      >
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </article>
  );
}
