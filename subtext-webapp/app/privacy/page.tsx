import Link from "next/link";

export const metadata = {
  title: "Privacy — Subtext",
  description: "Informazioni sulla privacy e sul trattamento dei dati.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <p className="font-ui text-sm text-muted">
        <Link href="/" className="nav-link text-muted hover:text-foreground">
          ← Home
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-medium tracking-tight text-foreground">Privacy</h1>
      <p className="font-ui mt-4 text-sm text-muted">
        Testo in italiano chiaro; versione legale definitiva potrà essere
        revisionata con un legale.
      </p>

      <section className="font-ui mt-8 space-y-6 text-muted">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cosa facciamo con la tua chat</h2>
          <p className="mt-2 leading-relaxed">
            Il file che carichi viene elaborato sul server (in memoria per le
            fasi previste dall&apos;applicazione). Il testo viene anonimizzato
            secondo le regole del prodotto prima di ulteriori usi (es. report con
            AI). Non vendiamo il contenuto delle chat a terzi.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cosa conserviamo</h2>
          <p className="mt-2 leading-relaxed">
            L&apos;obiettivo di progetto è <strong className="text-foreground">non conservare</strong> testo di
            chat, nomi reali o contenuti sensibili oltre quanto serve alla singola
            sessione di lavoro. In produzione andranno definiti tempi di retention
            e log minimi (senza corpo messaggi).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pagamenti</h2>
          <p className="mt-2 leading-relaxed">
            Per il report a pagamento useremo un fornitore di pagamenti (Stripe).
            Resteranno i dati necessari alla transazione e alla conformità fiscale,
            non l&apos;intera chat.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cookie</h2>
          <p className="mt-2 leading-relaxed">
            Solo cookie o tecnologie strettamente necessarie al funzionamento del
            sito; niente profilazione pubblicitaria da parte di Subtext nella
            versione descritta qui.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Diritti GDPR</h2>
          <p className="mt-2 leading-relaxed">
            Hai diritto di accesso, rettifica, cancellazione, limitazione,
            portabilità dove applicabile e opposizione. Per esercitarli scrivi
            all&apos;indirizzo indicato in{" "}
            <Link href="/contatti" className="nav-link text-foreground">
              Contatti
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
