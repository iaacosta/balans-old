import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const { PORT } = process.env;
const app = express();

const server = new ApolloServer({
  typeDefs: gql`
    type Response {
      id: ID!
      message: String!
    }

    type Query {
      response: Response!
    }
  `,
  resolvers: {
    Query: {
      response: () => ({ id: 0, message: 'Hello GraphQL' }),
    },
  },
});

server.applyMiddleware({ app });
app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));
