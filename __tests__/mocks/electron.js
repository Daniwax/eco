// Mock Electron module for testing
module.exports = {
  app: {
    getPath: jest.fn(() => 'C:\\Users\\Test\\AppData\\Roaming\\voice-recorder'),
    getVersion: jest.fn(() => '1.0.1'),
    quit: jest.fn(),
    requestSingleInstanceLock: jest.fn(() => true),
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
    setName: jest.fn(),
    setAppUserModelId: jest.fn(),
    isQuitting: false
  },
  BrowserWindow: jest.fn(() => ({
    loadFile: jest.fn(),
    on: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    isVisible: jest.fn(() => true),
    isDestroyed: jest.fn(() => false),
    setAlwaysOnTop: jest.fn(),
    setPosition: jest.fn(),
    getBounds: jest.fn(() => ({ width: 120, height: 120 })),
    isAlwaysOnTop: jest.fn(() => true),
    isFrameless: jest.fn(() => false),
    webContents: {
      send: jest.fn()
    }
  })),
  globalShortcut: {
    register: jest.fn(() => true),
    unregisterAll: jest.fn(),
    isRegistered: jest.fn(() => false)
  },
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(() => 'test')
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn()
  },
  shell: {
    openPath: jest.fn()
  },
  nativeImage: {
    createFromPath: jest.fn(),
    createFromDataURL: jest.fn()
  },
  Tray: jest.fn(),
  Menu: {
    buildFromTemplate: jest.fn()
  }
};