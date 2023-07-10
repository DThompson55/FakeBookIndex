const { app, BrowserWindow } = require('electron')
const path = require('path');
const isMac = process.platform === 'darwin'
const fs = require('fs')
const getJazzIndex = require('./getJazzIndex.js').getJazzIndex;

const createWindow = () => {  
  const mainWindow = new BrowserWindow({
//    alwaysOnTop: true,
    width: 1200,
    height: 800,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      devTools: false // This will disable dev tools debug
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', ()=>{
    try {
      getJazzIndex((jazzIndex)=>{
      mainWindow.webContents.send('load_index', JSON.stringify(jazzIndex));
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

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.




