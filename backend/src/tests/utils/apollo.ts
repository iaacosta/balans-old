/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import {
  createTestClient,
  ApolloServerTestClient,
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';

import { buildOwnSchema } from '../../config/apollo';
import formatError from '../../errors/apolloErrorFormatter';
import { Context } from '../../@types';
import initializeLoaders from '../../graphql/loaders';

export const mountTestClient = async (
  context?: Partial<Context>,
): Promise<ApolloServerTestClient> => {
  const schema = await buildOwnSchema();

  const server = new ApolloServer({
    schema,
    formatError,
    context: (): Context => ({
      currentUser: null,
      loaders: initializeLoaders(),
      ...context,
    }),
  });

  return createTestClient(server);
};
