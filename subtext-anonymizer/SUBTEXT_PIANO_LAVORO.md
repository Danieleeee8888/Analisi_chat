# SUBTEXT — PIANO DI LAVORO

*Ultimo aggiornamento: 27 marzo 2026*

---

## FASE 0 — FONDAMENTA (strumenti locali)

- [x] Project Bible scritto (v1.0)
- [x] Prompt di analisi scritto (v1.0 → v2.0)
- [x] Anonymizer Electron funzionante (drag & drop .zip)
- [x] Parser WhatsApp (Android + iOS)
- [x] Anonimizzazione nomi (PersonaA, PersonaB, ...)
- [x] Mascheramento cifre nel corpo messaggi
- [x] Generazione metriche JSON (relational-metrics.js)
- [x] Dizionari lessicali italiani (lexicons.js)
- [x] Selezione periodo nella GUI dell'anonymizer
- [ ] Test anonymizer su chat iOS (verificare che il parser funzioni)
- [ ] Test anonymizer su chat di gruppo (3+ partecipanti)

---

## FASE 1 — VALIDAZIONE PROMPT (gratis, su Claude Pro)

- [x] Prompt definitivo v2.0 scritto
- [x] Project Claude creato con prompt nelle istruzioni
- [x] Prima analisi completata (coppia consolidata, propria chat)
- [ ] Analisi #2 — coppia diversa (chiedere a un amico)
- [ ] Analisi #3 — amicizia
- [ ] Analisi #4 — gruppo (famiglia o amici)
- [ ] Analisi #5 — coppia breve o fase iniziale
- [ ] Revisione prompt basata sui 5 report (cosa funziona, cosa no)
- [ ] Prompt v2.1 aggiornato
- [ ] Test comparativo Opus vs Sonnet sullo stesso caso
- [ ] Decisione modello per produzione (probabilmente Sonnet)
- [ ] Prompt v3.0 stabile — pronto per produzione

**Cosa cercare nei test:**
- Il report è specifico o potrebbe applicarsi a chiunque?
- Il tono è coerente tra analisi diverse?
- Le aree di crescita sono azionabili?
- Gli alert scattano solo quando devono?
- Su chat non di coppia, il prompt si adatta o forza il framework coppia?
- Opus vs Sonnet: cosa si perde in qualità?

---

## FASE 2 — PROTOTIPO WEBAPP (MVP)

### 2A — Setup tecnico
- [ ] Scegliere stack (consigliato: Next.js + Vercel o simile)
- [ ] Creare repository webapp
- [ ] Setup progetto base con Cursor
- [ ] Dominio acquistato (verificare: subtext.it / subtextapp.it / usesubtext.it)
- [ ] SSL configurato

### 2B — Flusso utente base
- [ ] Pagina di upload .zip
- [ ] Form contestuale (6 domande del Project Bible)
- [ ] Elaborazione lato server: estrazione .txt dallo .zip
- [ ] Anonimizzazione server-side (trapianto di anonymizer.js)
- [ ] Calcolo metriche server-side (trapianto di relational-metrics.js)
- [ ] Soglia minima 200 messaggi — messaggio chiaro se sotto

### 2C — Pre-analisi gratuita
- [ ] Pagina risultati pre-analisi (dati reali, zero costi API)
- [ ] Mostra: totale messaggi, distribuzione, chi inizia, ora di punta, equilibrio
- [ ] Messaggio di conversione verso il report completo
- [ ] Il file della chat viene tenuto in memoria solo per questa sessione

### 2D — Integrazione Claude API
- [ ] Account API Anthropic attivato
- [ ] Chiave API configurata nel backend
- [ ] Chiamata API con: system prompt + form + metriche JSON + chat anonimizzata
- [ ] Gestione risposta e parsing del report Markdown
- [ ] Gestione errori API (timeout, rate limit, risposta incompleta)
- [ ] Prompt caching attivato (se il system prompt è lungo e fisso)

### 2E — Generazione PDF
- [ ] Conversione Markdown → PDF con stile Subtext
- [ ] Template PDF professionale (header, font, colori brand)
- [ ] Download PDF funzionante
- [ ] La chat viene cancellata dopo generazione del report

