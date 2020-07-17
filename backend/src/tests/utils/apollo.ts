/* eslint-disable import/no-extraneous-dependencies */
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from '../../graphql/schemas';
import resolvers from '../../graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ s3: { removeFile: () => true } }),
});

export const { query, mutate } = createTestClient(server);
