const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createChildFolder: (child) => ipcRenderer.invoke('create-child-folder', child),
  saveResultsToCSV: (data) => ipcRenderer.send('save-to-csv', data),
  closeApp: () => ipcRenderer.send('close-app'),
});