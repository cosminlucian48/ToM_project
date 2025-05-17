const fs = window.require('fs');
const path = window.require('path');

export const saveToCSV = (gameId, dataObj) => {
  const filePath = path.join(__dirname, 'results.csv');
  const line = `${gameId},${dataObj.name},${dataObj.age},${dataObj.score},${dataObj.time}\n`;
  
  fs.appendFile(filePath, line, (err) => {
    if (err) console.error('Error saving result:', err);
  });
};
