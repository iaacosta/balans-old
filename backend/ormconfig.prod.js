module.exports = {
  type: 'postgres',
  host: 'database',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  synchronize: false,
  logging: ['query', 'error'],
  entities: ['./dist/models/**/*.js'],
  migrations: ['./dist/migrations/**/*.js'],
  subscribers: ['./dist/subscribers/**/*.js'],
};
