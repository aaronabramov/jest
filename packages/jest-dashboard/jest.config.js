const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  roots: ['<rootDir>/packages/jest-matchers/src'],
  snapshotSerializers: [
    '<rootDir>/packages/pretty-format/build/plugins/convert_ansi.js',
  ],
  testEnvironment: './packages/jest-environment-node',
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '\\.snap$'],
  transform: {
    '^.+\\.js$': '<rootDir>/packages/babel-jest',
  },
};
