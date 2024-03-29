/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Transaction from '../../models/Transaction';
import Account from '../../models/Account';
import SaveTransactionCommand from '../../commands/SaveTransactionCommand';
import Category from '../../models/Category';

export type BuildType = Pick<Transaction, 'amount' | 'memo' | 'issuedAt'>;

export const transactionBuilder = build<BuildType>('transaction', {
  fields: {
    amount: fake((faker) => faker.random.number(15000)),
    memo: fake((faker) => faker.lorem.words(3)),
    issuedAt: fake((faker) => faker.date.past()),
  },
});

export const transactionFactory = (overrides?: Partial<BuildType>) =>
  transactionBuilder({
    map: (transaction) => ({ ...transaction, ...overrides }),
  });

export type CategoryPair = { income: Category; expense: Category };

export type TransactionDependencies = {
  account: Account;
  categories?: CategoryPair;
};

export const getCategoryForTransaction = (
  transaction: Pick<Transaction, 'amount'>,
  categories: CategoryPair,
) => (transaction.amount > 0 ? categories.income : categories.expense);

export const transactionModelFactory = (
  { account, categories }: TransactionDependencies,
  overrides?: Partial<BuildType>,
) => {
  const factoryTransaction = transactionFactory(overrides);
  const category =
    categories && getCategoryForTransaction(factoryTransaction, categories);

  const transaction = new Transaction({
    ...factoryTransaction,
    accountId: account.id,
    category,
  });

  return { factoryTransaction, transaction, category };
};

export const createTransaction = async (
  connection: Connection,
  { account, categories }: TransactionDependencies,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();

  const rootAccount = await entityManager
    .getRepository(Account)
    .findOneOrFail({ type: 'root', userId: account.userId });

  const { transaction, category, factoryTransaction } = transactionModelFactory(
    { account, categories },
    overrides,
  );

  const transactionCommands = new SaveTransactionCommand(
    { getRootAccount: async () => rootAccount } as any,
    { account, category, ...factoryTransaction },
    entityManager,
  );

  const [databaseTransaction] = await transactionCommands.execute();
  return { databaseTransaction, factoryTransaction, transaction };
};
