const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true, // Make the window full screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('close-app', () => {
    win.close();
  });

  // if (isDev) {
  //   win.loadURL('http://localhost:5173');
  // } else {
    win.loadFile(path.join(__dirname, '../vite-out/index.html'));
  // }
}

// Create child folder and info file
ipcMain.handle('create-child-folder', async (event, child) => {
  const baseDir = path.join(process.cwd(), 'results');
  const childDir = path.join(baseDir, child.name);
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  if (!fs.existsSync(childDir)) fs.mkdirSync(childDir);

  const now = new Date();
  const info = `Date: ${now.toISOString()}\nName: ${child.name}\nAge: ${child.age}\n`;
  const infoPath = path.join(childDir, 'info.txt');
  fs.writeFileSync(infoPath, info);

  return childDir;
});

// Save game results in child folder
ipcMain.on('save-to-csv', (event, { childName, results, gameName }) => {
  const baseDir = path.join(process.cwd(), 'results');
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir); // Ensure 'results' exists

  const childDir = path.join(baseDir, childName);
  if (!fs.existsSync(childDir)) fs.mkdirSync(childDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let headers = '';
  let lines = '';

  if (gameName === 'questionnaire') {
    headers = 'IntrebareID,Raspuns,TimpRăspuns(ms),TipIntrebare\n';
    lines = results.map(r =>
      `${r.questionID},"${r.answer}",${r.responseTime},${r.questionType}`
    ).join('\n');
  } else if (gameName === 'shape_color') {
    headers = 'Runda,Formă,Culoare,Ales,Corect,TimpRăspuns(ms),Regulă\n';
    lines = results.map(r =>
      `${r.runda},${r.forma},${r.culoare},${r.ales},${r.corect},${r.timpRaspuns},${r.regula}`
    ).join('\n');
  } else if (gameName === 'daynight_stroop') {
    headers = 'Runda,Afișat,Apăsat,Corect,TimpRăspuns(ms),StareJoc\n';
    lines = results.map(r =>
      `${r.round},${r.shown},${r.pressed},${r.correct},${r.responseTime},${r.gameState}`
    ).join('\n');
  } else {
    // Default (Game 1 or others)
    headers = 'Runda,Estimare(ms),Eroare(ms),Direcție\n';
    lines = results.map(r =>
      `${r.round},${r.guess},${r.error},${r.direction}`
    ).join('\n');
  }

  const filePath = path.join(childDir, `${gameName}_results_${timestamp}.xlsx`);
  const rows = [headers.replace(/\n$/, '').split(',')].concat(
    lines
      .split('\n')
      .filter(Boolean)
      .map(line => {
        // Remove quotes around fields and split by comma, but keep commas inside quotes
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        return [...line.matchAll(regex)].map(x => x[0].replace(/^"|"$/g, ""));
      })
  );

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  XLSX.writeFile(workbook, filePath);
  console.log('XLSX saved to:', filePath);
});

app.whenReady().then(createWindow);
