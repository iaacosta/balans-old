/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export type BaseTransaction = BuildEntityOmit<
  GQLCreateTransactionInput,
  'accountId' | 'categoryId'
>;

export const buildTransaction = (overrides?: Partial<BaseTransaction>) => {
  const builder = build<BaseTransaction>('transaction', {
    fields: {
      amount: fake((faker) => faker.random.number(2000000)),
      memo: fake((faker) => faker.lorem.words(3)),
    },
  });
  return builder({ map: (transaction) => ({ ...transaction, ...overrides }) });
};