### 2F — Pagamenti
- [ ] Account Stripe creato
- [ ] Integrazione Stripe per pagamento singolo 4,99€
- [ ] Paywall tra pre-analisi e report completo
- [ ] Gestione transazione: pagamento → chiamata API → PDF → download
- [ ] Ricevuta/fattura automatica

---

## FASE 3 — LANCIO MVP

### 3A — Pagine del sito
- [ ] Homepage — cosa è, come funziona, quanto costa
- [ ] Pagina "Come funziona" — 3 passi con illustrazioni
- [ ] Pagina "Privacy e sicurezza" — in italiano semplice
- [ ] FAQ — risponde alle obiezioni prima che l'utente le formuli
- [ ] Disclaimer pre-report (testo dal Project Bible)
- [ ] Badge "Chat eliminata dopo l'analisi" visibile ovunque
- [ ] GDPR compliance — informativa sintetica

### 3B — Test pre-lancio
- [ ] Test end-to-end completo: upload → form → pre-analisi → pagamento → report → PDF
- [ ] Test con 3-5 utenti reali (amici)
- [ ] Raccolta feedback sulla qualità del report
- [ ] Raccolta feedback sull'esperienza utente
- [ ] Fix bug critici
- [ ] Ultima revisione prompt basata su feedback reali

### 3C — Go live
- [ ] Lancio SUBTEXT PERSONAL — mercato italiano
- [ ] Monitoraggio primi report in produzione
- [ ] Controllo qualità sui primi 20 report generati
- [ ] Aggiustamenti prompt se necessario

---

## FASE 4 — CRESCITA E OTTIMIZZAZIONE

### 4A — Riduzione costi
- [ ] Valutare Batch API per report non urgenti (50% sconto)
- [ ] Ottimizzare lunghezza input: passare estratti selezionati invece di tutta la chat
- [ ] Monitorare costo medio per report e margine reale

### 4B — Guide contestuali (reddito passivo)
- [ ] Guida 1: Come comunicare quello che non va senza generare conflitto
- [ ] Guida 2: Come gestire le conversazioni difficili
- [ ] Guida 3: Comunicazione asimmetrica — come riequilibrarla
- [ ] Guida 4: Esprimere i propri bisogni
- [ ] Guida 5: Riconoscere i pattern di controllo
- [ ] Sistema di suggerimento contestuale post-report (basato sui problemi rilevati)
- [ ] Integrazione pagamento guide (1,99€ cadauna)

### 4C — Profilo Pro trasversale
- [ ] Sistema account utente (email + password)
- [ ] Upload multi-chat
- [ ] Database metriche aggregate (solo numeri, zero testo)
- [ ] Analisi trasversale: come comunica la stessa persona in relazioni diverse
- [ ] Pagamento Pro 9,99€
- [ ] Cancellazione account e dati su richiesta

### 4D — Diffusione
- [ ] Strategia di lancio (passaparola? social? PR?)
- [ ] Contenuti social basati su insight anonimi dai report
- [ ] SEO per query tipo "analisi chat whatsapp" / "capire relazione dai messaggi"
- [ ] Eventuale versione inglese (mercato molto più grande)

---

## FASE 5 — SUBTEXT WORK (futuro)

- [ ] Adattamento prompt per contesto professionale
- [ ] Pricing B2B (9,99€ singolo / 29,99€ team 5 / 59,99€ team 15)
- [ ] Guide per manager (4,99€)
- [ ] Landing page dedicata

---

## DECISIONI APERTE

| Domanda | Stato |
|---------|-------|
| Modello API: Sonnet o Opus? | Da decidere dopo test comparativo |
| One-shot o two-pass (JSON → rendering)? | One-shot per MVP, rivalutare dopo |
| Hosting: Vercel, Railway, altro? | Da decidere |
| Dominio finale? | Da verificare disponibilità |
| Chat massima accettata (in messaggi)? | Da definire soglia superiore |

---

## STATO ATTUALE

**Dove siamo:** Fase 1 — Validazione prompt. Primo report generato, servono altri 4-5 test su relazioni diverse prima di toccare il prompt.

**Prossimo passo:** Raccogliere chat da amici (coppia, amici, gruppo) e generare i report di test.
