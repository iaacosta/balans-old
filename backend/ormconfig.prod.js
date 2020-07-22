module.exports = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  port: process.env.RDS_PORT,
  synchronize: false,
  logging: ['query', 'error'],
  entities: ['./dist/models/**/*.js'],
  migrations: ['./dist/migrations/**/*.js'],
  subscribers: ['./dist/subscribers/**/*.js'],
};
