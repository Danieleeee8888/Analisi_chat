export type RelationshipType =
  | "coppia"
  | "conoscenza"
  | "amicizia"
  | "famiglia"
  | "gruppo"
  | "lavoro";

/** Dati contestuali inviati con il file (Step 3+ API). */
export interface ContextFormData {
  relationshipType: RelationshipType;
  whoAreYou: string;
  howLongKnown: string;
  liveOrWorkTogether: "si" | "no";
  ageBand: string;
  specificQuestion: string;
}

export const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: "coppia", label: "Coppia" },
  { value: "conoscenza", label: "Ci stiamo conoscendo" },
  { value: "amicizia", label: "Amicizia" },
  { value: "famiglia", label: "Famiglia" },
  { value: "gruppo", label: "Gruppo" },
  { value: "lavoro", label: "Lavoro" }
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
