/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export type BasePassive = BuildEntityOmit<GQLCreatePassiveInput, 'accountId'>;

export const buildPassive = (overrides?: Partial<BasePassive>) => {
  const builder = build<BasePassive>('transaction', {
    fields: {
      amount: fake((faker) => faker.random.number(2000000)),
      memo: fake((faker) => faker.lorem.words(3)),
      issuedAt: fake((faker) => faker.date.past()),
    },
  });
  return builder({ map: (transaction) => ({ ...transaction, ...overrides }) });
};
