const dropzone = document.getElementById("dropzone");
const statusBox = document.getElementById("status");
const resultBox = document.getElementById("result");
const outputPathEl = document.getElementById("outputPath");
const openFolderBtn = document.getElementById("openFolderBtn");
const newRunBtn = document.getElementById("newRunBtn");
const periodPanel = document.getElementById("periodPanel");
const periodRangeSummary = document.getElementById("periodRangeSummary");
const runBtn = document.getElementById("runBtn");
const cancelPeriodBtn = document.getElementById("cancelPeriodBtn");

const PREVIEW_IDS = {
  all: "preview-all",
  last2months: "preview-last2months",
  last6months: "preview-last6months",
  last1year: "preview-last1year",
  last2years: "preview-last2years"
};

let latestOutputDir = null;
let pendingZipPath = null;
let confirmedLargeFile = false;
let confirmedNotWhatsapp = false;

function setVisualState(state, message) {
  dropzone.classList.remove("idle", "processing", "done", "error", "dragover", "blocked");
  statusBox.classList.remove("idle", "processing", "done", "error");
  dropzone.classList.add(state);
  statusBox.classList.add(state);
  statusBox.textContent = message;
}

function showResult(outputPath, outputDir, metricsPath) {
  const parts = [];
  if (outputPath) parts.push(outputPath);
  if (metricsPath) parts.push(metricsPath);
  outputPathEl.textContent = parts.join("\n");
  latestOutputDir = outputDir;
  resultBox.classList.remove("hidden");
}

function hideResult() {
  latestOutputDir = null;
  resultBox.classList.add("hidden");
}

function showPeriodPanel(analysis) {
  periodRangeSummary.textContent = `Intera chat nel file: dal ${analysis.date_start_label} al ${analysis.date_end_label} · ${analysis.message_count} messaggi`;
  const previews = analysis.previews || {};
  for (const [key, elId] of Object.entries(PREVIEW_IDS)) {
    const el = document.getElementById(elId);
    if (!el) continue;
    const p = previews[key];
    if (!p || p.message_count === 0) {
      el.textContent = "· 0 messaggi";
    } else {
      el.textContent = `· ${p.message_count} messaggi (dal ${p.date_start_label} al ${p.date_end_label})`;
    }
  }
  periodPanel.classList.remove("hidden");
  dropzone.classList.add("blocked");
  document.querySelector('input[name="period"][value="all"]').checked = true;
}

function hidePeriodPanel() {
  periodPanel.classList.add("hidden");
  dropzone.classList.remove("blocked");
}

function resetToIdle() {
  hidePeriodPanel();
  hideResult();
  confirmedLargeFile = false;
  confirmedNotWhatsapp = false;
  setVisualState("idle", "In attesa di un file .zip");
}

async function runAnalyze(zipPath) {
  pendingZipPath = zipPath;
  confirmedLargeFile = false;
  confirmedNotWhatsapp = false;

  while (true) {
    setVisualState("processing", "Lettura chat e calcolo date…");
    const response = await window.subtextAPI.analyzeZip({
      zipPath,
      confirmLargeFile: confirmedLargeFile,
      proceedWithoutWhatsappPattern: confirmedNotWhatsapp
    });

    if (response.ok) {
      setVisualState("idle", "Scegli il periodo e premi Elabora.");
      showPeriodPanel(response.result);
      return;
    }

    if (response.type === "warning") {
      if (response.code === "FILE_TOO_LARGE") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per continuare.`);
        if (!proceed) {
          resetToIdle();
          return;
        }
        confirmedLargeFile = true;
        continue;
      }

      if (response.code === "NOT_WHATSAPP_PATTERN") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per procedere comunque.`);
        if (!proceed) {
          resetToIdle();
          return;
        }
        confirmedNotWhatsapp = true;
        continue;
      }
    }

    setVisualState("error", response.message || "Errore durante l'analisi.");
    hidePeriodPanel();
    pendingZipPath = null;
    return;
  }
}

async function runProcess() {
  if (!pendingZipPath) return;

  const zipPath = pendingZipPath;
  const selected = document.querySelector('input[name="period"]:checked');
  const period = selected ? selected.value : "all";

  hidePeriodPanel();
  hideResult();

  let outputDir = undefined;

  while (true) {
    setVisualState("processing", "Anonimizzazione e metriche in corso…");
    const response = await window.subtextAPI.processZip({
      zipPath,
      period,
      confirmLargeFile: confirmedLargeFile,
      proceedWithoutWhatsappPattern: confirmedNotWhatsapp,
      outputDir
    });

    if (response.ok) {
      const outputPath = response.result.outputPath;
      const folder = response.result.outputDir;
      const metricsPath = response.result.metricsPath;
      setVisualState("done", "Fatto. File salvati accanto allo zip.");
      showResult(outputPath, folder, metricsPath);
      pendingZipPath = null;
      return;
    }

    if (response.type === "warning") {
      if (response.code === "FILE_TOO_LARGE") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per continuare.`);
        if (!proceed) {
          setVisualState("idle", "Operazione annullata.");
          return;
        }
        confirmedLargeFile = true;
        continue;
      }

      if (response.code === "NOT_WHATSAPP_PATTERN") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per procedere comunque.`);
        if (!proceed) {
          setVisualState("idle", "Operazione annullata.");
          return;
        }
        confirmedNotWhatsapp = true;
        continue;
      }

      if (response.code === "DOWNLOADS_NO_PERMISSION") {
        const suggested = response.meta?.suggestedPath;
        const useFallback = window.confirm(
          `${response.message}\n\nUsare percorso suggerito?\n${suggested || ""}`
        );
        if (!useFallback) {
          setVisualState("error", "Scrittura annullata: percorso non selezionato.");
          return;
        }
        outputDir = suggested;
        continue;
      }
    }

    setVisualState("error", response.message || "Errore durante l'elaborazione.");
    pendingZipPath = null;
    return;
  }
}

function getSingleZipFile(fileList) {
  if (!fileList || fileList.length === 0) return null;
  const first = fileList[0];
  if (!first || !first.name || !first.name.toLowerCase().endsWith(".zip")) {
    return null;
  }
  return first;
}

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (!dropzone.classList.contains("processing") && !dropzone.classList.contains("blocked")) {
    dropzone.classList.add("dragover");
  }
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");

  if (dropzone.classList.contains("blocked")) {
    return;
  }

  const file = getSingleZipFile(event.dataTransfer.files);
  if (!file) {
    hideResult();
    setVisualState("error", "File non valido. Trascina un file .zip WhatsApp.");
    return;
  }

  const zipPath = window.subtextAPI.getPathForFile(file);
  if (!zipPath) {
    hideResult();
    setVisualState("error", "Impossibile leggere il percorso del file trascinato.");
    return;
  }

  await runAnalyze(zipPath);
});

runBtn.addEventListener("click", () => {
  runProcess();
});

cancelPeriodBtn.addEventListener("click", () => {
  resetToIdle();
});

newRunBtn.addEventListener("click", () => {
  resetToIdle();
});

openFolderBtn.addEventListener("click", async () => {
  if (!latestOutputDir) return;
  const response = await window.subtextAPI.openFolder(latestOutputDir);
  if (!response.ok) {
    setVisualState("error", `Impossibile aprire la cartella: ${response.message}`);
  }
});

setVisualState("idle", "In attesa di un file .zip");
