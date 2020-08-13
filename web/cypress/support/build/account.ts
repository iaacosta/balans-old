/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';

export type BaseAccount = GQLCreateAccountInput;

export const buildAccount = build<BaseAccount>('account', {
  fields: {
    name: fake((faker) => faker.commerce.product()),
    bank: fake((faker) => faker.company.companyName()),
    initialBalance: fake((faker) => faker.random.number(4000)),
    type: oneOf<GQLAccountType>('cash', 'checking', 'vista'),
  },
});
