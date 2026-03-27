const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("subtextAPI", {
  processZip: (payload) => ipcRenderer.invoke("anonymizer:process-zip", payload),
  openFolder: (folderPath) => ipcRenderer.invoke("anonymizer:open-folder", folderPath),
  getPathForFile: (file) => webUtils.getPathForFile(file)
});
