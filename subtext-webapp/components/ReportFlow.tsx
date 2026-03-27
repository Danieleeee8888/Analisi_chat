"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportView } from "@/components/ReportView";

type GenerateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; markdown: string; demo: boolean };

export function ReportFlow() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<GenerateState>({ status: "idle" });

  useEffect(() => {
    if (!sessionId) {
      setState({
        status: "error",
        message:
          "Parametro session_id mancante nell’URL. Se hai annullato il pagamento, torna alla pre-analisi."
      });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        });
        const data = (await res.json()) as {
          ok?: boolean;
          markdown?: string;
          demo?: boolean;
          error?: string;
        };

        if (cancelled) return;

        if (!res.ok || !data.ok || typeof data.markdown !== "string") {
          setState({
            status: "error",
            message: data.error ?? `Errore server (${res.status}).`
          });
          return;
        }

        setState({
          status: "ok",
          markdown: data.markdown,
          demo: Boolean(data.demo)
        });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Impossibile completare la richiesta. Verifica la connessione."
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-stone-600">Generazione del report in corso…</p>
        <p className="mt-2 text-sm text-stone-500">Può richiedere fino a un minuto.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <p className="text-sm text-stone-500">
          <Link href="/preview" className="text-stone-700 hover:text-stone-900">
            ← Torna alla pre-analisi
          </Link>
        </p>
        <h1 className="mt-6 text-xl font-semibold text-stone-900">Qualcosa non è andato a buon fine</h1>
        <p className="mt-4 text-stone-700" role="alert">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fdfdfc]">
      <div className="border-b border-stone-200 bg-white/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <p className="text-sm font-medium text-stone-900">Subtext — Report</p>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            Home
          </Link>
        </div>
      </div>
      <ReportView markdown={state.markdown} demo={state.demo} />
    </div>
  );
}
