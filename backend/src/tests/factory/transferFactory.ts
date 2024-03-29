/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Transfer from '../../models/Transfer';
import Account from '../../models/Account';
import SaveTransferCommand from '../../commands/SaveTransferCommand';

export type BuildType = Pick<Transfer, 'amount' | 'memo' | 'issuedAt'>;

export const transferBuilder = build<BuildType>('transfer', {
  fields: {
    amount: fake((faker) => faker.random.number(15000)),
    memo: fake((faker) => faker.lorem.words(3)),
    issuedAt: fake((faker) => faker.date.past()),
  },
});

export const transferFactory = (overrides?: Partial<BuildType>) =>
  transferBuilder({
    map: (transfer) => ({ ...transfer, ...overrides }),
  });

export type TransferDependencies = {
  fromAccount: Account;
  toAccount: Account;
};

export const transferModelFactory = (
  { fromAccount, toAccount }: TransferDependencies,
  overrides?: Partial<BuildType>,
) => {
  const factoryTransfer = transferFactory(overrides);
  const operationId = uuid();

  return {
    factoryTransfer,
    fromTransfer: new Transfer({
      ...factoryTransfer,
      amount: -factoryTransfer.amount,
      operationId,
      accountId: fromAccount.id,
    }),
    toTransfer: new Transfer({
      ...factoryTransfer,
      operationId,
      accountId: toAccount.id,
    }),
  };
};

export const createTransfer = async (
  connection: Connection,
  { fromAccount, toAccount }: TransferDependencies,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();
  const rootAccount = await entityManager
    .getRepository(Account)
    .findOneOrFail({ type: 'root', userId: fromAccount.userId });

  const { factoryTransfer, fromTransfer, toTransfer } = transferModelFactory(
    { fromAccount, toAccount },
    overrides,
  );

  const transferCommands = new SaveTransferCommand(
    { getRootAccount: async () => rootAccount } as any,
    { fromAccount, toAccount, ...factoryTransfer },
    entityManager,
  );

  const [
    fromDatabaseTransfer,
    toDatabaseTransfer,
  ] = await transferCommands.execute();

  return {
    fromDatabaseTransfer,
    toDatabaseTransfer,
    fromTransfer,
    toTransfer,
    factoryTransfer,
  };
};
