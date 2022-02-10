// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const {PythonShell} = require('python-shell');
const kill = require('tree-kill')
let mainWindow;

// Starting the python backend server
let shell = new PythonShell('./backend/server.py', options);

createWindow = () => {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity:false
    }
  });

  mainWindow.loadFile('pub/index.html');
}

app.whenReady().then(() => {
  createWindow();
	
	mainWindow.webContents.openDevTools()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
    	createWindow();
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
  let childs = shell.childProcess
  // Kill the python process 
  kill(childs.pid)	
})

/**
 * IPC Callback
 */
ipcMain.handle( 'custom-endpoint', async ( event, data ) => {
    console.log( data )
})