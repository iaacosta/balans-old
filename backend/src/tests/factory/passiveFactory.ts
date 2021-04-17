/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Passive from '../../models/Passive';
import Account from '../../models/Account';
import SavePassiveCommand from '../../commands/SavePassiveCommand';
import Category from '../../models/Category';

export type BuildType = Pick<Passive, 'amount' | 'memo' | 'issuedAt'>;

export const passiveBuilder = build<BuildType>('passive', {
  fields: {
    amount: fake((faker) => faker.random.number(15000)),
    memo: fake((faker) => faker.lorem.words(3)),
    issuedAt: fake((faker) => faker.date.past()),
  },
});

export const passiveFactory = (overrides?: Partial<BuildType>) =>
  passiveBuilder({
    map: (passive) => ({ ...passive, ...overrides }),
  });

export type CategoryPair = { income: Category; expense: Category };

export type PassiveDependencies = {
  account: Account;
};

export const passiveModelFactory = (
  { account }: PassiveDependencies,
  overrides?: Partial<BuildType>,
) => {
  const factoryPassive = passiveFactory(overrides);

  const passive = new Passive({
    ...factoryPassive,
    accountId: account.id,
  });

  return { factoryPassive, passive };
};

export const createPassive = async (
  connection: Connection,
  { account }: PassiveDependencies,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();

  const rootAccount = await entityManager
    .getRepository(Account)
    .findOneOrFail({ type: 'root', userId: account.userId });

  const { passive, factoryPassive } = passiveModelFactory(
    { account },
    overrides,
  );

  const passiveCommands = new SavePassiveCommand(
    { getRootAccount: async () => rootAccount } as any,
    { account, ...factoryPassive },
    entityManager,
  );

  const [databasePassive] = await passiveCommands.execute();
  return { databasePassive, factoryPassive, passive };
};
