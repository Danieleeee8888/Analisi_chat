import { Suspense } from "react";
import { UploadPageClient } from "./UploadPageClient";

export const metadata = {
  title: "Carica chat — Subtext",
  description: "Carica l'export WhatsApp per l'analisi."
};

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
