import Link from "next/link";

const steps = [
  {
    title: "Carica",
    description:
      "Esporta la chat da WhatsApp come file .zip e caricarlo in pochi secondi.",
  },
  {
    title: "Scopri",
    description:
      "Ottieni una pre-analisi gratuita con metriche chiare sul modo in cui vi scrivete.",
  },
  {
    title: "Migliora",
    description:
      "Sblocca il report completo per approfondire dinamiche, ritmi e segnali ricorrenti.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        <p className="mb-4 inline-flex rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 shadow-sm">
          La tua chat viene eliminata immediatamente dopo l&apos;analisi
        </p>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl sm:leading-tight">
          Quello che le tue chat dicono davvero
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-stone-600">
          Subtext trasforma l&apos;export WhatsApp in metriche di comunicazione e
          insight leggibili — senza giudizio automatico, con linguaggio chiaro e
          rispetto della privacy.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-8 py-3.5 text-center text-base font-medium text-white shadow-sm transition hover:bg-stone-800"
          >
            Carica la tua chat
          </Link>
          <p className="text-sm text-stone-600">
            <span className="font-medium text-stone-800">
              Report completo: 4,99€
            </span>
            <span className="text-stone-400"> — </span>
            Pre-analisi gratuita
          </p>
        </div>
      </section>

      <section
        id="come-funziona"
        className="border-t border-stone-200/80 bg-white py-16"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Come funziona
          </h2>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            Tre passi
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-sm font-semibold text-stone-700"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-transparent px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Inizia da qui
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
