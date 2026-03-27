import Link from "next/link";

export const metadata = {
  title: "Contatti — Subtext",
  description: "Contatta Subtext.",
};

export default function ContattiPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <p className="font-ui text-sm text-muted">
        <Link href="/" className="nav-link text-muted hover:text-foreground">
          ← Home
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-medium tracking-tight text-foreground">Contatti</h1>
      <p className="font-ui mt-4 leading-relaxed text-muted">
        Per richieste privacy, supporto o collaborazioni, inserire qui email e/o
        PEC effettive prima del lancio pubblico. Nell&apos;MVP puoi usare un
        indirizzo interno di prova non pubblicato in repository.
      </p>
      <p className="font-ui mt-6 text-sm text-muted">
        Collegamento:{" "}
        <Link href="/privacy" className="nav-link text-foreground">
          Informativa privacy
        </Link>
        .
      </p>
    </div>
  );
}
