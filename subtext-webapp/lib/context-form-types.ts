export type RelationshipType =
  | "coppia"
  | "conoscenza"
  | "amicizia"
  | "famiglia"
  | "gruppo"
  | "lavoro";

export type UploadFocus =
  | "dating"
  | "coppia"
  | "famiglia"
  | "amici"
  | "completo"
  | "team"
  | "brainstorming"
  | "pro"
  | "sales"
  | null;

const UPLOAD_FOCUS_VALUES = [
  "dating",
  "coppia",
  "famiglia",
  "amici",
  "completo",
  "team",
  "brainstorming",
  "pro",
  "sales"
] as const satisfies readonly Exclude<UploadFocus, null>[];

export function focusFromQueryParam(param: string | null | undefined): UploadFocus {
  if (!param) return null;
  const x = param.trim().toLowerCase();
  return (UPLOAD_FOCUS_VALUES as readonly string[]).includes(x) ? (x as UploadFocus) : null;
}

export function isEnterpriseFocus(focus: UploadFocus): boolean {
  return (
    focus === "team" ||
    focus === "brainstorming" ||
    focus === "pro" ||
    focus === "sales"
  );
}

export type AnalysisMode = "comunicativo" | "tematico";

/** Privati vs organizzazioni — impostato dalla home / query upload, non dal singolo campo testo. */
export type AudienceSegment = "personal" | "enterprise";

export function parseAudienceSegment(v: unknown): AudienceSegment {
  if (v === "enterprise") return "enterprise";
  return "personal";
}

/** Query ?audience= — accetta sinonimi per link marketing. */
export function audienceFromQueryParam(param: string | null | undefined): AudienceSegment {
  if (!param) return "personal";
  const x = param.trim().toLowerCase();
  if (x === "aziende" || x === "enterprise" || x === "organizzazioni" || x === "b2b") {
    return "enterprise";
  }
  return "personal";
}

export type AnalysisPeriod =
  | "2months" // Ultimi 2 mesi
  | "6months" // Ultimi 6 mesi (default)
  | "full"; // Tutta la chat

export const ANALYSIS_PERIODS: readonly AnalysisPeriod[] = ["2months", "6months", "full"];

export function parseAnalysisPeriod(v: unknown): AnalysisPeriod {
  return typeof v === "string" && ANALYSIS_PERIODS.includes(v as AnalysisPeriod)
    ? (v as AnalysisPeriod)
    : "6months";
}

/** Dati contestuali inviati con il file (Step 3+ API). */
export interface ContextFormData {
  audienceSegment: AudienceSegment;
  relationshipType: RelationshipType;
  whoAreYou: string;
  howLongKnown: string;
  liveOrWorkTogether: "si" | "no";
  ageBand: string;
  specificQuestion: string;
  analysisPeriod: AnalysisPeriod;
  /** Opzionale: le route API attuali non lo persistono in round-trip; inviato dal client per coerenza. */
  analysisMode?: AnalysisMode;
}

export function defaultsForFocus(focus: UploadFocus): {
  relationshipType: RelationshipType;
  analysisMode: AnalysisMode;
  analysisPeriod: AnalysisPeriod;
  audienceSegment: AudienceSegment;
} {
  switch (focus) {
    case "dating":
      return {
        relationshipType: "conoscenza",
        analysisMode: "tematico",
        analysisPeriod: "2months",
        audienceSegment: "personal"
      };
    case "coppia":
      return {
        relationshipType: "coppia",
        analysisMode: "comunicativo",
        analysisPeriod: "6months",
        audienceSegment: "personal"
      };
    case "famiglia":
      return {
        relationshipType: "famiglia",
        analysisMode: "comunicativo",
        analysisPeriod: "6months",
        audienceSegment: "personal"
      };
    case "amici":
      return {
        relationshipType: "amicizia",
        analysisMode: "tematico",
        analysisPeriod: "6months",
        audienceSegment: "personal"
      };
    case "completo":
      return {
        relationshipType: "coppia",
        analysisMode: "comunicativo",
        analysisPeriod: "full",
        audienceSegment: "personal"
      };
    case "team":
      return {
        relationshipType: "gruppo",
        analysisMode: "comunicativo",
        analysisPeriod: "6months",
        audienceSegment: "enterprise"
      };
    case "brainstorming":
      return {
        relationshipType: "gruppo",
        analysisMode: "tematico",
        analysisPeriod: "2months",
        audienceSegment: "enterprise"
      };
    case "pro":
      return {
        relationshipType: "lavoro",
        analysisMode: "comunicativo",
        analysisPeriod: "full",
        audienceSegment: "enterprise"
      };
    case "sales":
      return {
        relationshipType: "lavoro",
        analysisMode: "tematico",
        analysisPeriod: "6months",
        audienceSegment: "enterprise"
      };
    default:
      return {
        relationshipType: "coppia",
        analysisMode: "comunicativo",
        analysisPeriod: "6months",
        audienceSegment: "personal"
      };
  }
}

