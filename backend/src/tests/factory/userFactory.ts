/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import User from '../../models/User';

export type BuildType = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'password' | 'username' | 'role'
>;

export const buildUser = build<BuildType>('User', {
  fields: {
    firstName: fake((faker) => faker.name.firstName()),
    lastName: fake((faker) => faker.name.lastName()),
    email: fake((faker) => faker.internet.email()),
    password: fake((faker) => faker.internet.password()),
    username: fake((faker) => faker.internet.userName().padStart(7, '_')),
    role: oneOf('admin', 'user'),
  },
});

export const userModelFactory = (overrides?: Partial<BuildType>) => {
  const factoryUser = buildUser({
    map: (user) => ({ ...user, ...overrides }),
  });
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
  const factoryUser = buildUser({
    map: (user) => ({ ...user, ...overrides }),
  });
  const user = new User(factoryUser);
  const databaseUser = await connection.getRepository(User).save(user);

  return {
    databaseUser,
    factoryUser,
    user,
  };
};
