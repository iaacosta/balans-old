import { ApolloServer } from 'apollo-server-express';
import { buildSchema, AuthChecker } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { resolve } from 'path';

import { authenticateUser } from '../services/passport';
import { Context } from '../@types';
import initializeLoaders from '../graphql/loaders';
import formatError from '../errors/apolloErrorFormatter';

export const buildOwnSchema = async (): Promise<GraphQLSchema> => {
  const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    if (!context.currentUser) return false;
    if (roles.length === 0) return true;
    if (!roles.includes(context.currentUser.role)) return false;
    return true;
  };

  return buildSchema({
    resolvers: [
      resolve(__dirname, '..', 'graphql', 'resolvers', '*'),
      resolve(__dirname, '..', 'models', '*'),
    ],
    authChecker,
  });
};

export const mountApollo = async (): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildOwnSchema(),
    formatError,
    context: async ({ req }): Promise<Context> => ({
      currentUser: await authenticateUser(req),
      loaders: initializeLoaders(),
    }),
  });
