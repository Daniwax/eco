/**
 * Test Setup File
 * Configures test environment before running tests
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Mock os module before requiring any modules
jest.mock('os', () => ({
  homedir: jest.fn(() => 'C:\\Users\\Test')
}));

// Mock Electron for tests
jest.mock('electron', () => require('./mocks/electron'));

// Mock fs for file operations
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn(),
  readFileSync: jest.fn(() => 'test content')
}));

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ text: 'Test transcription' }),
    text: () => Promise.resolve('Success')
  })
);

// Mock clipboard API
global.navigator = {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('test'))
  },
  mediaDevices: {
    getUserMedia: jest.fn(() => Promise.resolve({
      getTracks: () => [{
        stop: jest.fn()
      }]
    }))
  }
};

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock FormData for Node environment
global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }
  
  append(key, value) {
    this.data.set(key, value);
  }
  
  get(key) {
    return this.data.get(key);
  }
};

// Mock Blob for Node environment
global.Blob = class Blob {
  constructor(parts, options = {}) {
    this.parts = parts;
    this.type = options.type || '';
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
  }
};

// Mock AbortController
global.AbortController = class AbortController {
  constructor() {
    this.signal = { aborted: false };
  }
  
  abort() {
    this.signal.aborted = true;
  }
};

// Console mocking for cleaner test output
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };
}