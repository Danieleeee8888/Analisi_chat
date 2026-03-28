import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Come funziona Subtext: metodo, fondamenti e limiti — Subtext",
  description:
    "Turn-taking, lessico e metriche: fondamenti di ricerca, applicazioni professionali, cosa calcoliamo e cosa non facciamo. Bibliografia e limiti onesti.",
};

const references = [
  {
    line1:
      "Sacks, H., Schegloff, E.A., & Jefferson, G. (1974). A simplest systematics for the organization of turn-taking for conversation.",
    venue: "Language, 50(4), 696–735.",
    note:
      "Articolo fondativo dell'analisi conversazionale. Dimostra che il sistema dei turni è organizzato secondo regole universali, non dipendenti dalla cultura o dal contenuto.",
  },
  {
    line1:
      "Schegloff, E.A. (2007). Sequence Organization in Interaction: A Primer in Conversation Analysis (Vol. 1).",
    venue: "Cambridge University Press.",
    note:
      "Manuale di riferimento per lo studio delle sequenze conversazionali. Tratta riparazioni, aperture, chiusure e la struttura locale dell'interazione.",
  },
  {
    line1:
      "Walther, J.B. (1992). Interpersonal effects in computer-mediated interaction: A relational perspective.",
    venue: "Communication Research, 19(1), 52–90.",
    note:
      "Primo studio sistematico sulle dinamiche relazionali nella CMC. Introduce il concetto di hyperpersonal communication e le aspettative implicite sui tempi di risposta digitali.",
  },
  {
    line1:
      "Hancock, J.T., Curry, L.E., Goorha, S., & Woodworth, M. (2007). On lying and being lied to: A linguistic analysis of deception in computer-mediated communication.",
    venue: "Discourse Processes, 45(1), 1–23.",
    note:
      "Documenta come pattern di latenza e struttura linguistica variano sistematicamente in presenza di intenzione evasiva nelle comunicazioni digitali.",
  },
  {
    line1:
      "Pennebaker, J.W., Mehl, M.R., & Niederhoffer, K.G. (2003). Psychological aspects of natural language use: Our words, our selves.",
    venue: "Annual Review of Psychology, 54, 547–577.",
    note:
      "Review fondamentale sul legame tra scelte lessicali e stati psicologici. Base teorica del framework LIWC e di tutta la ricerca successiva sull'analisi automatica del linguaggio naturale.",
  },
  {
    line1:
      "Gottman, J.M., & Levenson, R.W. (1994). Marital processes predictive of later dissolution: Behavior, physiology, and health.",
    venue: "Journal of Personality and Social Psychology, 63(2), 221–233.",
    note:
      'Studio longitudinale su coppie reali. Identifica con alta accuratezza i pattern comunicativi che precedono la separazione, inclusi i marcatori dei "Four Horsemen": critica, disprezzo, difensività, ostruzionismo.',
  },
  {
    line1: "Pentland, A. (2012). The new science of building great teams.",
    venue: "Harvard Business Review, 90(4), 60–70.",
    note:
      "Analisi di pattern sociometrici in team aziendali. Dimostra che le dinamiche comunicative predicono la performance collettiva meglio del talento individuale o del contenuto delle discussioni.",
  },
  {
    line1:
      "Mergenthaler, E. (1996). Emotion-abstraction patterns in verbatim protocols: A new way of describing psychotherapeutic processes.",
    venue: "Journal of Consulting and Clinical Psychology, 64(6), 1306–1315.",
    note:
      "Metodo per analizzare trascrizioni di sessioni terapeutiche. Mostra come i cicli di astrazione emotiva nel linguaggio correlano con gli outcome clinici.",
  },
  {
    line1:
      "Tausczik, Y.R., & Pennebaker, J.W. (2010). The psychological meaning of words: LIWC and computerized text analysis.",
    venue: "Journal of Language and Social Psychology, 29(1), 24–54.",
    note:
      "Descrizione aggiornata del framework LIWC. Revisione sistematica di oltre vent'anni di ricerca sull'analisi automatica del linguaggio naturale applicata a contesti psicologici.",
  },
  {
    line1:
      "Herring, S.C. (Ed.). (1996). Computer-Mediated Communication: Linguistic, Social and Cross-Cultural Perspectives. John Benjamins Publishing.",
    venue: "John Benjamins Publishing.",
    note:
      "Volume di riferimento per lo studio della comunicazione digitale da prospettiva linguistica e socioculturale. Contestualizza la CMC rispetto all'interazione faccia a faccia.",
  },
] as const;

