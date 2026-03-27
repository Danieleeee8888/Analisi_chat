# Subtext Anonymizer

Applicazione desktop (Electron + Node.js) per elaborare in locale export WhatsApp in formato `.zip`: estrae la chat in `.txt` e produce una versione pseudonimizzata. Funziona offline.

## Requisiti

- Node.js 18+ (consigliato 20+)

## Avvio

```bash
npm install
npm start
```

Trascina un file `.zip` nell’area indicata nella finestra dell’app.

## Cosa fa davvero (implementazione attuale)

1. **Selezione del `.txt` nello zip**  
   Se ci sono più `.txt`, viene preferito un file il cui nome contiene `chat` (o simile), altrimenti il più grande.

2. **Rilevamento formato WhatsApp**  
   Verifica la presenza di intestazioni tipo Android (`gg/mm/aa, hh:mm - Nome:`) o iOS (`[gg/mm/aa, hh:mm:ss] Nome:`). Se non sembra una chat WhatsApp, chiede conferma per procedere comunque.

3. **Pseudonimizzazione dei partecipanti**  
   I mittenti ricavati dalle intestazioni vengono mappati in ordine di prima apparizione su etichette `PersonaA`, `PersonaB`, `PersonaC`, …  
   Nei campi mittente delle righe riconosciute come messaggio, il nome viene sostituito con l’alias. Il **testo del messaggio** (corpo) non viene analizzato per nomi di terzi, luoghi, ecc.

4. **Mascheramento delle cifre**  
   In tutte le righe che **non** sono intestazioni data/ora di messaggio, ogni cifra `0-9` è sostituita con `*`. Le date/ora nelle righe di messaggio restano leggibili per consentire analisi temporale.

## Cosa non fa (limiti attuali)

- Non rimuove o anonimizza **URL**, **indirizzi**, **numeri di telefono scritti a parole**, **nomi di persone citate nel corpo** (es. amici, familiari), **luoghi**, **contenuti dei link** (short link, mappe, social).
- Non è una garanzia di anonimato completo: va sempre rivisto l’output prima di condividerlo.

## File generati

Nella **stessa cartella del file `.zip`** (o nella cartella passata via API come `outputDir`):

| File | Contenuto |
|------|-----------|
| `[nome_zip]_anonimizzato.txt` | Chat da distribuire dopo controllo manuale. |
| `[nome_zip]_log.txt` | Mapping **nome reale → alias**, conteggi e avvertenza. **Non condividere**: consente di re-identificare i partecipanti. |
| `[nome_zip]_metrics.json` | **Metriche relazionali** calcolate sulla chat già pseudonimizzata (volumi, tempi di risposta, segmenti, segnali lessicali con dizionari, serie temporali mensili, indici di bilanciamento). Non sono diagnostiche; servono al report e alle fasi successive del progetto. |

Esempio: da `Chat WhatsApp con Raf.zip` → `…_anonimizzato.txt`, `…_log.txt` e `…_metrics.json`.

### Metriche (`_metrics.json`)

Il modulo `relational-metrics.js` legge il testo export (stesso formato WhatsApp) e produce JSON con:

- **Copertura**: `date_start`, `date_end`, `timespan_days`, `active_days`, `activity_ratio`, `total_messages`.
- **Volume e presenza**: conteggi e quote per partecipante (`PersonaA`, …), giorni attivi per partecipante.
- **Segmenti conversazione**: gap predefinito **180 minuti** (`segment_gap_minutes`); riaperture dopo pausa **12 ore** (`long_pause_hours`); aperture segmento, quote, “segmenti chiusi senza risposta” (coda dopo messaggio dell’altro).
- **Risposta**: mediana e p75 dei tempi di risposta in secondi, stessa giornata, conteggio risposte; **domanda → risposta** entro **12 ore** o entro lo stesso segmento.
- **Domande e lunghezze**: `?`, messaggi con più `?`, lunghezze medie/mediane, messaggi lunghi/brevi.
- **Serie temporali**: messaggi per giorno/settimana/mese, giorni attivi per mese, bilanciamento mensile, tassi di domanda e segnali affettivi per 100 messaggi (dove applicabile).
- **Turn-taking**: alternanza speaker, messaggi consecutivi medi, monologhi (run ≥ 4), segmenti “bilanciati” (default: almeno **2** messaggi ciascuno).
- **Fasce orarie** (mattina / pomeriggio / sera / notte): volume, aperture conversazione, quota messaggi notturni (00:00–05:59 locale).
- **Lessico (dizionari italiani in `lexicons.js`)**: affetto, riparazione, tensione, gioco, check-in, cura; `repair_after_tension_rate` (finestra 5 messaggi dopo marker tensione); finestre ad alta densità di tensione; scambi “giocosi” nello stesso segmento.
- **Indici sintetici** (per backend / trigger, non come verdetto clinico): bilanciamento iniziativa, partecipazione, responsività, affetto, riparazione.

Le opzioni numeriche predefinite sono in `DEFAULT_OPTIONS` dentro `relational-metrics.js` e sono copiate in `computation_options` nel JSON. Per rigenerare solo le metriche da un `.txt` già anonimizzato, in Node: `buildRelationalMetricsReport(fs.readFileSync("…_anonimizzato.txt","utf8"))`.

## Comportamenti e avvisi

- **File oltre 50 MB**: viene chiesta conferma prima di elaborare.
- **Pattern non WhatsApp**: avviso e possibilità di procedere comunque.
- **Permessi di scrittura**: se la cartella di destinazione non è scrivibile, l’app può proporre il **Desktop** come percorso alternativo (`DOWNLOADS_NO_PERMISSION` nel codice; il messaggio parla di cartella di destinazione generica).

## Modulo riutilizzabile

- `anonymizer.js`: `anonymizeWhatsappZip()`, `AnonymizerWarning`, `buildRelationalMetricsReport` (re-export).
- `relational-metrics.js`: `buildRelationalMetricsReport(testo, opzioni?)`, `parseWhatsAppChat`, `computeRelationalMetrics`.

## Licenza

MIT
