// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain,session} = require('electron')
const path = require('path')
const {PythonShell} = require('python-shell');
const kill = require('tree-kill')
let mainWindow,ext;

// Starting the python backend server
// let shell = new PythonShell('./backend/server.py', options);
 
  
createWindow = () => {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity:false,
      webviewTag: true

    }
  });
 
  mainWindow.loadFile('pub/index.html');
}

app.whenReady().then(() => {
  ext = session.defaultSession.loadExtension(path.join(__dirname, '../chrome_extension')).then((r)=>{
    console.log('ext', r)
  });
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
  // let childs = shell.childProcess
  // Kill the python process 
  // kill(childs.pid)	
})

/**
 * IPC Callback
 */
ipcMain.handle( 'custom-endpoint', async ( event, data ) => {
    console.log( data )
})