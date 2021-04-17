import repl from 'repl';
import { createConnection } from 'typeorm';
import Account from './models/Account';
import User from './models/User';

createConnection().then((connection) => {
  console.log('DB connection has been established successfully.');

  const replServer = repl.start({ prompt: 'console>', useColors: true });
  replServer.context.models = { Account, User };
  replServer.context.connection = connection;
});
