module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/tests/utils/',
    'src/migrations/',
    'ormconfig.js',
  ],
};
