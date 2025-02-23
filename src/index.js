const { app, BrowserWindow ,screen, ipcMain } = require('electron')
const path = require('path');
const isMac = process.platform === 'darwin'
const fs = require('fs')
//const getJazzIndex = require('./getJazzIndex.js').getJazzIndex;
const getJazzIndex = require('./getJsonJazzIndex.js').getJazzIndex;
const synomyms = require('./resources/synonyms.json');


const createWindow = () => {  

const data = fs.readFileSync("corrections.js",'utf8');
var s = data.slice(0,-2);
s+="]"
console.log(s);
var r = JSON.parse(s);
console.log(r[r.length - 1].id)


const primaryDisplay = screen.getPrimaryDisplay();
const { width, height } = primaryDisplay.workAreaSize;
const mainWindow = new BrowserWindow({
//    alwaysOnTop: true,
    width: width,
    height: height,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      devTools: true // This will disable dev tools debug
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
 mainWindow.webContents.openDevTools();


  mainWindow.webContents.on('did-finish-load', ()=>{
    try {
      const jsonPath = path.join(__dirname, 'resources/merged.json')
      getJazzIndex(jsonPath, (jazzIndex)=>{
      mainWindow.webContents.send('start_index', JSON.stringify({start:(r[r.length - 1].id)},null,2));        
      mainWindow.webContents.send('load_index', JSON.stringify(jazzIndex,null,2));
      mainWindow.webContents.send('load_synonyms', synomyms);
    })
  } catch(e){console.log(e)}
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('save', (event,msg) => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  console.log(msg);
  fs.appendFileSync("corrections.js",(msg+",\n"));
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.




