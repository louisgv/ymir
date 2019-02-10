const electron = require("electron");
const path = require("path"); // Module to control application life.

const { initialize } = require("./main");

const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const DEV_MODE = process.env.NODE_ENV === 'development';

if (process.env.NODE_ENV === 'development') {
  require('electron-watch')(
    __dirname,
    'dev:electron-main',             // npm scripts, means: npm run dev:electron-main
    path.join(__dirname, '../'),      // cwd
    2000,                            // debounce delay
  );
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if(DEV_MODE) {
    // and load the index.html of the app.
    console.log(__dirname);
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL('http://localhost:3000');
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

  mainWindow.webContents.on("did-finish-load", () => {
    initialize(mainWindow);
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
