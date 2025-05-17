const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../vite-out/index.html'));
  } // or your local Vite dev address
}

// Handle CSV writing
ipcMain.on('save-to-csv', (event, results) => {
  //const filePath = path.join(app.getPath('desktop'), 'game_results.csv');

  const filePath = path.join(process.cwd(), 'results\\game_results.csv');
  const headers = 'Round,Guess(ms),Error(ms),Direction\n';
  const lines = results.map(r =>
    `${r.round},${r.guess},${r.error},${r.direction}`
  ).join('\n');

  const content = headers + lines;

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to save CSV:', err);
    } else {
      console.log('CSV saved to:', filePath);
    }
  });
});

app.whenReady().then(createWindow);
