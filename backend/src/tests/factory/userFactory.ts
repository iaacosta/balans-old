/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import User from '../../models/User';

export type BuildType = Omit<
  User,
  | 'name'
  | 'id'
  | 'accounts'
  | 'categories'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'verifyPassword'
  | 'getRootAccount'
>;

const randomHex = (length: number, faker: any) =>
  Buffer.from(
    Array.from({ length }, () =>
      faker.random.number({ min: 0, max: 255, precision: 1 }),
    ),
  ).toString('hex');

export const userBuilder = build<BuildType>('User', {
  fields: {
    firstName: fake((faker) => faker.name.firstName()),
    lastName: fake((faker) => faker.name.lastName()),
    email: fake((faker) => faker.internet.email()),
    password: fake((faker) => faker.internet.password()),
    username: fake((faker) => faker.internet.userName().padStart(7, '_')),
    initVector: fake((faker) => randomHex(16, faker)),
    role: oneOf('admin', 'user'),
  },
});

export const userFactory = (overrides?: Partial<BuildType>) =>
  userBuilder({
    map: (user) => ({ ...user, ...overrides }),
  });

export const userModelFactory = (overrides?: Partial<BuildType>) => {
  const factoryUser = userFactory(overrides);
  const user = new User(factoryUser);

  return {
    factoryUser,
    user,
  };
};

export const createUser = async (
  connection: Connection,
  overrides?: Partial<BuildType>,
) => {
  const factoryUser = userFactory(overrides);
  const user = new User(factoryUser);

  if (overrides?.fintualEmail) user.fintualEmail = overrides.fintualEmail;
  if (overrides?.fintualToken) user.fintualToken = overrides.fintualToken;

  const databaseUser = await connection.getRepository(User).save(user);

  return {
    databaseUser,
    factoryUser,
    user,
  };
};
