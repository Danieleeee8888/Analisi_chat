import { Suspense } from "react";
import { ReportFlow } from "@/components/ReportFlow";

export const metadata = {
  title: "Report — Subtext",
  description: "Il tuo report di analisi comunicativa.",
};

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-20 text-center font-ui text-muted sm:px-6">
          Caricamento…
        </div>
      }
    >
      <ReportFlow />
    </Suspense>
  );
}
