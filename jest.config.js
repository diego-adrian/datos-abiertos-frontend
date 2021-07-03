module.exports = {
  cache: false,
  moduleFileExtensions: ['js', 'vue'],

  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['./tests/setup.js'],
  transformIgnorePatterns: ['/node_modules/'],
  verbose: true,
  testResultsProcessor: 'jest-sonar-reporter'
};
