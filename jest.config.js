module.exports = {
  preset: 'jest-preset-angular',
  modulePaths: [
    '<rootDir>/src'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  // Allow Jest to transform the jose library
  transformIgnorePatterns: [
    'node_modules/(?!.*\.mjs$|jose)'
  ],
}; 