const metricRows = [
  [
    "Tempo mediano di risposta",
    "Secondi mediani tra messaggio e prima risposta cross-sender",
    "Asimmetrie persistenti >3x segnalano squilibrio di impegno o pattern di evitamento",
  ],
  [
    "Conversation start share",
    "Percentuale di conversazioni aperte da ciascuno",
    "Rivela chi porta il peso dell'iniziativa relazionale nel tempo",
  ],
  [
    "Densità segnali affettivi",
    "Occorrenze per 100 messaggi nel lessico affetto",
    "Baseline di espressività emotiva scritta — cambiamenti nel tempo sono più informativi del valore assoluto",
  ],
  [
    "Repair rate",
    "% di episodi tensivi seguiti da riparazione entro 5 messaggi",
    "Capacità di recupero — uno dei predittori di qualità relazionale più studiati",
  ],
  [
    "Balanced segments rate",
    "% di scambi con contributo paritario di entrambi",
    "Equilibrio strutturale del dialogo — indicatore di reciprocità",
  ],
  [
    "Monologue runs",
    "Sequenze di 4+ messaggi consecutivi dello stesso mittente",
    "Pattern di broadcasting vs dialogo — chi non aspetta risposta prima di continuare",
  ],
  [
    "Night message rate",
    "% di messaggi tra 00:00 e 06:00",
    "Indicatore di intensità comunicativa — in certi contesti segnala dipendenza",
  ],
  [
    "Friction windows",
    "Finestre di 5 messaggi con ≥2 marcatori di tensione",
    "Concentrazione di segnali di stress — aiuta a isolare episodi critici dal rumore di fondo",
  ],
] as const;

const limits = [
  {
    title: "Non diagnostichiamo patologie o disturbi di personalità",
    body:
      "La diagnosi richiede osservazione clinica, anamnesi, relazione terapeutica continuativa. Nessun algoritmo applicato a una chat può o deve sostituire questo.",
  },
  {
    title: "Non inferiremo violenza psicologica da pattern ambigui",
    body:
      "Il nostro sistema di alert si attiva solo per violenza testuale esplicita: minacce dirette, riferimenti documentati a episodi fisici. Mai per interpretazioni di pattern sottili che richiederebbero giudizio clinico.",
  },
  {
    title: "Non interpretiamo singoli messaggi come prove",
    body:
      "Un messaggio isolato non è un pattern. Ogni osservazione si basa su occorrenze ripetute in finestre temporali definite. Mai su episodi singoli.",
  },
  {
    title: "Non conserviamo il testo dopo l'elaborazione",
    body:
      "Il file viene processato in memoria e cancellato. Nessun archivio testuale, nessun training sui tuoi dati.",
  },
  {
    title: "Non sostituiamo il giudizio di un professionista",
    body:
      "Se quello che emerge ti preoccupa, parlane con qualcuno di fiducia o con un professionista. Il report è un punto di partenza strutturato, non una sentenza.",
  },
] as const;

