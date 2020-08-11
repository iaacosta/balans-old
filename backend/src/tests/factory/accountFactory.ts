/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Account from '../../models/Account';

export type BuildType = Pick<Account, 'name' | 'bank' | 'type'> & {
  initialBalance: number;
};

export const buildAccount = build<BuildType>('Account', {
  fields: {
    name: fake((faker) => faker.commerce.productName()),
    bank: fake((faker) => faker.company.companyName()),
    type: oneOf('cash', 'vista', 'checking'),
    initialBalance: fake((faker) => faker.random.number(3000)),
  },
});

export const accountModelFactory = (
  userId?: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryAccount = buildAccount({
    map: (account) => ({ ...account, ...overrides }),
  });
  const account = new Account({ ...factoryAccount, userId });

  return { factoryAccount, account };
};

export const createAccount = async (
  connection: Connection,
  userId?: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryAccount = buildAccount({
    map: (account) => ({ ...account, ...overrides }),
  });

  const account = new Account({ ...factoryAccount, userId });
  const databaseAccount = await connection.getRepository(Account).save(account);

  return {
    databaseAccount,
    factoryAccount,
    account,
  };
};
