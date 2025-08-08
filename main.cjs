/**
 * Eco - Electron Main Process
 * 
 * This file manages the desktop application window, system tray, and global hotkeys.
 * It creates an always-on-top floating widget for voice recording.
 * 
 * Key Features:
 * - Global hotkeys (F8 for recording, F9 for show/hide)
 * - System tray integration
 * - Always-on-top floating window
 * - IPC communication with renderer process
 */

const { app, BrowserWindow, globalShortcut, Tray, Menu, clipboard, nativeImage, ipcMain, shell } = require('electron');
const path = require('path');

// Use simple logger that works
const logger = require('./simple-logger.cjs');

// Set app user model ID immediately for Windows
if (process.platform === 'win32') {
  app.setAppUserModelId('com.daniel.eco');
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running, quit this one
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

let mainWindow;
let tray;
let isRecording = false;

/**
 * Creates the main application window
 * 
 * Window features:
 * - 120x120 pixels for better stability
 * - No frame for clean appearance
 * - Solid purple background (transparency disabled to prevent glitching)
 * - Always on top with 'floating' level
 * - Positioned in bottom-right corner of screen
 */
function createWindow() {
  logger.log('Creating main window...');
  
  // Load icon with proper format - using .ico for Windows
  const iconPath = path.join(__dirname, 'build', 'icon.ico');
  const icon = nativeImage.createFromPath(iconPath);
  
  // Create mini floating window
  mainWindow = new BrowserWindow({
    width: 120,  // Slightly larger to prevent rendering issues
    height: 120,
    frame: false,  // No frame for clean look
    transparent: false,  // Disable transparency to prevent glitching
    backgroundColor: '#667eea',  // Set solid background color
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: true,  // Add shadow for better visibility
    roundedCorners: true,  // Enable rounded corners on Windows
    icon: icon,  // Set window icon
    title: 'Eco',  // Set window title
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load the simple HTML file
  mainWindow.loadFile(path.join(__dirname, 'recorder.html'));

  // Position in bottom right corner
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow.setPosition(width - 150, height - 150);  // Adjusted for new size

  // Show in taskbar
  mainWindow.setSkipTaskbar(false);
  
  // Ensure always on top with floating window level
  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);
  
  // Prevent window from being moved off-screen
  mainWindow.on('move', () => {
    const bounds = mainWindow.getBounds();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    
    // Keep window within screen bounds
    if (bounds.x < 0) mainWindow.setPosition(0, bounds.y);
    if (bounds.y < 0) mainWindow.setPosition(bounds.x, 0);
    if (bounds.x + bounds.width > screenWidth) {
      mainWindow.setPosition(screenWidth - bounds.width, bounds.y);
    }
    if (bounds.y + bounds.height > screenHeight) {
      mainWindow.setPosition(bounds.x, screenHeight - bounds.height);
    }
  });
  
  // Show window after all setup
  mainWindow.show();
  
  // Re-enforce always on top periodically to prevent glitching
  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(true, 'floating');
    }
  }, 5000);  // Reduced frequency to prevent performance issues
  
  // Handle focus events
  mainWindow.on('blur', () => {
    // Keep always on top even when losing focus
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setAlwaysOnTop(true, 'floating');
      }
    }, 10);
  });
  
  // Close completely when X is clicked (don't just hide)
  mainWindow.on('close', (event) => {
    // Actually quit the app when window is closed
    app.isQuitting = true;
    app.quit();
  });
}

/**
 * Creates system tray icon with context menu
 * 
 * Tray features:
 * - Show/Hide window option
 * - Quit application option
 * - Click to toggle window visibility
 * - Tooltip with usage instructions
 */
function createTray() {
  // Create system tray icon
  const iconPath = path.join(__dirname, 'icon.png'); // You'll need to add an icon
  tray = new Tray(nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABaElEQVQ4EY2TvUoDQRSFz8zsJhHBQlJY2FhYWIiFhYWFhYWFhYWFhYWFhYWFhY8h4k8hiD+IQfyJRjGJyW4ym9mZ8ZzZTTYYA3phduaeOfeb+2NBKaX4bxmGYQBBEADP82DbNqIowk/FGDsCcJNSCl3XYZomCCHgnGMQhGEYOI4TTNN0B01JkmQAiOM4kFIiSRLkeY5+hRB4nmfTtG0bIxSz2RUAcF0X8jwX/SCKokBZlqBUa0uSpBGu69oYwcViEZVlWRJCQNd10L7yPE8wDMMIRVEUCCEQx3GjLMtClmVNv1YUBTzPQ57nA+A4DuI4RhAEDfF9v2nX6rouxDAMg2CMQYKqqhrRbre/Af39VFVlY4QQQpIk+QaM47hhGGNfyLKsIaZpmoQxRjnnHxJst9v4a3HOgTFG6DTjSZIQSqmtaZqGfqnrGnVdg1KqT6fTp9Pp9K5d9N0+L5fLJ8MwrtF72e/yG6VSXH8Bv5GnAAAAAElFTkSuQmCC'));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show/Hide', 
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Eco - Press F8 to record');
  tray.setContextMenu(contextMenu);
  
  // Click to show/hide
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

/**
 * Registers global keyboard shortcuts
 * 
 * Hotkeys:
 * - F8: Toggle recording on/off
 * - F9: Show/hide application window
 * 
 * Note: F8/F9 chosen to avoid conflicts with common app shortcuts
 */
function registerGlobalShortcuts() {
  // F8 for recording (less likely to conflict)
  const recordShortcut = 'F8';
  
  const ret = globalShortcut.register(recordShortcut, () => {
    if (!mainWindow) return;
    
    logger.log('F8 hotkey pressed - toggling recording');
    // Send toggle recording event to renderer
    mainWindow.webContents.send('toggle-recording');
    
    // Show window when recording starts
    if (!isRecording && !mainWindow.isVisible()) {
      mainWindow.show();
    }
    
    isRecording = !isRecording;
  });

  if (!ret) {
    logger.log('Failed to register F8 hotkey');
  }

  // F9 to show/hide window
  globalShortcut.register('F9', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  // Force logger initialization
  logger.initialize();
  logger.log('App ready, initializing...');
  
  // Set app name for better identification
  app.setName('Eco');
  
  createWindow();
  createTray();
  registerGlobalShortcuts();
  
  logger.log('Log files are saved to:', logger.getLogsDirectory());
  
  // Handle close app IPC event
  ipcMain.on('close-app', () => {
    logger.log('Close app requested');
    app.isQuitting = true;
    app.quit();
  });
  
  // Handle copy to clipboard
  ipcMain.on('copy-to-clipboard', (event, text) => {
    logger.log('Copying to clipboard:', text);
    clipboard.writeText(text);
  });
  
  // Handle log messages from renderer
  ipcMain.on('log-message', (event, message, data) => {
    logger.log(`[Renderer] ${message}`, data);
  });
  
  ipcMain.on('log-error', (event, message, error) => {
    logger.error(`[Renderer] ${message}`, error);
  });
  
  ipcMain.handle('get-log-path', () => {
    return logger.getLogPath();
  });
  
  ipcMain.handle('open-logs-folder', () => {
    const logsDir = logger.getLogsDirectory();
    shell.openPath(logsDir);
    return logsDir;
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  logger.log('App quitting, cleaning up...');
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});