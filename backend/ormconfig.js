const basePath = process.env.NODE_ENV === 'production' ? './dist' : './src';

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOSTNAME || 'localhost',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  synchronize: false,
  logging: process.env.NODE_ENV === 'test' ? false : ['query', 'error'],
  entities: [`${basePath}/models/**/*`],
  migrations: [`${basePath}/migrations/**/*`],
  subscribers: [`${basePath}/subscribers/**/*`],
};
