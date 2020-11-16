/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Account from '../../models/Account';
import SaveTransactionCommand from '../../commands/SaveTransactionCommand';

export type BuildType = Pick<Account, 'name' | 'bank' | 'type'> & {
  initialBalance: number;
};

export const accountBuilder = build<BuildType>('Account', {
  fields: {
    name: fake((faker) => faker.commerce.productName()),
    bank: fake((faker) => faker.company.companyName()),
    type: oneOf('cash', 'vista', 'checking'),
    initialBalance: fake((faker) => faker.random.number(3000)),
  },
});

export const accountFactory = (overrides?: Partial<BuildType>) =>
  accountBuilder({ map: (account) => ({ ...account, ...overrides }) });

export const accountModelFactory = (
  userId?: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryAccount = accountFactory(overrides);
  const account = new Account({ ...factoryAccount, userId });

  return { factoryAccount, account };
};

export const createAccount = async (
  connection: Connection,
  userId?: number,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();
  const factoryAccount = accountFactory(overrides);
  const account = new Account({ ...factoryAccount, userId });
  const databaseAccount = await entityManager
    .getRepository(Account)
    .save(account);

  const rootAccount = await entityManager
    .getRepository(Account)
    .findOne({ type: 'root', userId });

  if (factoryAccount.initialBalance !== 0) {
    const transactionCommands = new SaveTransactionCommand(
      { getRootAccount: async () => rootAccount } as any,
      {
        account: databaseAccount,
        memo: 'Initial balance',
        amount: factoryAccount.initialBalance,
      },
      entityManager,
    );

    await transactionCommands.execute();
  }

  return {
    databaseAccount,
    factoryAccount,
    account,
  };
};
