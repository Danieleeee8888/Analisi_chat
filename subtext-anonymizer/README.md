# Subtext Anonymizer

Applicazione desktop standalone (Electron + Node.js) per anonimizzare chat WhatsApp esportate in formato `.zip`, interamente offline.

## Requisiti

- Node.js 18+ (consigliato 20+)

## Avvio

```bash
npm install
npm start
```

## Cosa fa

- Accetta drag & drop di un file `.zip` WhatsApp
- Estrae solo il `.txt` della chat
- Applica anonimizzazione in 5 step:
  - telefoni
  - indirizzi
  - iniziali puntate (`M.`, `G.R.`, `A.B.C.`)
  - nomi partecipanti (`Persona 1`, `Persona 2`, ...)
  - telefoni nei messaggi di sistema WhatsApp
- Salva in `Downloads`:
  - `[nome_originale]_anonimizzato.txt`
  - `[nome_originale]_log.txt`

## Note

- Se il file supera 50MB, viene chiesta conferma prima del processing.
- Se il `.txt` non sembra una chat WhatsApp, viene mostrato un avviso con opzione per procedere.
- Se non ci sono permessi su `Downloads`, l'app propone un percorso alternativo (Desktop).
- Il modulo `anonymizer.js` e riutilizzabile in futuro in un backend Node.js.
