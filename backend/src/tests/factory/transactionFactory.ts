/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Transaction from '../../models/Transaction';

export type BuildType = Pick<Transaction, 'amount'>;

export const buildTransaction = build<BuildType>('transaction', {
  fields: {
    amount: fake((faker) => faker.random.number(15000)),
  },
});

export const transactionModelFactory = (
  accountId: number,
  resultantBalance: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryTransaction = buildTransaction({
    map: (transaction) => ({ ...transaction, ...overrides }),
  });
  const transaction = new Transaction({
    ...factoryTransaction,
    accountId,
    resultantBalance,
  });

  return { factoryTransaction, transaction };
};

export const createTransaction = async (
  connection: Connection,
  accountId: number,
  resultantBalance: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryTransaction = buildTransaction({
    map: (transaction) => ({ ...transaction, ...overrides }),
  });

  const transaction = new Transaction({
    ...factoryTransaction,
    accountId,
    resultantBalance,
  });

  const databaseTransaction = await connection
    .getRepository(Transaction)
    .save(transaction);

  return {
    databaseTransaction,
    factoryTransaction,
    transaction,
  };
};