export default function MetodoPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-ui mb-6 text-sm text-muted">
        <Link href="/" className="nav-link hover:text-foreground">
          ← Home
        </Link>
      </p>

      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Come funziona Subtext: metodo, fondamenti e limiti onesti
      </h1>

      <div className="font-ui mt-4 space-y-4 text-lg leading-relaxed text-muted">
        <p>
          Subtext non legge i sentimenti. Misura strutture. La differenza è cruciale: un sistema che
          &quot;interpreta&quot; produce storie plausibili ma non verificabili. Un sistema che misura restituisce
          dati su cui ragionare — da soli o con un professionista.
        </p>
        <p>
          Ci ispiriamo a decenni di ricerca sull&apos;interazione verbale, sulla comunicazione mediata dal
          computer e sull&apos;analisi conversazionale. Non siamo uno strumento clinico. Ma non siamo nemmeno un
          oroscopo.
        </p>
        <p>
          Questa pagina spiega cosa misuriamo, perché ha senso farlo, dove la ricerca su cui ci basiamo viene
          applicata in contesti professionali — e soprattutto cosa non facciamo e perché questa è una scelta
          deliberata, non una limitazione.
        </p>
      </div>

      {/* Sezione 1 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          1. Il turno come unità di misura fondamentale
        </h2>

        <h3 className="font-display mt-8 text-lg font-semibold text-foreground">
          L&apos;organizzazione dei turni non è decorativa
        </h3>
        <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Il lavoro di Sacks, Schegloff e Jefferson (1974) ha dimostrato che l&apos;interazione umana non è
            caotica: è organizzata in turni, con regole implicite su chi parla quando, come si cede la parola,
            come si segnala la fine di un intervento. Queste regole non sono consapevoli — le applichiamo
            automaticamente, e le violazioni vengono percepite immediatamente come socialmente significative.
          </p>
          <p>
            Nelle chat digitali il turno prende una forma diversa: non c&apos;è prosodia, non c&apos;è sguardo, non
            c&apos;è sovrapposizione vocale. Ma la struttura di fondo rimane. Chi apre una conversazione, chi
            risponde subito, chi aspetta ore, chi chiude sempre i thread — questi pattern non sono casuali. Sono
            comportamenti che si ripetono, e la ripetizione è misurabile.
          </p>
        </div>

        <blockquote className="font-ui my-8 border-l-4 border-accent py-2 pl-6 italic text-foreground">
          <p>
            L&apos;organizzazione dei turni non è un epifenomeno della conversazione: è la conversazione stessa.
          </p>
        </blockquote>
        <p className="font-ui text-sm text-muted">
          — E.A. Schegloff, <cite className="not-italic">Sequence Organization in Interaction</cite>, Cambridge
          University Press, 2007
        </p>

        <h3 className="font-display mt-8 text-lg font-semibold text-foreground">
          Perché la latenza non è neutrale
        </h3>
        <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Walther (1992) ha documentato come nelle interazioni digitali le persone sviluppino aspettative
            implicite sui tempi di risposta — e le violazioni di queste aspettative vengono interpretate come
            segnali relazionali, indipendentemente dall&apos;intenzione del mittente. Una risposta tardiva in un
            contesto in cui le risposte sono sempre state rapide non è un dato neutro.
          </p>
          <p>
            Hancock e colleghi (2007) hanno dimostrato che pattern di latenza anomala correlano con stati
            emotivi specifici, inclusa la tendenza all&apos;evasione e alla gestione strategica della
            comunicazione. In breve: come e quando rispondi dice qualcosa — anche quando non vuoi che lo dica.
            Subtext misura questi pattern nel tempo, non il singolo episodio.
          </p>
        </div>
      </div>

      {/* Sezione 2 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          2. Lessico e segnali emotivi scritti
        </h2>

        <h3 className="font-display mt-8 text-lg font-semibold text-foreground">
          Il linguaggio scritto lascia tracce sistematiche
        </h3>
        <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Pennebaker e colleghi (2003, 2010) hanno sviluppato il framework LIWC (Linguistic Inquiry and Word
            Count), dimostrando che la densità di certi tipi di parole in un corpus testuale correla in modo
            affidabile con stati psicologici, pattern relazionali e stili comunicativi. Il metodo è stato
            applicato in decine di contesti: dall&apos;analisi di diari personali alle trascrizioni di sessioni
            terapeutiche, dalle comunicazioni aziendali ai social media.
          </p>
          <p>
            Subtext usa micro-dizionari italiani costruiti su categorie analoghe: segnali di affetto, marcatori
            di tensione, pattern di riparazione post-conflitto, segnali di cura, checkin pratici, playfulness.
            Non interpretiamo il significato dei singoli messaggi. Contiamo occorrenze, calcoliamo densità,
            osserviamo come queste distribuzioni cambiano nel tempo.
          </p>
        </div>

        <h3 className="font-display mt-8 text-lg font-semibold text-foreground">
          Repair sequences: quando le relazioni si aggiustano (o no)
        </h3>
        <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Uno dei pattern più informativi che misuriamo è la sequenza tensione → riparazione. Schegloff,
            Jefferson e Sacks (1977) hanno descritto formalmente come le conversazioni gestiscono le rotture:
            chi le inizia, chi le risolve, in quanto tempo, con quali strategie linguistiche.
          </p>
          <p>
            Gottman e Levenson (1994) hanno dimostrato che nelle relazioni di coppia la capacità di riparazione
            dopo un episodio negativo è uno dei predittori più affidabili della qualità relazionale nel lungo
            periodo. Subtext misura il proxy osservabile: quante volte un marcatore di tensione è seguito da un
            segnale di riparazione entro una finestra temporale definita. Non dice se state bene. Dice se il
            pattern esiste — e con quale frequenza.
          </p>
        </div>
      </div>

      {/* Sezione 3 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          3. Dove viene usata la ricerca su cui ci basiamo
        </h2>

        <div className="mt-8 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border)] bg-background p-6 shadow-sm">
            <p className="text-3xl" aria-hidden>
              🏥
            </p>
            <h3 className="font-display mt-3 text-lg font-semibold text-foreground">
              Psicologia clinica e supervisione
            </h3>
            <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
              <p>
                L&apos;analisi strutturale delle trascrizioni viene usata in ricerca clinica da decenni.
                Mergenthaler (1996) ha sviluppato metodi per identificare pattern emotivi in trascrizioni di
                sessioni terapeutiche, dimostrando che certi cicli linguistici correlano con outcome terapeutici
                misurabili.
              </p>
              <p>
                Per i professionisti, Subtext non è uno strumento diagnostico — è un supporto alla preparazione
                e alla supervisione. Un&apos;analisi strutturale di un export anonimo può aiutare a identificare
                pattern utili da esplorare: chi porta il peso delle conversazioni, quali temi vengono
                sistematicamente evitati, come evolve il tono nel tempo. Il giudizio clinico resta interamente al
                professionista.
              </p>
            </div>
            <Link
              href="/upload?audience=aziende&focus=pro"
              className="font-ui mt-4 inline-block text-sm font-semibold text-accent2 underline-offset-2 hover:underline"
            >
              → Piano dedicato per professionisti
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-background p-6 shadow-sm">
            <p className="text-3xl" aria-hidden>
              💼
            </p>
            <h3 className="font-display mt-3 text-lg font-semibold text-foreground">
              Team, management e organizzazioni
            </h3>
            <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Pentland (2012), in uno studio su migliaia di ore di interazione in team aziendali, ha
                identificato pattern sociometrici che predicono la performance del gruppo meglio del talento
                individuale o del contenuto delle discussioni. I pattern includono: distribuzione
                dell&apos;energia comunicativa, frequenza degli scambi diretti, chi occupa lo spazio
                conversazionale.
              </p>
              <p>
                Nelle chat aziendali questi pattern sono leggibili. Chi risponde sempre per ultimo nelle
                sequenze decisionali. Chi monopolizza i thread informativi. Chi non viene mai direttamente
                interpellato pur essendo nel gruppo. Per manager e HR, portare evidenza strutturale in
                conversazioni difficili significa uscire dalle percezioni soggettive e discutere di dati.
              </p>
            </div>
            <Link
              href="/upload?audience=aziende"
              className="font-ui mt-4 inline-block text-sm font-semibold text-accent2 underline-offset-2 hover:underline"
            >
              → Percorso organizzazioni
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-background p-6 shadow-sm">
            <p className="text-3xl" aria-hidden>
              💬
            </p>
            <h3 className="font-display mt-3 text-lg font-semibold text-foreground">
              Relazioni interpersonali e qualità comunicativa
            </h3>
            <div className="font-ui mt-4 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Gottman e colleghi hanno identificato pattern comunicativi capaci di predire la qualità
                relazionale nel lungo periodo. I marcatori negativi — critica, disprezzo, difensività,
                ostruzionismo — sono tutti riconoscibili nel linguaggio scritto attraverso proxy lessicali.
              </p>
              <p>
                Subtext non dice se la tua relazione funzionerà. Misura proxy osservabili: densità di marcatori
                di tensione, simmetria nell&apos;espressione affettiva, frequenza dei pattern di riparazione,
                evoluzione di questi indici nel tempo. Se questi numeri cambiano drasticamente in un trimestre, è
                un dato. Cosa farne resta una decisione tua.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sezione 4 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          4. Dal testo ai numeri: cosa calcoliamo
        </h2>
        <p className="font-ui mb-8 mt-4 text-base text-muted">
          Ogni metrica in Subtext ha una motivazione specifica. Nessuna è arbitraria. Ecco cosa misuriamo e
          perché.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="border-b border-[var(--border)] px-4 py-3 text-left font-semibold text-foreground">
                  Metrica
                </th>
                <th className="border-b border-[var(--border)] px-4 py-3 text-left font-semibold text-foreground">
                  Cosa misura
                </th>
                <th className="border-b border-[var(--border)] px-4 py-3 text-left font-semibold text-foreground">
                  Perché conta
                </th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row, i) => (
                <tr key={row[0]} className={i % 2 === 0 ? "bg-background" : "bg-surface/50"}>
                  <td className="border-b border-[var(--border)] px-4 py-3 align-top text-foreground">
                    {row[0]}
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3 align-top text-muted">{row[1]}</td>
                  <td className="border-b border-[var(--border)] px-4 py-3 align-top text-muted">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-ui mt-4 text-xs italic text-muted">
          Queste metriche sono descrittive, non normative. Non esistono valori &quot;giusti&quot; o
          &quot;sbagliati&quot; — esistono pattern che vale la pena osservare nel contesto della specifica
          relazione.
        </p>
      </div>

      {/* Sezione 5 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          5. Cosa non facciamo — e perché è una scelta
        </h2>
        <p className="font-ui mt-4 text-base leading-relaxed text-muted">
          Questi limiti non sono timidezza metodologica. Sono rigore. La distinzione tra cosa misuriamo e cosa
          non inferiremo è il confine più importante che abbiamo disegnato nel costruire questo servizio.
        </p>

        <ul className="mt-8 list-none space-y-6 p-0">
          {limits.map((item) => (
            <li key={item.title} className="font-ui text-muted">
              <span className="mr-2 inline text-[var(--danger)]" aria-hidden>
                ✗
              </span>
              <strong className="font-semibold text-foreground">{item.title}</strong>
              <p className="mt-2 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="font-ui mt-8 border-l-4 border-accent pl-6 text-base leading-relaxed text-foreground">
          Un sistema che dice &quot;questa relazione è tossica&quot; a partire da una chat si prende una
          responsabilità che non può sostenere. Un sistema che dice &quot;hai ricevuto 340 richieste di posizione in
          60 giorni — ecco il dato&quot; restituisce informazione verificabile e lascia la valutazione a te, o al
          professionista che ti supporta. Questa è la differenza tra interpretazione e misurazione. Subtext
          misura.
        </p>
      </div>

      {/* Sezione 6 */}
      <div className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">6. Riferimenti</h2>
        <p className="mb-8 mt-4 text-sm text-muted">
          I riferimenti seguenti costituiscono la base teorica del metodo. Subtext non è affiliato con nessuno
          degli autori citati.
        </p>

        <div className="space-y-4">
          {references.map((r) => (
            <div
              key={r.line1}
              className="rounded-xl border border-[var(--border)] bg-background px-5 py-4"
            >
              <p className="font-ui text-sm font-semibold text-foreground">{r.line1}</p>
              <p className="font-ui mt-1 text-xs text-muted">{r.venue}</p>
              <p className="font-ui mt-3 text-[13px] leading-relaxed text-muted">{r.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-accent p-8 text-background">
        <h2 className="font-display text-2xl font-bold text-background">
          Pronto a vedere i pattern della tua conversazione?
        </h2>
        <p className="font-ui mt-3 text-base leading-relaxed text-background/80">
          La pre-analisi è gratuita. Il report completo parte da 4,99€. Nessun account, nessun archivio della
          tua chat.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-background px-5 py-3 text-center text-sm font-bold text-accent transition hover:bg-background/90"
          >
            Analisi personale →
          </Link>
          <Link
            href="/upload?audience=aziende"
            className="inline-flex items-center justify-center rounded-lg border-2 border-background/50 px-5 py-3 text-center text-sm font-bold text-background transition hover:border-background"
          >
            Percorso professionale →
          </Link>
        </div>
      </div>
    </div>
  );
}
