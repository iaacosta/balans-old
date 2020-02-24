import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';

import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';

const { PORT } = process.env;
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

createConnection().then(() => {
  console.log('TypeORM connected to Postgres database');
  app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));
});
