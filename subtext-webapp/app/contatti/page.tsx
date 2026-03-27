import Link from "next/link";

export const metadata = {
  title: "Contatti — Subtext",
  description: "Contatta Subtext.",
};

export default function ContattiPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-sm text-stone-500">
        <Link href="/" className="text-stone-700 hover:text-stone-900">
          ← Home
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold text-stone-900">Contatti</h1>
      <p className="mt-4 leading-relaxed text-stone-700">
        Per richieste privacy, supporto o collaborazioni, inserire qui email e/o
        PEC effettive prima del lancio pubblico. Nell&apos;MVP puoi usare un
        indirizzo interno di prova non pubblicato in repository.
      </p>
      <p className="mt-6 text-sm text-stone-500">
        Collegamento:{" "}
        <Link href="/privacy" className="text-stone-800 underline">
          Informativa privacy
        </Link>
        .
      </p>
    </div>
  );
}
