/**
 * Jest Configuration for Voice Recorder
 * 
 * For agents: Run tests with `npm test`
 * For CI/CD: Tests can be automated in GitHub Actions
 */

module.exports = {
  // Test environment - use node for main process tests
  testEnvironment: 'node',
  
  // Where to find tests - following Electron best practices
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js'
  ],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/mocks/'
  ],
  
  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    '*.cjs',
    '!node_modules/**',
    '!dist/**',
    '!coverage/**',
    '!test/**'
  ],
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.cjs$': 'babel-jest'
  },
  
  // Module paths
  moduleNameMapper: {
    'electron': '<rootDir>/__tests__/mocks/electron.js'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Timeout for async tests
  testTimeout: 10000,
  
  // Verbose output for CI
  verbose: true,
  
  // Fail fast in CI
  bail: process.env.CI === 'true' ? 1 : 0
};