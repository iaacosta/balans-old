module.exports = {
  type: 'postgres',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB_NAME,
  port: process.env.DB_PORT,
  synchronize: false,
  logging: ['query', 'error'],
  entities: ['./dist/models/**/*.js'],
  migrations: ['./dist/migrations/**/*.js'],
  subscribers: ['./dist/subscribers/**/*.js'],
};
