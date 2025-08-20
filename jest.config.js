module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/k6/**/*.test.js'],
  collectCoverageFrom: [
    'api/**/*.js',
    '!api/k6/**',
    '!api/scripts/**',
    '!api/server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/api/k6/setup.js']
}; 