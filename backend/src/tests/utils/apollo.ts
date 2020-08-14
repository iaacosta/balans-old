/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';

import { buildOwnSchema } from '../../config/apollo';
import formatError from '../../errors/apolloErrorFormatter';
import { Context } from '../../@types';

export const mountTestClient = async (context?: Partial<Context>) => {
  const schema = await buildOwnSchema();

  const server = new ApolloServer({
    schema,
    formatError,
    context: context || { s3: {}, currentUser: null },
  });

  return createTestClient(server);
};
