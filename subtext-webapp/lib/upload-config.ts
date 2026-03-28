import type { UploadFocus } from "./context-form-types";

export interface UploadHeroConfig {
  badge: string;
  badgeClass: string;
  title: string;
  subtitle: string;
  accentColor: string;
  heroGradient: string;
  orbitBg: string;
  orbitGlow: string;
  contextIntro: string;
  whoLabel: string;
  whoPlaceholder: string;
  questionPlaceholder: string;
  ctaLabel: string;
}

/** Solo stringhe e classi CSS Tailwind — nessun JSX. */
export function getUploadConfig(focus: UploadFocus | null | undefined): UploadHeroConfig {
  switch (focus) {
    case "dating":
      return {
        badge: "Nuove conoscenze",
        badgeClass: "bg-accent3-light text-accent3-dark ring-accent3/20",
        title: "Carica la chat.\nScopri se c'è davvero qualcosa.",
        subtitle:
          "Non si tratta di spiare — si tratta di smettere di\n"
          + "interpretare. I pattern ci sono. Basta saperli leggere.",
        accentColor: "accent3",
        heroGradient: "from-[#fff7ed] via-white to-white",
        orbitBg: "bg-accent3",
        orbitGlow: "0 20px 50px rgba(249,115,22,0.15)",
        contextIntro:
          "Carica la chat con questa persona. "
          + "Ti diremo chi investe di più, se l'interesse è reciproco "
          + "e cosa dicono i silenzi tra un messaggio e l'altro.",
        whoLabel: "Come ti chiami in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder:
          "Es. capire se è solo cortesia o c'è interesse reale...",
        ctaLabel: "Analizza · "
      };

    case "coppia":
      return {
        badge: "Coppia",
        badgeClass: "bg-accent-light text-accent ring-accent/20",
        title: "Carica la chat.\nTrova quello che non riesci a vedere.",
        subtitle:
          "Dall'interno di una relazione certi pattern "
          + "sono invisibili.\nSubtext li rende leggibili.",
        accentColor: "accent",
        heroGradient: "from-[#eef2ff] via-white to-white",
        orbitBg: "bg-accent",
        orbitGlow: "0 20px 50px rgba(99,102,241,0.15)",
        contextIntro:
          "Carica la chat con il tuo partner. "
          + "Analizzeremo chi porta il peso delle conversazioni "
          + "difficili, come cambiate nel tempo e dove si perdono "
          + "le cose importanti.",
        whoLabel: "Chi sei tu in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder: "Es. capire se ci sono pattern dopo le litigate...",
        ctaLabel: "Analizza · "
      };

    case "famiglia":
      return {
        badge: "Famiglia",
        badgeClass: "bg-accent-light text-accent ring-accent/20",
        title: "Carica la chat.\nScopri le dinamiche che nessuno nomina.",
        subtitle:
          "In ogni gruppo familiare ci sono pattern impliciti.\n"
          + "Chi decide, chi media, chi sparisce quando le cose si complicano.",
        accentColor: "accent",
        heroGradient: "from-[#eef2ff] via-white to-white",
        orbitBg: "bg-accent",
        orbitGlow: "0 20px 50px rgba(99,102,241,0.12)",
        contextIntro:
          "Carica la chat di famiglia o con un familiare. "
          + "Analizzeremo chi occupa più spazio, "
          + "chi resta ai margini e come si gestiscono "
          + "i momenti di tensione.",
        whoLabel: "Chi sei tu in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder:
          "Es. capire chi prende sempre le decisioni per tutti...",
        ctaLabel: "Analizza · "
      };

    case "amici":
      return {
        badge: "Amicizia",
        badgeClass: "bg-accent3-light text-accent3-dark ring-accent3/20",
        title: "Carica la chat.\nCapisci cosa tiene in piedi questa amicizia.",
        subtitle:
          "Chi c'è davvero quando conta. Chi dà e chi prende.\n"
          + "Chi riapre i silenzi e chi li lascia cadere.",
        accentColor: "accent3",
        heroGradient: "from-[#fff7ed] via-white to-white",
        orbitBg: "bg-accent3",
        orbitGlow: "0 20px 50px rgba(249,115,22,0.12)",
        contextIntro:
          "Carica la chat con un amico o il gruppo. "
          + "Analizzeremo chi porta il peso della relazione, "
          + "l'equilibrio del dare e ricevere "
          + "e i pattern che si ripetono nel tempo.",
        whoLabel: "Chi sei tu in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder: "Es. capire perché ultimamente ci sentiamo meno...",
        ctaLabel: "Analizza · "
      };

    case "completo":
      return {
        badge: "Analisi completa",
        badgeClass: "bg-accent2-light text-accent2 ring-accent2/20",
        title: "Carica la chat.\nTutta la storia, ogni fase.",
        subtitle:
          "L'analisi più approfondita: ogni periodo, "
          + "ogni cambiamento,\nogni pattern dall'inizio a oggi.",
        accentColor: "accent2",
        heroGradient: "from-[#f0fdfa] via-white to-white",
        orbitBg: "bg-accent2",
        orbitGlow: "0 20px 50px rgba(13,148,136,0.15)",
        contextIntro:
          "Carica la chat completa. "
          + "Analizzeremo l'intera cronologia: "
          + "come siete cambiati nel tempo, "
          + "i periodi di distanza e di intensità, "
          + "i pattern strutturali e tematici insieme.",
        whoLabel: "Chi sei tu in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder: "Es. capire cosa è cambiato nell'ultimo anno...",
        ctaLabel: "Analizza · "
      };

    case "team":
      return {
        badge: "Team & Gruppo",
        badgeClass: "bg-accent-light text-accent ring-accent/20",
        title: "Carica la chat del team.\nLeggi le dinamiche che rallentano.",
        subtitle:
          "Chi domina i thread. Chi non viene mai interpellato.\n"
          + "Dove si bloccano le decisioni. Tutto misurabile.",
        accentColor: "accent",
        heroGradient: "from-[#f8fafb] via-white to-white",
        orbitBg: "bg-accent",
        orbitGlow: "0 20px 50px rgba(99,102,241,0.12)",
        contextIntro:
          "Carica la chat del gruppo di lavoro o del team. "
          + "Analizzeremo distribuzione dei turni, "
          + "chi occupa spazio comunicativo, "
          + "sottogruppi impliciti e pattern decisionali.",
        whoLabel: "Il tuo ruolo o nome nella chat",
        whoPlaceholder: "Come appari nella chat (es. nome, ruolo)",
        questionPlaceholder:
          "Es. capire perché le decisioni si bloccano sempre...",
        ctaLabel: "Analizza · "
      };

    case "brainstorming":
      return {
        badge: "Brainstorming",
        badgeClass: "bg-accent3-light text-accent3-dark ring-accent3/20",
        title: "Carica la chat del progetto.\nEstrai le idee, non il rumore.",
        subtitle:
          "Temi emergenti, proposte ignorate, chi genera "
          + "e chi valuta.\nOrganizzazione automatica di sessioni lunghe.",
        accentColor: "accent3",
        heroGradient: "from-[#fff7ed] via-white to-white",
        orbitBg: "bg-accent3",
        orbitGlow: "0 20px 50px rgba(249,115,22,0.12)",
        contextIntro:
          "Carica la chat della sessione di lavoro o progetto. "
          + "Estrarremo i temi emersi, le idee ricorrenti, "
          + "le proposte che non hanno atterrato "
          + "e chi ha contribuito a cosa.",
        whoLabel: "Il tuo nome o ruolo nella chat",
        whoPlaceholder: "Come appari nella chat di progetto",
        questionPlaceholder:
          "Es. capire quali idee non sono mai state sviluppate...",
        ctaLabel: "Analizza · "
      };

    case "pro":
      return {
        badge: "Supervisione professionale",
        badgeClass: "bg-[#f5f3ff] text-[#7c3aed] ring-[#7c3aed]/15",
        title: "Carica l'export anonimo.\nSintesi strutturale difendibile.",
        subtitle:
          "Per terapeuti, counselor, coach e HR. "
          + "Analisi su testo già anonimizzato.\nNessun dato identificativo.",
        accentColor: "violet",
        heroGradient: "from-[#f5f3ff] via-white to-white",
        orbitBg: "bg-[#7c3aed]",
        orbitGlow: "0 20px 50px rgba(124,58,237,0.15)",
        contextIntro:
          "Carica l'export della chat su cui stai lavorando. "
          + "Produrremo una sintesi strutturale e tematica: "
          + "pattern comunicativi, sequenze tensione-riparazione, "
          + "distribuzione del carico emotivo. "
          + "Non sostituto del giudizio clinico.",
        whoLabel: "Il tuo ruolo in questo contesto",
        whoPlaceholder: "Es. terapeuta, coach, HR...",
        questionPlaceholder:
          "Es. identificare pattern di evitamento o dinamiche ricorrenti...",
        ctaLabel: "Analizza · "
      };

    case "sales":
      return {
        badge: "Sales & Account",
        badgeClass: "bg-accent2-light text-accent2 ring-accent2/20",
        title: "Carica la chat con il cliente.\nLeggi quello che non dice.",
        subtitle:
          "Latenze crescenti, risposte evasive, tono che cambia.\n"
          + "Tutto misurabile prima che sia troppo tardi.",
        accentColor: "accent2",
        heroGradient: "from-[#f0fdfa] via-white to-white",
        orbitBg: "bg-accent2",
        orbitGlow: "0 20px 50px rgba(13,148,136,0.15)",
        contextIntro:
          "Carica la chat con il cliente o partner commerciale. "
          + "Analizzeremo l'evoluzione del tono, "
          + "i pattern di latenza e risposta, "
          + "i segnali di disimpegno precoce "
          + "e le asimmetrie di interesse nel tempo.",
        whoLabel: "Il tuo nome o ruolo nella chat",
        whoPlaceholder: "Come appari nella chat (es. nome, Account Manager)",
        questionPlaceholder:
          "Es. capire se il cliente sta perdendo interesse...",
        ctaLabel: "Analizza · "
      };

    default:
      return {
        badge: "Subtext",
        badgeClass: "bg-violet-100 text-violet-900 ring-violet-200/80",
        title: "Carica la conversazione.\nEstrai la struttura, non solo i messaggi.",
        subtitle:
          "Metriche osservabili e lettura del testo insieme.\n"
          + "Non solo conteggi — comprensione di come state comunicando.",
        accentColor: "accent",
        heroGradient: "from-[#eef2ff] via-white to-white",
        orbitBg: "bg-accent",
        orbitGlow: "0 20px 50px rgba(99,102,241,0.12)",
        contextIntro:
          "Carica la chat che vuoi analizzare. "
          + "Analizzeremo ritmi, turni, pattern comunicativi "
          + "e il testo per temi e toni.",
        whoLabel: "Chi sei tu in questa chat?",
        whoPlaceholder: "Il tuo nome come appare in WhatsApp",
        questionPlaceholder: "Es. capire cosa è cambiato ultimamente...",
        ctaLabel: "Analizza · "
      };
  }
}
