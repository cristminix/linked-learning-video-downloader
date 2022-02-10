const { contextBridge, ipcRenderer} = require('electron')

// Adds an object 'api' to the global window object:
/***
 * Define API Here
 * */
contextBridge.exposeInMainWorld('api', {
    doAction: async (arg) => {
        return await ipcRenderer.invoke('an-action', arg);
    },
    send: ( channel, data ) => ipcRenderer.invoke( channel, data ),
    handle: ( channel, callable, event, data ) => ipcRenderer.on( channel, callable( event, data ) )
} )