export function createEmptyForm(segment: AudienceSegment, focus?: UploadFocus): ContextFormData {
  const defaults = defaultsForFocus(focus ?? null);
  return {
    audienceSegment: segment,
    relationshipType: defaults.relationshipType,
    whoAreYou: "",
    howLongKnown: "",
    liveOrWorkTogether: "no",
    ageBand: "",
    specificQuestion: "",
    analysisPeriod: defaults.analysisPeriod,
    analysisMode: defaults.analysisMode
  };
}

export const PERIOD_OPTIONS: {
  value: AnalysisPeriod;
  label: string;
  sublabel: string;
  price: string;
  priceAmount: number;
  badge?: string;
}[] = [
  {
    value: "2months",
    label: "Ultimi 2 mesi",
    sublabel:
      "Ideale per nuove conoscenze — focus su temi, interesse, reciprocità",
    price: "4,99€",
    priceAmount: 499,
    badge: "Nuove conoscenze"
  },
  {
    value: "6months",
    label: "Ultimi 6 mesi",
    sublabel: "L'analisi standard — ritmi, evoluzione, pattern comunicativi",
    price: "4,99€",
    priceAmount: 499,
    badge: "Consigliato"
  },
  {
    value: "full",
    label: "Tutta la chat",
    sublabel: "L'analisi completa — ogni fase della relazione nel tempo",
    price: "9,99€",
    priceAmount: 999,
    badge: "Completo"
  }
];

/** Stessi valori API, etichette orientate a contesti organizzativi. */
export const RELATIONSHIP_OPTIONS_ENTERPRISE: { value: RelationshipType; label: string }[] = [
  { value: "lavoro", label: "Cliente, fornitore, partner o trattativa commerciale" },
  { value: "gruppo", label: "Team, reparto, progetto o canale interno" },
  { value: "coppia", label: "Duo operativo (co-founder, coppia manager–referente)" },
  { value: "conoscenza", label: "Contesto professionale in fase di avvio / scouting" },
  { value: "amicizia", label: "Rete professionale informale o community di settore" },
  { value: "famiglia", label: "Impresa familiare o società strettamente legata" }
];

export type PeriodOption = (typeof PERIOD_OPTIONS)[number];

export const ENTERPRISE_PERIOD_OPTIONS: PeriodOption[] = [
  {
    value: "2months",
    label: "Finestra 60 giorni",
    sublabel:
      "Sprint, commessa o crisi recente — focus su ritmo, escalation e chiusure",
    price: "29,99€",
    priceAmount: 2999,
    badge: "Operativo"
  },
  {
    value: "6months",
    label: "Semestre di attività",
    sublabel:
      "Standard per people manager e sales — trend, handoff, carico asincrono",
    price: "59,99€",
    priceAmount: 5999,
    badge: "Consigliato team"
  },
  {
    value: "full",
    label: "Intera cronologia disponibile",
    sublabel:
      "Due diligence leggera su dinamiche comunicative, onboarding lunghi, account storici",
    price: "119,99€",
    priceAmount: 11999,
    badge: "Visione completa"
  }
];

export function periodOptionsForSegment(segment: AudienceSegment): PeriodOption[] {
  return segment === "enterprise" ? ENTERPRISE_PERIOD_OPTIONS : PERIOD_OPTIONS;
}

export const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: "coppia", label: "Coppia" },
  { value: "conoscenza", label: "Ci stiamo conoscendo" },
  { value: "amicizia", label: "Amicizia o gruppo di amici" },
  { value: "famiglia", label: "Famiglia" },
  { value: "gruppo", label: "Gruppo (misto)" },
  { value: "lavoro", label: "Lavoro o professione" }
];

export const HOW_LONG_OPTIONS = [
  { value: "under_6m", label: "Meno di 6 mesi" },
  { value: "6_12m", label: "6–12 mesi" },
  { value: "1_3y", label: "1–3 anni" },
  { value: "over_3y", label: "Più di 3 anni" },
  { value: "unsure", label: "Difficile quantificare" }
] as const;

export const AGE_BAND_OPTIONS = [
  { value: "both_under_25", label: "Entrambi under 25" },
  { value: "25_34", label: "Prevalentemente 25–34" },
  { value: "35_44", label: "Prevalentemente 35–44" },
  { value: "45_plus", label: "45 o più" },
  { value: "mixed", label: "Fasce molto diverse" },
  { value: "prefer_not", label: "Preferisco non indicare" }
] as const;
