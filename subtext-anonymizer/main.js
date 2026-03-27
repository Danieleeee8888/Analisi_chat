const path = require("path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { anonymizeWhatsappZip, analyzeWhatsappZip, AnonymizerWarning } = require("./anonymizer");

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 620,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

ipcMain.handle("anonymizer:analyze-zip", async (_event, payload) => {
  const { zipPath, confirmLargeFile, proceedWithoutWhatsappPattern } = payload || {};
  try {
    const result = await analyzeWhatsappZip(zipPath, {
      confirmLargeFile: Boolean(confirmLargeFile),
      proceedWithoutWhatsappPattern: Boolean(proceedWithoutWhatsappPattern)
    });
    return { ok: true, result };
  } catch (error) {
    if (error instanceof AnonymizerWarning) {
      return {
        ok: false,
        type: "warning",
        code: error.code,
        message: error.message,
        meta: error.meta || {}
      };
    }
    return {
      ok: false,
      type: "error",
      message: error.message || "Errore durante l'analisi dello zip."
    };
  }
});

ipcMain.handle("anonymizer:process-zip", async (_event, payload) => {
  const { zipPath, confirmLargeFile, proceedWithoutWhatsappPattern, outputDir, period } =
    payload || {};
  try {
    const result = await anonymizeWhatsappZip(zipPath, {
      confirmLargeFile: Boolean(confirmLargeFile),
      proceedWithoutWhatsappPattern: Boolean(proceedWithoutWhatsappPattern),
      outputDir,
      period: typeof period === "string" && period.length ? period : "all"
    });
    return { ok: true, result };
  } catch (error) {
    if (error instanceof AnonymizerWarning) {
      return {
        ok: false,
        type: "warning",
        code: error.code,
        message: error.message,
        meta: error.meta || {}
      };
    }

    return {
      ok: false,
      type: "error",
      message: error.message || "Errore imprevisto durante l'anonimizzazione."
    };
  }
});

ipcMain.handle("anonymizer:open-folder", async (_event, folderPath) => {
  if (!folderPath) return { ok: false, message: "Percorso non valido." };
  const response = await shell.openPath(folderPath);
  if (response) {
    return { ok: false, message: response };
  }
  return { ok: true };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
