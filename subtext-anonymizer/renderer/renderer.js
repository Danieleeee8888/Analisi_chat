const dropzone = document.getElementById("dropzone");
const statusBox = document.getElementById("status");
const resultBox = document.getElementById("result");
const outputPathEl = document.getElementById("outputPath");
const openFolderBtn = document.getElementById("openFolderBtn");

let latestOutputDir = null;

function setVisualState(state, message) {
  dropzone.classList.remove("idle", "processing", "done", "error", "dragover");
  statusBox.classList.remove("idle", "processing", "done", "error");
  dropzone.classList.add(state);
  statusBox.classList.add(state);
  statusBox.textContent = message;
}

function showResult(outputPath, outputDir, metricsPath) {
  const parts = [outputPath];
  if (metricsPath) {
    parts.push(metricsPath);
  }
  outputPathEl.textContent = parts.join("\n");
  latestOutputDir = outputDir;
  resultBox.classList.remove("hidden");
}

function hideResult() {
  latestOutputDir = null;
  resultBox.classList.add("hidden");
}

async function runAnonymization(zipPath) {
  setVisualState("processing", "Elaborazione in corso...");
  hideResult();

  let confirmLargeFile = false;
  let proceedWithoutWhatsappPattern = false;
  let outputDir = undefined;

  while (true) {
    const response = await window.subtextAPI.processZip({
      zipPath,
      confirmLargeFile,
      proceedWithoutWhatsappPattern,
      outputDir
    });

    if (response.ok) {
      const outputPath = response.result.outputPath;
      const folder = response.result.outputDir;
      const metricsPath = response.result.metricsPath;
      setVisualState("done", "Anonimizzazione completata con successo.");
      showResult(outputPath, folder, metricsPath);
      return;
    }

    if (response.type === "warning") {
      if (response.code === "FILE_TOO_LARGE") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per continuare.`);
        if (!proceed) {
          setVisualState("idle", "Operazione annullata.");
          return;
        }
        confirmLargeFile = true;
        continue;
      }

      if (response.code === "NOT_WHATSAPP_PATTERN") {
        const proceed = window.confirm(`${response.message}\n\nPremi OK per procedere comunque.`);
        if (!proceed) {
          setVisualState("idle", "Operazione annullata.");
          return;
        }
        proceedWithoutWhatsappPattern = true;
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

    setVisualState("error", response.message || "Errore durante il processing.");
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
  if (!dropzone.classList.contains("processing")) {
    dropzone.classList.add("dragover");
  }
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");

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

  await runAnonymization(zipPath);
});

openFolderBtn.addEventListener("click", async () => {
  if (!latestOutputDir) return;
  const response = await window.subtextAPI.openFolder(latestOutputDir);
  if (!response.ok) {
    setVisualState("error", `Impossibile aprire la cartella: ${response.message}`);
  }
});

setVisualState("idle", "In attesa di un file .zip");
