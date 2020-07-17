module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/'],
  collectCoverageFrom: ['src/**/*.ts'],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/tests/',
    'src/migrations/',
    'src/index',
    'src/@types',
    'src/jestMatchers.d.ts',
    'src/config',
    'ormconfig.js',
  ],
};
