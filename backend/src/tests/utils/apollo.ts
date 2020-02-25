import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from '../../graphql/schemas';
import resolvers from '../../graphql/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
export const { query, mutate } = createTestClient(server);
