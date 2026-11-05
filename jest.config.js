const transform = {
  '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }],
};

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      rootDir: 'src',
      moduleFileExtensions: ['js', 'json', 'ts'],
      testMatch: ['**/*.spec.ts'],
      testPathIgnorePatterns: ['\\.int\\.spec\\.ts$'],
      transform,
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      rootDir: 'src',
      moduleFileExtensions: ['js', 'json', 'ts'],
      testMatch: ['**/*.int.spec.ts'],
      transform,
      testEnvironment: 'node',
      globalSetup: '<rootDir>/test-support/global-setup.ts',
      globalTeardown: '<rootDir>/test-support/global-teardown.ts',
      setupFilesAfterEnv: ['<rootDir>/test-support/integration-setup.ts'],
    },
  ],
  // Coverage options are global (not per project) and are the single source of
  // the gate: `npm run test:cov` and CI both read this file.
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/test-support/**',
    '!src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: { statements: 78, lines: 78, branches: 50 },
  },
};
