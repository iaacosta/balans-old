/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';

export type BaseAccount = GQLCreateAccountInput;

export const buildAccount = (overrides?: Partial<BaseAccount>) => {
  const builder = build<BaseAccount>('account', {
    fields: {
      name: fake((faker) => faker.commerce.product()),
      bank: fake((faker) => faker.company.companyName()),
      initialBalance: fake((faker) => faker.random.number(2000000)),
      currency: oneOf<GQLCurrency>('CLP', 'USD'),
      type: oneOf<GQLAccountType>('cash', 'checking', 'vista'),
    },
  });

  return builder({ map: (account) => ({ ...account, ...overrides }) });
};
