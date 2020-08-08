/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { User } from '../../@types/graphql';

export type BaseUser = Omit<User, '__typename' | 'id' | 'name'> & { password: string };

export const buildUser = build<BaseUser>('user', {
  fields: {
    firstName: fake((faker) => faker.name.firstName()),
    lastName: fake((faker) => faker.name.lastName()),
    email: fake((faker) => faker.internet.email()),
    username: fake((faker) => faker.internet.userName()),
    password: fake((faker) => faker.internet.password()),
    role: oneOf('user', 'admin'),
  },
});
