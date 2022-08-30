<<<<<<< HEAD
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
=======
const config = require('./jest.config')
config.testMatch = ['**/*.test.ts']
module.exports = config
>>>>>>> 7144a61ebaac2ed211e717b70f709111a6ba2914
