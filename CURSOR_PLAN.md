# CURSOR_PLAN.md — Piano di sviluppo Subtext Webapp

> Questo file è la guida completa per costruire la webapp di Subtext.
> Ogni step è progettato per essere testabile immediatamente.
> I moduli `chat-parser.js`, `relational-metrics.js` e `lexicons.js` esistono già nella cartella `subtext-anonymizer/` e vanno riutilizzati lato server.

---

## ARCHITETTURA

```
subtext-webapp/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Layout globale (font, meta, analytics)
│   ├── page.tsx                # Homepage
│   ├── upload/
│   │   └── page.tsx            # Upload .zip + form contestuale
│   ├── preview/
│   │   └── page.tsx            # Pre-analisi gratuita (metriche)
│   ├── report/
│   │   └── page.tsx            # Report completo (post-pagamento)
│   ├── privacy/
│   │   └── page.tsx            # Pagina privacy
│   ├── faq/
│   │   └── page.tsx            # FAQ
│   └── api/
│       ├── process-chat/
│       │   └── route.ts        # Upload → anonimizza → metriche → risposta
│       ├── generate-report/
│       │   └── route.ts        # Chiama Claude API → restituisce report
│       ├── generate-pdf/
│       │   └── route.ts        # Markdown → PDF
│       ├── create-checkout/
│       │   └── route.ts        # Crea sessione Stripe Checkout
│       └── webhook-stripe/
│           └── route.ts        # Riceve conferma pagamento da Stripe
├── lib/
│   ├── chat-parser.ts          # Portato da subtext-anonymizer/chat-parser.js
│   ├── anonymizer.ts           # Logica di anonimizzazione (da anonymizer.js, senza Electron/fs)
│   ├── relational-metrics.ts   # Portato da subtext-anonymizer/relational-metrics.js
│   ├── lexicons.ts             # Portato da subtext-anonymizer/lexicons.js
│   ├── claude.ts               # Client Claude API
│   ├── stripe.ts               # Client Stripe
│   ├── pdf.ts                  # Generatore PDF
│   └── prompt.ts               # System prompt Subtext (testo fisso)
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── UploadZone.tsx          # Drag & drop .zip
│   ├── ContextForm.tsx         # Form 6 domande
│   ├── PreviewMetrics.tsx      # Visualizzazione pre-analisi
│   ├── ReportView.tsx          # Visualizzazione report Markdown
│   └── PaymentButton.tsx       # Bottone Stripe
├── public/
│   └── ...                     # Asset statici, logo, favicon
├── styles/
│   └── globals.css             # Stili globali (Tailwind)
├── .env.local                  # Chiavi API (non versionare)
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

Stack:
- **Next.js 14+** (App Router, TypeScript)
- **Tailwind CSS** per gli stili
- **Stripe** per i pagamenti
- **Anthropic SDK** per Claude API
- **adm-zip** per leggere i file .zip
- **Puppeteer** o **@react-pdf/renderer** per generare PDF

---

## STEP 0 — SETUP PROGETTO

### 0.1 — Inizializzazione

Crea un nuovo progetto Next.js nella root della repository (accanto alla cartella `subtext-anonymizer/`).

```bash
npx create-next-app@latest subtext-webapp --typescript --tailwind --app --src-dir=false
cd subtext-webapp
```

Struttura attesa dopo lo step:
```
repo/
├── subtext-anonymizer/    # ← il tool desktop, non toccare
├── subtext-webapp/        # ← la webapp nuova
├── Subtext_ProjectBible_v1.docx
└── Subtext_Prompt_v1-1.docx
```

### 0.2 — Dipendenze iniziali

```bash
cd subtext-webapp
npm install adm-zip
npm install -D @types/adm-zip
```

### 0.3 — Env file

Crea `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REPORT_PRICE_EUR=499
```

Aggiungi `.env.local` al `.gitignore`.

**TEST:** `npm run dev` → vedi la pagina Next.js di default su localhost:3000.

---

## STEP 1 — TRAPIANTO MODULI CORE

Porta i moduli da `subtext-anonymizer/` dentro `subtext-webapp/lib/`, convertendoli in moduli compatibili con Node.js server-side (no Electron, no `fs` per l'I/O — ricevono e restituiscono stringhe/oggetti).

### 1.1 — lexicons.ts

Copia `subtext-anonymizer/lexicons.js` → `subtext-webapp/lib/lexicons.ts`.
Cambia solo: `module.exports = { ... }` → `export const lexicons = { ... }`.
Nessun'altra modifica.

### 1.2 — chat-parser.ts

Copia `subtext-anonymizer/chat-parser.js` → `subtext-webapp/lib/chat-parser.ts`.
Converti in TypeScript:
- Aggiungi interfaccia `ParsedMessage { ts: number; date: Date; sender: string; body: string; lineIndex: number }`
- `module.exports` → `export function parseWhatsAppChat(text: string): ParsedMessage[]`
- Logica invariata.

### 1.3 — anonymizer.ts

NON copiare `anonymizer.js` intero — quello dipende da `fs`, `path`, `os`, `AdmZip` e scrive su disco.

Crea `lib/anonymizer.ts` con sole due funzioni pure:
- `buildParticipantMap(text: string): Map<string, string>` — prende il testo raw, restituisce la mappa nomi → alias
- `anonymizeText(text: string, participantMap: Map<string, string>): { anonymizedText: string; counts: { partecipanti: number; cifre: number } }` — prende il testo e la mappa, restituisce il testo anonimizzato

La logica è identica a quella in `anonymizer.js` (step 4 nomi + step 6 cifre). Non scrive nulla su disco. Non legge .zip — quello lo fa la route API.

### 1.4 — relational-metrics.ts

Copia `subtext-anonymizer/relational-metrics.js` → `subtext-webapp/lib/relational-metrics.ts`.
Converti in TypeScript:
- Import `parseWhatsAppChat` dal nuovo `chat-parser.ts`
- Import `lexicons` dal nuovo `lexicons.ts`
- `module.exports` → `export function buildRelationalMetricsReport(...)` ecc.
- Logica invariata.

### 1.5 — Test moduli

Crea un file di test temporaneo `lib/__test_modules.ts` (o usa un file di test qualsiasi) che:
1. Legge un file `.txt` di chat di esempio (metti un campione piccolo in una cartella `test-data/`)
2. Lo passa a `buildParticipantMap` → `anonymizeText` → `buildRelationalMetricsReport`
3. Stampa il JSON risultante

```bash
npx tsx lib/__test_modules.ts
```

**TEST:** Deve produrre un JSON di metriche identico (o quasi) a quello che produce l'anonymizer desktop.

---

## STEP 2 — HOMEPAGE

### 2.1 — Layout globale

`app/layout.tsx`:
- Font: Inter o simile (pulito, moderno)
- Meta: title "Subtext — Quello che le tue chat dicono davvero", description
- Lingua: `<html lang="it">`
- Stile: sfondo chiaro, toni neutri, professionale — non giocoso

`components/Header.tsx`:
- Logo/nome "Subtext" a sinistra
- Link: Come funziona, Privacy, FAQ
- Badge piccolo: "La tua chat viene eliminata dopo l'analisi"

`components/Footer.tsx`:
- © Subtext 2026
- Link privacy, contatti

### 2.2 — Homepage

`app/page.tsx`:
- H1: "Quello che le tue chat dicono davvero"
- Sottotitolo: 1-2 righe che spiegano cosa fa (analisi comunicazione WhatsApp)
- 3 step visivi: Carica → Scopri → Migliora
- CTA grande: "Carica la tua chat" → link a /upload
- Prezzo visibile: "Report completo: 4,99€ — Pre-analisi gratuita"
- Badge privacy: "La tua chat viene eliminata immediatamente dopo l'analisi"

**TEST:** `npm run dev` → homepage visibile, navigabile, link funzionanti (le pagine destinazione possono essere placeholder).

---

## STEP 3 — UPLOAD E FORM

### 3.1 — Pagina upload

`app/upload/page.tsx` — pagina unica con due sezioni in sequenza:

**Sezione 1: Upload**
- `components/UploadZone.tsx`: area drag & drop per file .zip
- Accetta solo .zip
- Mostra nome file e dimensione dopo il caricamento
- Limite: 50MB (mostra errore se superato)
- Non invia ancora nulla al server — tiene il file in memoria nel browser

**Sezione 2: Form contestuale** (appare dopo l'upload)
- `components/ContextForm.tsx`
- Le 6 domande del Project Bible:
  1. Tipo di relazione: Coppia / Ci stiamo conoscendo / Amicizia / Famiglia / Gruppo / Lavoro
  2. Chi sei tu in questa chat? (campo testo)
  3. Da quanto vi sentite o conoscete? (selezione)
  4. Vivete o lavorate insieme? (sì/no)
  5. Età tua e dell'altra persona (fascia)
  6. C'è qualcosa di specifico che vuoi capire? (campo libero, opzionale)
- Bottone "Analizza" che invia .zip + form al backend

**TEST:** Upload funziona, form si compila, bottone "Analizza" è cliccabile (il backend non esiste ancora — mostra un messaggio placeholder).

---

## STEP 4 — API ELABORAZIONE CHAT

### 4.1 — Route process-chat

`app/api/process-chat/route.ts`

Questa è la route più importante. Riceve il file .zip e i dati del form. Fa tutto il lavoro locale senza AI.

Flusso:
1. Riceve il .zip come FormData + i dati del form come JSON
2. Legge lo .zip in memoria con `adm-zip` — estrae il .txt (stessa logica di `selectTxtEntry` in anonymizer.js)
3. Verifica che sia una chat WhatsApp (stessa logica di `hasWhatsappHeaders`)
4. Se i messaggi sono meno di 200, restituisce errore con messaggio chiaro
5. Chiama `buildParticipantMap(rawText)` → `anonymizeText(rawText, map)`
6. Chiama `buildRelationalMetricsReport(anonymizedText)`
7. Restituisce JSON:

```json
{
  "ok": true,
  "anonymizedChat": "...(testo anonimizzato)...",
  "metrics": { ... },
  "formData": { ... },
  "participantMap": ["PersonaA", "PersonaB"]
}
```

Il testo anonimizzato e le metriche vengono conservati SOLO nella sessione del browser (state React o sessionStorage). Non vengono salvati lato server.

### 4.2 — Collegare upload → API → preview

Dopo che l'utente clicca "Analizza":
1. Mostra spinner/loading
2. Invia .zip + form a `/api/process-chat`
3. Se ok, salva risposta nello state
4. Redirect a `/preview` passando i dati (state o URL params + sessionStorage)

**TEST:** Carica un .zip reale → ricevi indietro metriche JSON e testo anonimizzato → vedi nella console del browser.

---

## STEP 5 — PAGINA PRE-ANALISI GRATUITA

### 5.1 — Preview page

`app/preview/page.tsx` + `components/PreviewMetrics.tsx`

Mostra i dati reali della chat dell'utente — zero costi API. Questo è il gancio di conversione.

Cosa mostrare:
- Periodo: dal [data] al [data]
- Messaggi totali: X
- Distribuzione: PersonaA X% / PersonaB Y% (usa i nomi dal form, non i codici)
- Chi inizia le conversazioni: percentuale
- Giorni attivi su giorni totali: X/Y
- Ora di punta delle comunicazioni (fascia oraria con più messaggi)
- Indicatore di equilibrio comunicativo (testuale, non numerico)

Sotto i dati, il messaggio di conversione:

> "Abbiamo analizzato la struttura della tua chat. Questi sono i tuoi dati reali.
> Per scoprire cosa significano davvero — pattern comunicativi, dinamiche relazionali, aree di crescita e molto altro — il report completo è a 4,99€."

Bottone: "Ottieni il report completo — 4,99€"

**TEST:** Dopo upload ed elaborazione, la pagina preview mostra i dati reali. Il bottone di pagamento è visibile ma non funziona ancora.

---

## STEP 6 — STRIPE (PAGAMENTO)

### 6.1 — Setup Stripe

```bash
npm install stripe @stripe/stripe-js
```

Crea un prodotto "Report Subtext" su dashboard Stripe (o via API).

### 6.2 — Route create-checkout

`app/api/create-checkout/route.ts`

Crea una sessione Stripe Checkout:
- Prezzo: 4,99€
- Modalità: payment (una tantum)
- Success URL: `/report?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `/preview`

