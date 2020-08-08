/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export const buildUser = build<{
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}>('user', {
  fields: {
    firstName: fake((faker) => faker.name.firstName()),
    lastName: fake((faker) => faker.name.lastName()),
    email: fake((faker) => faker.internet.email()),
    username: fake((faker) => faker.internet.userName()),
    password: fake((faker) => faker.internet.password()),
  },
});
