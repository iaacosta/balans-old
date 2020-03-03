const { NODE_ENV } = process.env;

module.exports = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  synchronize: false,
  logging: ['query', 'error'],
  entities:
    NODE_ENV === 'production'
      ? ['./dist/models/**/*.js']
      : ['./src/models/**/*.ts'],
  migrations:
    NODE_ENV === 'production'
      ? ['./dist/migrations/**/*.js']
      : ['./src/migrations/**/*.ts'],
  subscribers:
    NODE_ENV === 'production'
      ? ['./dist/subscribers/**/*.js']
      : ['./src/subscribers/**/*.ts'],
};
