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
  const factoryUser = buildUser({ overrides: overrides as any });
  const user = new User(
    factoryUser.firstName,
    factoryUser.lastName,
    factoryUser.password,
    factoryUser.email,
    factoryUser.username,
    factoryUser.role,
  );

  return {
    factoryUser,
    user,
  };
};

export const createUser = async (
  connection: Connection,
  overrides?: Partial<BuildType>,
) => {
  const factoryUser = buildUser({ overrides: overrides as any });
  const user = new User(
    factoryUser.firstName,
    factoryUser.lastName,
    factoryUser.password,
    factoryUser.email,
    factoryUser.username,
    factoryUser.role,
  );

  const databaseUser = await connection.getRepository(User).save(user);

  return {
    databaseUser,
    factoryUser,
    user,
  };
};
