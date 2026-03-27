import Link from "next/link";

export const metadata = {
  title: "Privacy — Subtext",
  description: "Informazioni sulla privacy e sul trattamento dei dati.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-sm text-stone-500">
        <Link href="/" className="text-stone-700 hover:text-stone-900">
          ← Home
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold text-stone-900">Privacy</h1>
      <p className="mt-4 text-sm text-stone-500">
        Testo in italiano chiaro; versione legale definitiva potrà essere
        revisionata con un legale.
      </p>

      <section className="mt-8 space-y-6 text-stone-700">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Cosa facciamo con la tua chat</h2>
          <p className="mt-2 leading-relaxed">
            Il file che carichi viene elaborato sul server (in memoria per le
            fasi previste dall&apos;applicazione). Il testo viene anonimizzato
            secondo le regole del prodotto prima di ulteriori usi (es. report con
            AI). Non vendiamo il contenuto delle chat a terzi.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Cosa conserviamo</h2>
          <p className="mt-2 leading-relaxed">
            L&apos;obiettivo di progetto è <strong>non conservare</strong> testo di
            chat, nomi reali o contenuti sensibili oltre quanto serve alla singola
            sessione di lavoro. In produzione andranno definiti tempi di retention
            e log minimi (senza corpo messaggi).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Pagamenti</h2>
          <p className="mt-2 leading-relaxed">
            Per il report a pagamento useremo un fornitore di pagamenti (Stripe).
            Resteranno i dati necessari alla transazione e alla conformità fiscale,
            non l&apos;intera chat.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Cookie</h2>
          <p className="mt-2 leading-relaxed">
            Solo cookie o tecnologie strettamente necessarie al funzionamento del
            sito; niente profilazione pubblicitaria da parte di Subtext nella
            versione descritta qui.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Diritti GDPR</h2>
          <p className="mt-2 leading-relaxed">
            Hai diritto di accesso, rettifica, cancellazione, limitazione,
            portabilità dove applicabile e opposizione. Per esercitarli scrivi
            all&apos;indirizzo indicato in{" "}
            <Link href="/contatti" className="text-stone-900 underline">
              Contatti
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
