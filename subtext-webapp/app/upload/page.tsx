import { UploadFlow } from "@/components/UploadFlow";

export const metadata = {
  title: "Carica chat — Subtext",
  description: "Carica l'export WhatsApp per l'analisi.",
};

export default function UploadPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:max-w-3xl sm:px-6">
      <UploadFlow />
    </div>
  );
}
