import Link from "next/link";

export const metadata = {
  title: "FAQ — Subtext",
  description: "Domande frequenti su Subtext.",
};

const items: { q: string; a: string }[] = [
  {
    q: "Come funziona esattamente?",
    a: "Esporti la chat da WhatsApp come .zip, carichi il file, rispondi a poche domande contestuali. Ricevi una pre-analisi gratuita; il report approfondito è a pagamento quando il flusso Stripe è attivo."
  },
  {
    q: "I miei messaggi vengono letti da qualcuno?",
    a: "Il trattamento è automatizzato sul server. Nessuna lettura “umana” di routine delle chat fatte salve assistenza legale o incidenti di sicurezza da gestire secondo policy future."
  },
  {
    q: "Come vengono protetti i miei dati?",
    a: "Upload su HTTPS, elaborazione in memoria dove possibile, anonimizzazione dei nomi prima di passaggi successivi. Riduci i rischi non caricando media inutili nell’export."
  },
  {
    q: "Posso analizzare una chat di gruppo?",
    a: "Il parser è pensato per export WhatsApp; i gruppi con molti partecipanti funzionano se il formato è riconosciuto, ma l’interpretazione diventa più complessa."
  },
  {
    q: "Di quanti messaggi ho bisogno?",
    a: "Per validità tecnica chiediamo un minimo (es. 200 messaggi). Più la cronologia è ricca, più le metriche sono stabili — entro i limiti previsti dal prodotto."
  },
  {
    q: "Subtext può dirmi se la mia relazione è sana?",
    a: "No. Subtext offre osservazioni descrittive su pattern comunicativi, non diagnosi cliniche né verdetto sulla “salute” della relazione."
  },
  {
    q: "Posso avere un rimborso?",
    a: "La policy rimborsi sarà pubblicata prima dell’apertura commerciale (dipende anche da Stripe e dal diritto di recesso applicabile)."
  },
  {
    q: "Come esporto la chat da WhatsApp?",
    a: "Da WhatsApp: chat → ⋮ → Altro → Esporta chat → senza media o con media. Scarichi uno zip che contiene il file .txt della conversazione."
  }
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <p className="font-ui text-sm text-muted">
        <Link href="/" className="nav-link text-muted hover:text-foreground">
          ← Home
        </Link>
      </p>
      <h1 className="font-display mt-6 text-3xl font-medium tracking-tight text-foreground">
        Domande frequenti
      </h1>
      <dl className="mt-10 space-y-10">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="font-ui font-semibold text-foreground">{item.q}</dt>
            <dd className="font-ui mt-2 leading-relaxed text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