Prima di creare la sessione, genera un ID temporaneo univoco (es. UUID) e salva in una store temporanea server-side (anche solo una `Map` in memoria per l'MVP — in produzione sarà Redis o DB) l'associazione:

```
sessionId → { anonymizedChat, metrics, formData }
```

Questo serve perché dopo il pagamento devi ancora avere i dati per chiamare Claude.

### 6.3 — Route webhook-stripe

`app/api/webhook-stripe/route.ts`

Riceve l'evento `checkout.session.completed` da Stripe.
Verifica la firma del webhook.
Segna la sessione come "pagata".

### 6.4 — Bottone pagamento

`components/PaymentButton.tsx`

Quando l'utente clicca:
1. Chiama `/api/create-checkout` con l'ID sessione
2. Redirect a Stripe Checkout
3. Dopo il pagamento, Stripe redirige a `/report?session_id=...`

**TEST:** Usa Stripe in modalità test. Carica chat → preview → clicca "Paga" → si apre Stripe Checkout → usa carta di test 4242... → viene rediretto a /report (pagina placeholder per ora).

---

## STEP 7 — INTEGRAZIONE CLAUDE API

### 7.1 — Setup Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

### 7.2 — Prompt fisso

`lib/prompt.ts`

Contiene il system prompt Subtext v2.0 come stringa template. Il file è il contenuto di `subtext_prompt_definitivo_v2.md` convertito in stringa TypeScript.

### 7.3 — Client Claude

`lib/claude.ts`

Funzione `generateReport(anonymizedChat: string, metrics: object, formData: object): Promise<string>`

Flusso:
1. Compone il system message dal prompt fisso
2. Compone lo user message:
   ```
   Analizza questa chat usando le metriche allegate.

   DATI DEL FORM:
   - Tipo di relazione: {{tipo}}
   - Chi sei tu: {{nome}}
   - Durata: {{durata}}
   - Convivenza: {{convivenza}}
   - Età: {{eta}}
   - Obiettivo: {{obiettivo}}

   METRICHE:
   {{JSON metriche — senza segment_summaries per risparmiare token}}

   CHAT:
   {{testo anonimizzato}}
   ```
3. Chiama Claude API:
   - Modello: `claude-sonnet-4-20250514` (o quello scelto dopo i test)
   - Max tokens: 2000
   - Temperature: 0.3
4. Restituisce il testo Markdown del report

**Importante — ottimizzazione token:**
- Dal JSON delle metriche, RIMUOVI `segment_summaries` prima di inviare — è enorme e Claude non ne ha bisogno per scrivere il report. Manda solo: `chat_metadata`, `participant_metrics`, `response_dynamics`, `questions`, `turn_taking`, `daypart_usage`, `lexical_signals_global`, `synthetic_indices`, e `temporal_series.messages_per_month`.
- Se la chat supera ~80.000 token (stimabile: lunghezza in caratteri / 4), valuta di tagliare o campionare. Per l'MVP, imponi un limite massimo di messaggi accettati (es. 15.000 messaggi).

### 7.4 — Route generate-report

`app/api/generate-report/route.ts`

1. Riceve il session ID
2. Verifica che il pagamento sia avvenuto (controlla lo stato nella store)
3. Recupera i dati (chat, metriche, form)
4. Chiama `generateReport()`
5. Restituisce il Markdown del report
6. **Cancella i dati della sessione** (chat e metriche) — il report Markdown resta solo nella risposta

**TEST:** Dopo il pagamento Stripe test, la route viene chiamata, Claude genera il report, e il Markdown viene restituito al browser. Visualizzalo in console o in una pagina grezza.

---

## STEP 8 — PAGINA REPORT

### 8.1 — Visualizzazione report

`app/report/page.tsx` + `components/ReportView.tsx`

1. Al caricamento, controlla `session_id` nei parametri URL
2. Chiama `/api/generate-report` con il session ID
3. Mostra spinner durante la generazione (può richiedere 15-30 secondi)
4. Renderizza il Markdown come HTML (usa `react-markdown` o simile)
5. Stile: sfondo bianco, font serif per il corpo, sans-serif per i titoli, margini generosi — deve sembrare un documento professionale

```bash
npm install react-markdown
```

### 8.2 — Download PDF

Bottone "Scarica PDF" sotto il report.

`lib/pdf.ts` — genera un PDF dal Markdown del report.

Opzioni:
- **Opzione A (consigliata per MVP):** usa Puppeteer per renderizzare l'HTML del report in PDF. Semplice, risultato fedele a ciò che l'utente vede a schermo.
- **Opzione B:** usa una libreria tipo `jspdf` + `html2canvas` lato client.
- **Opzione C:** usa `@react-pdf/renderer` per layout custom.

Per MVP usa Opzione A:
```bash
npm install puppeteer
```

`app/api/generate-pdf/route.ts`:
1. Riceve il Markdown del report
2. Lo renderizza in HTML con template e stili Subtext
3. Usa Puppeteer per convertire in PDF
4. Restituisce il PDF come file scaricabile

Header del PDF: "SUBTEXT" + data di generazione.
Footer: "Questo report è stato generato da Subtext. La chat è stata eliminata dopo l'elaborazione."

**TEST:** Report visibile a schermo → clicca "Scarica PDF" → si scarica un PDF leggibile e ben formattato.

---

## STEP 9 — PAGINE STATICHE

### 9.1 — Privacy

`app/privacy/page.tsx`

Contenuto (in italiano semplice, non legalese):
- Cosa facciamo con la tua chat: la elaboriamo in memoria e la cancelliamo
- Cosa conserviamo: nulla — nessun testo, nessun nome, nessun contenuto
- L'unico dato che resta è la transazione Stripe
- Cookie: solo quelli tecnici necessari
- GDPR: diritto di accesso, cancellazione, portabilità
- Contatti per richieste privacy

### 9.2 — FAQ

`app/faq/page.tsx`

Domande da coprire:
- Come funziona esattamente?
- I miei messaggi vengono letti da qualcuno?
- Come vengono protetti i miei dati?
- Posso analizzare una chat di gruppo?
- Di quanto periodo ho bisogno per un'analisi significativa?
- Subtext può dirmi se la mia relazione è sana?
- Posso avere un rimborso?
- Come esporto la chat da WhatsApp?

### 9.3 — Come funziona (opzionale, può essere nella homepage)

3 step illustrati:
1. Esporta la tua chat da WhatsApp (con istruzioni)
2. Carica il file e rispondi a 6 domande veloci
3. Ricevi il tuo report personalizzato

**TEST:** Tutte le pagine navigabili, leggibili, link funzionanti.

---

## STEP 10 — RIFINITURA E DEPLOY

### 10.1 — Flusso completo end-to-end

Testa il percorso intero:
1. Homepage → clicca "Carica la tua chat"
2. Upload .zip → compila form → clicca "Analizza"
3. Pre-analisi gratuita → vedi i tuoi dati
4. Clicca "Ottieni il report — 4,99€"
5. Stripe Checkout → paga con carta test
6. Redirect → report generato → visualizzato
7. Scarica PDF

Verifica:
- [ ] La chat viene cancellata dopo la generazione del report
- [ ] Il PDF è leggibile e ben formattato
- [ ] Se l'utente ricarica la pagina report, il report non è più disponibile (sessione scaduta)
- [ ] Se l'utente carica un file non-WhatsApp, errore chiaro
- [ ] Se la chat ha meno di 200 messaggi, errore chiaro
- [ ] Se il pagamento fallisce, l'utente può riprovare

### 10.2 — Gestione errori

- Upload fallito → messaggio chiaro
- File non .zip → messaggio chiaro
- Chat troppo corta → "Servono almeno 200 messaggi per un'analisi affidabile"
- Chat troppo lunga → limite massimo con messaggio
- Pagamento fallito → "Il pagamento non è andato a buon fine. Riprova."
- Claude API timeout → "L'analisi sta richiedendo più tempo del previsto. Riprova tra qualche minuto."
- Claude API errore → "Si è verificato un problema. Non ti è stato addebitato nulla."

### 10.3 — Deploy

Opzione consigliata: **Vercel**

```bash
npm install -g vercel
vercel
```

Configura le variabili d'ambiente su Vercel dashboard.

**Attenzione Puppeteer:** Puppeteer su Vercel serverless è complicato (binario Chromium). Alternative per produzione:
- Usare `@sparticuz/chromium` per Lambda/Vercel
- Oppure spostare la generazione PDF su un servizio esterno (es. API dedicata su Railway/Fly.io)
- Oppure usare una soluzione più leggera come `md-to-pdf` o generazione PDF lato client

Questo va risolto durante lo step 8 — se Puppeteer è troppo pesante, cambia approccio prima del deploy.

### 10.4 — Stripe in produzione

- Passa da chiavi test a chiavi live
- Configura il webhook con l'URL di produzione
- Testa un pagamento reale con carta propria

**TEST:** Il sito è online, raggiungibile, e il flusso completo funziona con pagamento reale.

---

## RIEPILOGO DIPENDENZE

```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "adm-zip": "^0.5.16",
    "@anthropic-ai/sdk": "latest",
    "stripe": "latest",
    "@stripe/stripe-js": "latest",
    "react-markdown": "latest",
    "puppeteer": "latest",
    "uuid": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/adm-zip": "latest",
    "@types/uuid": "latest",
    "tailwindcss": "latest",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

---

## VARIABILI D'AMBIENTE NECESSARIE

| Variabile | Dove si ottiene | Quando serve |
|-----------|-----------------|--------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | Step 7 |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com | Step 6 |
| `STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com | Step 6 |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Webhooks | Step 6 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com | Step 6 |
| `NEXT_PUBLIC_BASE_URL` | il tuo dominio | Step 10 |

---

## LIMITI E SOGLIE

| Parametro | Valore | Nota |
|-----------|--------|------|
| Dimensione max .zip | 50 MB | Mostra errore se superato |
| Messaggi minimi | 200 | Sotto questa soglia niente analisi |
| Messaggi massimi (MVP) | 15.000 | Per contenere i costi API |
| Timeout Claude API | 60 secondi | La generazione può essere lenta |
| Prezzo report | 4,99€ | Configurabile via env |
| Durata sessione dati | 30 minuti | Poi i dati vengono cancellati |

---

## ORDINE DI ESECUZIONE

| # | Step | Testabile come |
|---|------|----------------|
| 0 | Setup progetto | `npm run dev` → pagina default |
| 1 | Trapianto moduli | Script di test → JSON metriche corretto |
| 2 | Homepage | Pagina visibile e navigabile |
| 3 | Upload + form | Si carica un .zip e si compila il form |
| 4 | API elaborazione | Upload → metriche in console browser |
| 5 | Pre-analisi | Dati reali della chat visibili a schermo |
| 6 | Stripe | Pagamento test → redirect funzionante |
| 7 | Claude API | Report Markdown generato e visibile |
| 8 | Pagina report + PDF | Report leggibile + PDF scaricabile |
| 9 | Pagine statiche | Privacy, FAQ navigabili |
| 10 | Deploy | Sito online, flusso end-to-end funzionante |

**Non saltare step. Ogni step dipende dal precedente.**

---

## REGISTRO AVANZAMENTO (man mano che lavoriamo)

| Data | Fatto | Note |
|------|--------|------|
| 2026-03-28 | **Upload personalizzato per focus** | 10 profili utente con testi, colori e defaults dedicati. Nuovo file `lib/upload-config.ts`. |
| 2026-03-28 | **Homepage riscritta** | Hero emotivo con conversazione animata, sezione Chi sei (4 card), PlansSection con tab Personal/Professional (3 piani + 2 servizi pro), sezione Piano Pro. |
| 2026-03-28 | **Pagina Metodo riscritta** | Contenuti accademici, 10 riferimenti bibliografici, tabella metriche, sezione applicazioni professionali, CTA finale. |
| 2026-03-27 | **Step 0 — avviato** | Creata app `subtext-webapp/` (Next.js 16, App Router, TS, Tailwind 4, ESLint). Aggiunta al workspace npm root; script root `npm run dev:web`. Installati `adm-zip` + `@types/adm-zip`. `.gitignore` webapp: ignorare `.env` / `.env*.local`, **committare** solo `.env.example` (segnaposti commentati, nessun segreto). Rimosso `subtext-webapp/package-lock.json` duplicato — un solo lockfile alla root del monorepo (warning Turbopack risolto). **Nessuna chiave API / Stripe collegata** fino a fase finale concordata. In `.env.example`, nota opzionale `NEXT_TELEMETRY_DISABLED=1` per chi vuole disattivare telemetria Next in dev/build. |
| 2026-03-27 | **Step 1 — trapianto moduli** | Aggiunti `lib/lexicons.ts`, `lib/chat-parser.ts` (`ParsedMessage`, `parseWhatsAppChat`, `messagesToWhatsAppAndroidExport`), `lib/anonymizer.ts` (`buildParticipantMap`, `anonymizeText`, `normalizeUnusualLineTerminators` per riuso API), `lib/relational-metrics.ts` (port completo da JS con tipi su mappe keyed-by-participant). **DevDependency** `tsx`. Campione sintetico `test-data/sample-chat.txt` (nessun dato reale). Script `npm run test:modules` → JSON map + metriche. Logica allineata al desktop; stessa regola cifre (righe che matched header WhatsApp restano intatte, inclusi numeri nel corpo sulla stessa riga). |
| 2026-03-27 | **Step 2 — homepage** | Font **Inter** (`--font-inter` → Tailwind `font-sans`), `lang="it"`, metadata titolo/descrizione Subtext. `components/Header.tsx` (brand, link Come funziona → `/#come-funziona`, Privacy, FAQ; badge privacy), `components/Footer.tsx` (© 2026, Privacy, Contatti). Homepage: H1, sottotitolo, 3 step, CTA `/upload`, prezzo 4,99€ + pre-analisi gratis, badge privacy. Placeholder: `app/privacy`, `app/faq`, `app/upload` (testo «step successivo»), `app/contatti`. Tema chiaro stone/neutral, senza dark mode forzato in `globals.css`. |
| 2026-03-27 | **Step 3 — upload e form** | `components/UploadZone.tsx`: drag&drop + input, solo `.zip`, max **50MB**, nome/dimensione, rimuovi file. `lib/context-form-types.ts`: tipi + opzioni liste. `components/ContextForm.tsx`: 6 campi (relazione, chi sei, da quanto, vivi/lavori insieme sì-no, fascia età, focus opzionale); obbligatori 2–3–5; bottone **Analizza**. `components/UploadFlow.tsx` (client): file solo in memoria, nessun upload rete; dopo Analizza banner placeholder (API Step 4) + `console.info` debug. `app/upload/page.tsx` usa `UploadFlow`. |
| 2026-03-27 | **Step 4 — API process-chat + preview bridge** | `lib/process-chat-constants.ts` (50MB, min **200** messaggi). `hasWhatsappHeaders` in `lib/anonymizer.ts`. `lib/whatsapp-zip.ts` (`selectTxtEntry`, `extractWhatsappTxtFromZipBuffer`). `app/api/process-chat/route.ts` **POST** `FormData`: `file`, `context` JSON; validazioni; pipeline anonimizza + `buildRelationalMetricsReport`; risposta `{ ok, anonymizedChat, metrics, formData, participantMap }` — **nessun salvataggio su disco**. `lib/preview-storage.ts` + chiave sessionStorage. `UploadFlow`: `fetch`, `isSubmitting`, errori rossi, redirect `/preview`. `ContextForm` prop `isSubmitting`. `UploadZone` prop `disabled`. `app/preview/page.tsx` + `components/PreviewClient.tsx`: lettura sessionStorage, riepilogo minimo (Step 5 arricchirà UI). |
| 2026-03-27 | **Step 5 — pre-analisi (preview)** | `components/PreviewMetrics.tsx`: periodo (date it-IT), messaggi totali, giorni attivi/timespan, fascia oraria più attiva (`daypart_usage`), distribuzione % per `participants_order` + callout nome da modulo (`whoAreYou`, senza mappare forzatamente ai codici anonimi), quota «chi riprende» (`conversation_start_share`), testo equilibrio da `participation_balance_index` / `initiative_balance_index`. Box conversione + bottone **4,99€** `disabled` (Stripe step 6). `PreviewClient` delega rendering a `PreviewMetrics`. |
| 2026-03-27 | **Step 6–9 scaffold (senza obbligo chiavi)** | **Stripe**: `stripe` npm, `lib/stripe-server.ts`, `lib/checkout-session-store.ts` (Map in RAM, TTL/prune), `POST /api/create-checkout` (503 `STRIPE_NOT_CONFIGURED` se manca chiave; metadata `subtext_internal_id`; `REPORT_PRICE_EUR` centesimi), `POST /api/webhook-stripe` (501 se manca `STRIPE_WEBHOOK_SECRET`; `checkout.session.completed` → `markCheckoutPaid`). **`PaymentButton`**: legge sessionStorage, POST checkout, redirect Stripe. **Claude**: `@anthropic-ai/sdk`, `lib/prompt.ts` (placeholder), `lib/metrics-for-llm.ts`, `lib/claude.ts` (`generateReport`). **`POST /api/generate-report`**: verifica sessione Stripe `paid` + bundle RAM; se **no `ANTHROPIC_API_KEY`** → markdown **demo**; altrimenti Claude; poi `deleteCheckoutBundle`. **`/report`**: `ReportFlow` + `ReportView` + `react-markdown`, `@tailwindcss/typography`. **PDF**: `lib/pdf.ts` stub, `POST /api/generate-pdf` 501; bottone in `ReportView` mostra messaggio. **Statiche**: `privacy`, `faq`, `contatti` testi Step 9. `.env.example` aggiornato. |
