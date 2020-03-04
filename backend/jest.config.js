module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/tests/',
    'src/migrations/',
    'ormconfig.js',
  ],
};
