const path = require('path');

const { NODE_ENV } = process.env;

const config = {
  type: 'postgres',
  synchronize: false,
  logging: NODE_ENV === 'test' ? false : ['query', 'error'],
};

if (NODE_ENV === 'production') {
  config.url = process.env.DATABASE_URL;
  config.entities = [path.join(__dirname, 'dist/models/**/*')];
  config.migrations = [path.join(__dirname, 'dist/migrations/**/*')];
  config.subscribers = [path.join(__dirname, 'dist/subscribers/**/*')];
} else {
  config.host = process.env.DB_HOSTNAME || 'localhost';
  config.username = process.env.DB_USERNAME;
  config.password = process.env.DB_PASSWORD;
  config.port = process.env.DB_PORT || 5432;

  if (['cypress', 'test'].includes(NODE_ENV)) {
    config.database = `${process.env.DB_NAME}_test`;
  } else {
    config.database = process.env.DB_NAME;
  }

  config.entities = ['src/models/**/*'];
  config.migrations = ['src/migrations/**/*'];
  config.subscribers = ['src/subscribers/**/*'];
}

console.log(config);
module.exports = config;
