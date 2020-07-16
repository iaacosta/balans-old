import { ApolloServer } from 'apollo-server-express';
import { buildSchema, AuthChecker } from 'type-graphql';
import { resolve } from 'path';

import authenticateUser from '../services/passport';
import S3Helper from '../utils/S3Helper';
import { Context } from '../@types';
import formatError from './errors';

const mountApollo = async () => {
  const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    if (!context.currentUser) return false;
    if (roles.length === 0) return true;
    if (!roles.includes(context.currentUser.role)) return false;
    return true;
  };

  const schema = await buildSchema({
    resolvers: [
      resolve(__dirname, '..', 'graphql', 'resolvers', '*.ts'),
      resolve(__dirname, '..', 'models', '*.ts'),
    ],
    authChecker,
  });

  return new ApolloServer({
    schema,
    formatError,
    context: async ({ req }): Promise<Context> => ({
      s3: new S3Helper(),
      currentUser: await authenticateUser(req),
    }),
  });
};

export default mountApollo;