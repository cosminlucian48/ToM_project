const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveResultsToCSV: (data) => ipcRenderer.send('save-to-csv', data),
});