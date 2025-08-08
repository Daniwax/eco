# Testing Documentation for Voice Recorder

## Test Structure (Following Electron Best Practices 2024)

Based on current Electron testing best practices, the tests are organized as follows:

```
electron/
├── __tests__/           # All tests in one location (recommended)
│   ├── unit/           # Unit tests for individual modules
│   │   ├── logger.test.js
│   │   └── main.test.js
│   ├── integration/    # Integration tests
│   │   ├── recording.test.js
│   │   └── api.test.js
│   ├── mocks/          # Mock modules
│   │   └── electron.js
│   └── setup.js        # Jest setup file
├── jest.config.js      # Jest configuration
├── .babelrc           # Babel config for Jest
└── .eslintrc.json     # ESLint configuration
```

## Why This Structure?

1. **Spectron is Deprecated**: Spectron only supports Electron up to v13. We use Playwright for E2E testing instead.
2. **__tests__ Convention**: Following JavaScript testing conventions, tests are in `__tests__` folders
3. **Separation by Type**: Unit tests separate from integration tests for clarity
4. **Mock Isolation**: Mocks in dedicated folder for reusability

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Types
```bash
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # With coverage report
npm run test:watch       # Watch mode for development
```

### Individual Test Files
```bash
npx jest __tests__/unit/logger.test.js
```

## Test Types

### 1. Unit Tests (`__tests__/unit/`)
- Test individual modules in isolation
- Mock all dependencies
- Fast execution
- Examples: logger.test.js, main.test.js

### 2. Integration Tests (`__tests__/integration/`)
- Test interaction between components
- Minimal mocking
- Examples: recording.test.js, api.test.js

### 3. E2E Tests (Future with Playwright)
```javascript
// Future implementation with Playwright
const { _electron: electron } = require('playwright');

test('full recording workflow', async () => {
  const app = await electron.launch({
    args: ['main.cjs']
  });
  // Test complete user workflow
});
```

## Key Testing Challenges in Electron

### 1. Two Process Types
- **Main Process**: Node.js environment
- **Renderer Process**: Browser environment

Solution: Different test environments configured in Jest

### 2. Native APIs
- File system access
- Global hotkeys
- System tray

Solution: Mock electron module (`__tests__/mocks/electron.js`)

### 3. IPC Communication
Testing communication between main and renderer processes

Solution: Mock IPC channels in tests

## Coverage Report

Run tests with coverage:
```bash
npm run test:coverage
```

Coverage report available at: `coverage/index.html`

## CI/CD Integration

Tests run automatically on:
- Every push to main branch
- Pull requests
- Daily scheduled runs

See `.github/workflows/test.yml` for CI configuration

## Writing New Tests

### Unit Test Template
```javascript
// __tests__/unit/mymodule.test.js
describe('MyModule', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  
  test('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### Integration Test Template
```javascript
// __tests__/integration/feature.test.js
describe('Feature Integration', () => {
  test('should work end-to-end', async () => {
    // Setup
    const component1 = new Component1();
    const component2 = new Component2();
    
    // Execute
    const result = await component1.interactWith(component2);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

## Common Test Commands for Agents

```bash
# Quick validation
npm test

# Before commit
npm run test:unit && npm run lint

# Full validation
npm run test:coverage

# Debug specific test
npx jest --detectOpenHandles __tests__/unit/logger.test.js
```

## Test Status

Current test suite includes:
- ✅ 8 unit tests
- ✅ 10 integration tests
- ⏳ E2E tests (planned with Playwright)
- ✅ Mock electron module
- ✅ API mocking
- ✅ MediaRecorder mocking

## Troubleshooting

### "Cannot find module electron"
Check that `__tests__/mocks/electron.js` exists

### Tests hanging
Add `--detectOpenHandles` flag:
```bash
npx jest --detectOpenHandles
```

### Coverage not generating
Ensure `collectCoverage: true` in jest.config.js

## For AI Agents

Tests can be run programmatically:
```javascript
const { exec } = require('child_process');

function runTests() {
  return new Promise((resolve, reject) => {
    exec('npm test', (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve({ stdout, passed: !error });
      }
    });
  });
}

// Usage
const result = await runTests();
console.log(result.passed ? 'Tests passed' : 'Tests failed');
```