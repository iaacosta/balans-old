module.exports = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  synchronize: false,
  logging: process.env.NODE_ENV === 'test' ? false : ['query', 'error'],
  entities: ['./src/models/**/*.ts'],
  migrations: ['./src/migrations/**/*.ts'],
  subscribers: ['./src/subscribers/**/*.ts'],
};
