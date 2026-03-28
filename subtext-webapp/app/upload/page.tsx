import type { Metadata } from "next";
import { Suspense } from "react";
import {
  audienceFromQueryParam,
  focusFromQueryParam,
  isEnterpriseFocus
} from "@/lib/context-form-types";
import { UploadPageClient } from "./UploadPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const rawAudience = sp.audience;
  const audienceParam =
    typeof rawAudience === "string"
      ? rawAudience
      : Array.isArray(rawAudience)
        ? rawAudience[0]
        : null;
  const rawFocus = sp.focus;
  const focusParam =
    typeof rawFocus === "string" ? rawFocus : Array.isArray(rawFocus) ? rawFocus[0] : null;
  const focus = focusFromQueryParam(focusParam);
  const isEnt =
    isEnterpriseFocus(focus) || audienceFromQueryParam(audienceParam) === "enterprise";
  return {
    title: isEnt ? "Carica conversazione — Subtext Work" : "Carica chat — Subtext",
    description: isEnt
      ? "Upload anonimo per team, clienti e stakeholder. Export WhatsApp, contesto B2B."
      : "Carica l'export WhatsApp per l'analisi strutturale della conversazione.",
  };
}

function UploadFallback() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:max-w-3xl sm:px-6">
      <p className="font-ui text-sm text-muted">Caricamento…</p>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<UploadFallback />}>
      <UploadPageClient />
    </Suspense>
  );
}
