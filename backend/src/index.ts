import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';

import { authenticateUser } from './services/passport';
import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import S3Helper from './utils/S3Helper';

const { PORT, NODE_ENV } = process.env;
const app = express();
app.get('/', (req, res) => res.redirect('/graphql'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: NODE_ENV === 'production',
  context: async ({ req }) => {
    const user = await authenticateUser(req);
    return { s3: new S3Helper(), user };
  },
});

server.applyMiddleware({ app });

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  createConnection().then(() => {
    console.log('TypeORM connected to Postgres database');
    app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));
  });
}

export default app;
