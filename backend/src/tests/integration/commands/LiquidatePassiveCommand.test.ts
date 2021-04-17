/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getManager } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Passive from '../../../models/Passive';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { passiveModelFactory } from '../../factory/passiveFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SavePassiveCommand from '../../../commands/SavePassiveCommand';
import LiquidatePassiveCommand from '../../../commands/LiquidatePassiveCommand';

const testInitialBalance = 1000;

describe('passive helper tests', () => {
  let connection: Connection;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  const createAndLiquidatePassive = async ({
    user,
    baseAccount,
    liquidatedAccount,
  }: {
    user: User;
    baseAccount: Account;
    liquidatedAccount: Account;
  }) => {
    const saveCommand = new SavePassiveCommand(user, {
      account: baseAccount,
      ...passiveModelFactory({ account: baseAccount }).factoryPassive,
    });

    const [passive] = await saveCommand.execute();

    const liquidateCommand = new LiquidatePassiveCommand(user, {
      liquidatedAccount,
      passive: await getManager()
        .getRepository(Passive)
        .findOneOrFail(passive.id, { relations: ['account'] }),
    });

    await liquidateCommand.execute();

    return passive;
  };

  const createTestAccount = async (user: User) => {
    const { databaseAccount } = await createAccount(connection, user.id, {
      initialBalance: testInitialBalance,
      type: AccountType.checking,
    });

    return databaseAccount;
  };

  describe('liquidate on same origin account', () => {
    let updatedPassive: Passive;
    let updatedRootPassive: Passive;
    let testUser: User;
    let testPassive: Passive;
    let testAccount: Account;

    beforeAll(async () => {
      testUser = (await createUser(connection)).databaseUser;
      testAccount = await createTestAccount(testUser);
      testPassive = await createAndLiquidatePassive({
        user: testUser,
        baseAccount: testAccount,
        liquidatedAccount: testAccount,
      });

      updatedPassive = await getManager()
        .getRepository(Passive)
        .findOneOrFail(testPassive.id);
      updatedRootPassive = await updatedPassive.getPairedPassive();
    });

    it('should liquidate passives', async () => {
      expect(updatedPassive.liquidated).toBe(true);
      expect(updatedRootPassive.liquidated).toBe(true);
    });

    it('should assign liquidated account', async () => {
      expect(updatedPassive.liquidatedAccountId).toBe(testAccount.id);
      expect(updatedRootPassive.liquidatedAccountId).toBeNull();
    });

    it('should change original / liquidated account balances', async () => {
      const updatedAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail(testAccount.id);

      expect(updatedAccount.balance).toBe(testInitialBalance);
      expect(updatedAccount.unliquidatedBalance).toBe(0);
    });

    it('should change root account balances', async () => {
      const updatedRootAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail({ where: { userId: testUser.id, type: 'root' } });

      expect(updatedRootAccount.balance).toBe(-testInitialBalance);
      expect(updatedRootAccount.unliquidatedBalance).toBe(0);
    });
  });

  describe('liquidate on other account', () => {
    let updatedPassive: Passive;
    let updatedRootPassive: Passive;
    let testUser: User;
    let testPassive: Passive;
    let testAccount: Account;
    let otherTestAccount: Account;

    beforeAll(async () => {
      testUser = (await createUser(connection)).databaseUser;
      testAccount = await createTestAccount(testUser);
      otherTestAccount = await createTestAccount(testUser);
      testPassive = await createAndLiquidatePassive({
        user: testUser,
        baseAccount: testAccount,
        liquidatedAccount: otherTestAccount,
      });

      updatedPassive = await getManager()
        .getRepository(Passive)
        .findOneOrFail(testPassive.id);

      updatedRootPassive = await updatedPassive.getPairedPassive();
    });

    it('should liquidate passives', async () => {
      expect(updatedPassive.liquidated).toBe(true);
      expect(updatedRootPassive.liquidated).toBe(true);
    });

    it('should assign liquidated account', async () => {
      expect(updatedPassive.liquidatedAccountId).toBe(otherTestAccount.id);
      expect(updatedRootPassive.liquidatedAccountId).toBeNull();
    });

    it('should change original account balances', async () => {
      const databaseAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail(testAccount.id);
      const expectedBalance = testInitialBalance - testPassive.amount;

      expect(databaseAccount.balance).toBe(expectedBalance);
      expect(databaseAccount.unliquidatedBalance).toBe(0);
    });

    it('should change liquidated account balances', async () => {
      const databaseAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail(otherTestAccount.id);
      const expectedBalance = testInitialBalance + testPassive.amount;

      expect(databaseAccount.balance).toBe(expectedBalance);
      expect(databaseAccount.unliquidatedBalance).toBe(0);
    });

    it('should change root account balances', async () => {
      const updatedRootAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail({ where: { userId: testUser.id, type: 'root' } });

      expect(updatedRootAccount.balance).toBe(-2 * testInitialBalance);
      expect(updatedRootAccount.unliquidatedBalance).toBe(0);
    });
  });
});
