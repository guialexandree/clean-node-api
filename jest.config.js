/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	roots: ['<rootDir>/src'],
  collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/main/**',
		'!<rootDir>/src/**/*protocols.ts',
		'!<rootDir>/src/**/*protocols/index.ts',
		'!<rootDir>/src/types/*.d.ts',
		'!<rootDir>/src/**/test/*.ts'
	],
  coverageDirectory: 'coverage',
	preset: '@shelf/jest-mongodb',
	watchPathIgnorePatterns: ['globalConfig'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/src/$1'
	}
}
