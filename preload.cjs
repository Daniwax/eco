const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  onToggleRecording: (callback) => {
    ipcRenderer.on('toggle-recording', callback);
  },
  
  copyToClipboard: (text) => {
    ipcRenderer.send('copy-to-clipboard', text);
  },
  
  showNotification: (title, body) => {
    ipcRenderer.send('show-notification', { title, body });
  },
  
  closeApp: () => {
    ipcRenderer.send('close-app');
  },
  
  // Logging functions
  log: (message, data) => {
    ipcRenderer.send('log-message', message, data);
  },
  
  logError: (message, error) => {
    ipcRenderer.send('log-error', message, error);
  },
  
  getLogPath: () => {
    return ipcRenderer.invoke('get-log-path');
  },
  
  openLogsFolder: () => {
    return ipcRenderer.invoke('open-logs-folder');
  }
});