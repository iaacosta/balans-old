module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/'],
  collectCoverageFrom: ['src/**/*.ts'],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/@types',
    'src/graphql/resolvers/testResolvers.ts',
    'src/migrations/',
    'src/config/',
    'src/tests/',
    'src/index.ts',
    'src/jestMatchers.d.ts',
    'src/console.ts',
    'ormconfig.js',
  ],
};
