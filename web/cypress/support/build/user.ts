/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export type BaseUser = BuildEntityOmit<
  GQLUser,
  '__typename' | 'name' | 'role' | 'accounts' | 'categories'
> & {
  password: string;
};

export const buildUser = (overrides?: Partial<BaseUser>) => {
  const builder = build<BaseUser>('user', {
    fields: {
      firstName: fake((faker) => faker.name.firstName()),
      lastName: fake((faker) => faker.name.lastName()),
      email: fake((faker) => faker.internet.email()),
      username: fake((faker) => {
        const username = faker.internet.userName();
        if (username.length < 7) return `______${username}`;
        return username;
      }),
      password: fake((faker) => faker.internet.password()),
    },
  });

  return builder({ map: (user) => ({ ...user, ...overrides }) });
};
