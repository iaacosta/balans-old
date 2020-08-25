/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Account from '../../models/Account';

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

  if (factoryAccount.initialBalance !== 0) {
    await databaseAccount.performTransaction(
      { amount: factoryAccount.initialBalance, memo: 'Initial balance' },
      { transaction: false, entityManager },
    );
  }

  return {
    databaseAccount,
    factoryAccount,
    account,
  };
};
