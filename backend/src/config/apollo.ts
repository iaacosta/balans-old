import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolve } from 'path';

import { authenticateUser } from '../services/passport';
import S3Helper from '../utils/S3Helper';
import { Then } from '../@types';

type Context = {
  s3: S3Helper;
  user: Then<ReturnType<typeof authenticateUser>>;
};

const mountApollo = async () => {
  const schema = await buildSchema({
    resolvers: [
      resolve(__dirname, '..', 'graphql', 'resolvers', '*.ts'),
      resolve(__dirname, '..', 'models', '*.ts'),
    ],
  });

  return new ApolloServer({
    schema,
    context: async ({ req }): Promise<Context> => {
      const user = await authenticateUser(req);
      return { s3: new S3Helper(), user };
    },
  });
};

export default mountApollo;
