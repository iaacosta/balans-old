import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolve } from 'path';

import { authenticateUser } from '../services/passport';
import S3Helper from '../utils/S3Helper';
import { Context } from '../@types';
import { formatError } from './errors';

const mountApollo = async () => {
  const schema = await buildSchema({
    resolvers: [
      resolve(__dirname, '..', 'graphql', 'resolvers', '*.ts'),
      resolve(__dirname, '..', 'models', '*.ts'),
    ],
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
