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
  entities: [`./src/models/**/*.${NODE_ENV === 'production' ? 'js' : 'ts'}`],
  migrations: [
    `./src/migrations/**/*.${NODE_ENV === 'production' ? 'js' : 'ts'}`,
  ],
  subscribers: [
    `./src/subscribers/**/*.${NODE_ENV === 'production' ? 'js' : 'ts'}`,
  ],
};
