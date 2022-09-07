/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
	preset: '@shelf/jest-mongodb',
	watchPathIgnorePatterns: ['globalConfig'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
