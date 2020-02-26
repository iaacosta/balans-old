module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/tests/utils/',
    'src/migrations/',
  ],
};
