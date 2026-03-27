/**
 * Micro-dizionari italiani per segnali lessicali (densità, non diagnostica).
 * Estendibili o sostituibili da config futura.
 */

export const lexicons = {
  affection: {
    lemmas: [
      "amore",
      "amoo",
      "amo",
      "amor",
      "tesoro",
      "teso",
      "vita",
      "vitina",
      "cucciolo",
      "cucciola",
      "bellissima",
      "bellissimo",
      "bella",
      "bello",
      "cuore",
      "cuori",
      "ti amo",
      "tiamo",
      "mi manchi",
      "mimanchi",
      "mancia",
      "piccola",
      "piccolo"
    ],
    phrases: ["ti amo", "mi manchi", "ti voglio bene", "voglio bene", "amore mio", "amoo", "amo te"]
  },
  repair: {
    lemmas: [
      "scusa",
      "scusi",
      "scusami",
      "scusate",
      "mi dispiace",
      "dispiace",
      "perdonami",
      "perdona",
      "hai ragione",
      "avere ragione",
      "grazie",
      "tranquillo",
      "tranquilla",
      "tranqui",
      "va bene",
      "vabene",
      "ok",
      "okei",
      "non volevo",
      "ti capisco",
      "capisco",
      "capito",
      "ho sbagliato",
      "sbagliato"
    ],
    phrases: [
      "mi dispiace",
      "hai ragione",
      "va bene",
      "non volevo",
      "ti capisco",
      "perdonami",
      "scusa se",
      "scusa ma"
    ]
  },
  tension: {
    lemmas: [
      "sempre",
      "mai",
      "basta",
      "vabbè",
      "vabbo",
      "va be",
      "niente",
      "fai tu",
      "come vuoi",
      "decidi tu",
      "non capisci",
      "non capsici",
      "non è così",
      "non e cosi",
      "allora",
      "mah",
      "uff",
      "uffa",
      "boh"
    ],
    phrases: [
      "mi avevi detto",
      "m avevi detto",
      "non capisci",
      "non è così",
      "come vuoi",
      "fai tu",
      "lascia stare",
      "non ne posso",
      "stanca",
      "stanco",
      "sono stanca",
      "sono stanco"
    ]
  },
  playfulness: {
    lemmas: [
      "ahah",
      "ahahaha",
      "haha",
      "hahaha",
      "lol",
      "rofl",
      "eheh",
      "ehehe",
      "scemo",
      "scema",
      "idiota",
      "demente",
      "goku",
      "lolll"
    ],
    phrases: ["ah ah", "eh eh"]
  },
  checkin: {
    lemmas: [
      "dove sei",
      "quando vieni",
      "quando torni",
      "arrivato",
      "arrivata",
      "tutto bene",
      "tutto ok",
      "fammi sapere",
      "fammi sap",
      "aggiornami",
      "aggiorna",
      "scrivimi",
      "scrivi mi",
      "dimmi",
      "mi dici",
      "a che punto",
      "come va"
    ],
    phrases: [
      "dove sei",
      "quando vieni",
      "fammi sapere",
      "tutto bene",
      "sei arrivato",
      "sei arrivata",
      "a che punto sei"
    ]
  },
  care: {
    lemmas: [
      "stai bene",
      "stai meglio",
      "hai mangiato",
      "hai dormito",
      "riposati",
      "riposa",
      "prenditi cura",
      "copriti",
      "copri ti",
      "vai piano",
      "occhio",
      "attenzione",
      "curati",
      "bevi",
      "mangia",
      "non stressarti",
      "calma"
    ],
    phrases: [
      "come stai",
      "stai bene",
      "hai mangiato",
      "riposa un po",
      "vai piano",
      "fai attenzione"
    ]
  }
} as const;

export type LexiconCategory = keyof typeof lexicons;
