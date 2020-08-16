/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export type BaseTransaction = BuildEntityOmit<GQLCreateTransactionInput, 'accountId'>;

export const buildTransaction = build<BaseTransaction>('transaction', {
  fields: { amount: fake((faker) => faker.random.number(2000000)) },
});
