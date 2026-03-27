import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodo e riferimenti — Subtext",
  description:
    "Cosa misuriamo nelle chat, da dove nasce il metodo, limiti onesti e bibliografia su turn-taking e analisi conversazionale.",
};

const references = [
  {
    authors: "Sacks, H., Schegloff, E. A., Jefferson, G.",
    year: "1974",
    title: "A Simplest Systematics for the Organization of Turn-Taking in Conversation",
    venue: "Language, 50(4), 696–735",
    note:
      "Fondamento dell’analisi conversazionale: il turno come unità organizzata, gestita in tempo reale dagli interlocutori.",
  },
  {
    authors: "Schegloff, E. A.",
    year: "2007",
    title: "Sequence Organization in Interaction: A Primer in Conversation Analysis",
    venue: "Cambridge University Press",
    note: "Approfondimento su sequenze, riparazioni e struttura locale dell’interazione.",
  },
  {
    authors: "Herring, S. C. (ed.)",
    year: "1996",
    title: "Computer-Mediated Communication: Linguistic, Social and Cross-Cultural Perspectives",
    venue: "John Benjamins",
    note:
      "Riferimento storico sulla comunicazione mediata dal computer: utile per contestualizzare chat e messaggistica asincrona.",
  },
] as const;

export default function MetodoPage() {
  return (
    <div className="mx-auto max-w-[760px] flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-ui text-sm text-muted">
        <Link href="/" className="nav-link hover:text-foreground">
          ← Home
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Metodo, limiti e riferimenti
      </h1>
      <p className="font-ui mt-4 text-lg leading-relaxed text-muted">
        Subtext non “indovina” i sentimenti. Parte da{" "}
        <strong className="font-semibold text-foreground">strutture osservabili</strong> (frequenze,
        tempi, simmetrie) e, sul testo già anonimo, aggiunge una{" "}
        <strong className="font-semibold text-foreground">lettura linguistica</strong> guidata: temi
        ricorrenti, contesto tra i messaggi, registri di tono — sempre con limiti onesti e senza
        diagnosticare. Questa pagina collega quella scelta a tradizioni di ricerca e al documento interno
        di prodotto (project bible).
      </p>

      <section className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          Perché non basta “chi scrive per primo”
        </h2>
        <div className="font-ui mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            Sapere chi invia il primo messaggio del giorno è un dato grezzo. Ciò che conta per capire una
            relazione o un team è{" "}
            <em className="not-italic font-medium text-foreground">
              come si distribuiscono i turni nel tempo
            </em>
            : chi riapre dopo pause lunghe, dove si assottigliano le risposte, se certi temi compaiono o
            scompaiono, se dopo tensione il thread cambia registro prima di chiudere il tema.
          </p>
          <p>
            È la differenza tra un numero isolato e una{" "}
            <strong className="font-semibold text-foreground">traiettoria</strong>. Il report cerca di
            descrivere traiettorie, non etichette.
          </p>
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          Radici: analisi conversazionale e testo digitale
        </h2>
        <p className="font-ui mt-4 text-[15px] leading-relaxed text-muted">
          L’analisi conversazionale (CA) studia l’interazione parlata come fenomeno ordinato: turn-taking,
          riparazioni, sequenze. Il lavoro classico di Sacks, Schegloff e Jefferson sul turn-taking è il
          riferimento più citato per capire perché “chi parla quando” non sia casuale, ma organizzato.
        </p>
        <p className="font-ui mt-4 text-[15px] leading-relaxed text-muted">
          Le chat testuali sono{" "}
          <strong className="font-semibold text-foreground">comunicazione mediata</strong>: latenze più
          lunghe, messaggi spezzati, assenza di prosodia. I principi della CA non si applicano alla lettera,
          ma l’idea che l’interazione abbia struttura misurabile resta valida — ed è ciò che la pre-analisi
          statistica cattura prima di qualsiasi interpretazione narrativa.
        </p>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          Bibliografia essenziale
        </h2>
        <ul className="mt-6 space-y-6">
          {references.map((r) => (
            <li
              key={r.title}
              className="rounded-xl border border-[var(--border)] bg-surface/80 px-5 py-4"
            >
              <p className="font-ui text-sm font-semibold text-foreground">
                {r.authors} ({r.year}). {r.title}
              </p>
              <p className="font-ui mt-1 text-xs text-muted">{r.venue}</p>
              <p className="font-ui mt-3 text-[13px] leading-relaxed text-muted">{r.note}</p>
            </li>
          ))}
        </ul>
        <p className="font-ui mt-6 text-[13px] leading-relaxed text-muted">
          Per approfondimenti generici: voci come “Conversation analysis” su risorse accademiche
          (es. Oxford Research Encyclopedia of Linguistics) offrono panorami aggiornati. Subtext non è uno
          strumento accademico: usa queste tradizioni come{" "}
          <strong className="font-semibold text-foreground">ispirazione metodologica</strong>, non come
          certificazione disciplinare.
        </p>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          Allineamento al documento di prodotto (project bible)
        </h2>
        <ul className="font-ui mt-4 list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-foreground">Pre-analisi gratuita:</strong> metriche locali, zero API a
            pagamento — come da flusso Step 2–3 della bible.
          </li>
          <li>
            <strong className="text-foreground">Report completo:</strong> sezioni su profilo comunicativo,
            dinamiche, tempo, aree di crescita — vedi outline Sezione 2–8 della bible.
          </li>
          <li>
            <strong className="text-foreground">Alert a livelli:</strong> pattern quantificabili e violenza
            esplicita testuale; nessuna inferenza di violenza psicologica “sottile” senza evidenza nel
            testo — coerente con Livello 3 della bible.
          </li>
          <li>
            <strong className="text-foreground">Pro trasversale (roadmap):</strong> impronta comunicativa
            attraverso contesti diversi — Sezione 3 della bible.
          </li>
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--border)] bg-accent-light/40 px-6 py-6">
        <h2 className="font-display text-lg font-bold text-foreground">Limiti (onesti)</h2>
        <ul className="font-ui mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>Non sostituisce psicologi o terapeuti; non diagnostica.</li>
          <li>Non interpreta messaggi singoli come prove definitive.</li>
          <li>La chat non contiene tutto ciò che accade fuori dal testo (in presenza, silenzi non scritti).</li>
          <li>Il testo viene eliminato dopo l’elaborazione, come da policy privacy del prodotto.</li>
        </ul>
        <Link
          href="/upload"
          className="font-ui mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          Vai al caricamento
        </Link>
      </section>
    </div>
  );
}
