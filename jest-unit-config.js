/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']

module.exports = config
