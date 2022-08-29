/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
