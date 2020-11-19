import { createConnection, Connection, Not } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Passive from '../../../models/Passive';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { passiveModelFactory } from '../../factory/passiveFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SavePassiveCommand from '../../../commands/SavePassiveCommand';
import DeletePassiveCommand from '../../../commands/DeletePassiveCommand';
import LiquidatePassiveCommand from '../../../commands/LiquidatePassiveCommand';

describe('passive helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let otherTestAccount: Account;
  let testPassive: Passive;
  const testInitialBalance = 1000;
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

  const createTestAccount = async (user: User) => {
    const { databaseAccount } = await createAccount(connection, user.id, {
      initialBalance: testInitialBalance,
      type: AccountType.checking,
    });

    return databaseAccount;
  };

  const createTestPassive = async (user: User, account: Account) => {
    const saveCommand = new SavePassiveCommand(user, {
      account,
      ...passiveModelFactory({ account }).factoryPassive,
    });

    const [createdPassive] = await saveCommand.execute();
    createdPassive.account = account;

    return createdPassive;
  };

  const liquidateTestPassive = async (
    user: User,
    passive: Passive,
    liquidatedAccount: Account,
  ) => {
    const liquidateCommand = new LiquidatePassiveCommand(user, {
      liquidatedAccount,
      passive,
    });

    await liquidateCommand.execute();
  };

  const deleteTestPassive = async (user: User, passive: Passive) => {
    const deleteCommand = new DeletePassiveCommand(user, {
      passive,
    });
    await deleteCommand.execute();
  };

  const reloadPassive = (passive: Passive) =>
    connection.getRepository(Passive).findOneOrFail({
      where: { id: passive.id },
      relations: ['account', 'liquidatedAccount'],
    });

  describe('not liquidated', () => {
    beforeAll(async () => {
      testUser = (await createUser(connection)).databaseUser;
      testAccount = await createTestAccount(testUser);
      testPassive = await createTestPassive(testUser, testAccount);
      testPassive = await reloadPassive(testPassive);
      await deleteTestPassive(testUser, testPassive);
    });

    it('should delete the passive', async () => {
      const passive = await connection
        .getRepository(Passive)
        .findOne(testPassive.id);

      expect(passive).toBeUndefined();
    });

    it('should delete the sibling passive on root account', async () => {
      const rootPassive = await connection.getRepository(Passive).findOne({
        id: Not(testPassive.id),
        operationId: testPassive.operationId,
      });

      expect(rootPassive).toBeUndefined();
    });

    it('should change accounts balances', async () => {
      const updatedRootAccount = await testUser.getRootAccount();
      const updatedAccount = await connection
        .getRepository(Account)
        .findOneOrFail(testAccount.id);

      const expectedBalance = testInitialBalance;

      expect(updatedRootAccount.balance).toBe(-expectedBalance);
      expect(updatedAccount.balance).toBe(expectedBalance);
    });

    it('should change accounts unliquidated balances', async () => {
      const updatedRootAccount = await testUser.getRootAccount();
      const updatedAccount = await connection
        .getRepository(Account)
        .findOneOrFail(testAccount.id);

      const expectedBalance = 0;

      expect(updatedRootAccount.unliquidatedBalance).toBe(expectedBalance);
      expect(updatedAccount.unliquidatedBalance).toBe(expectedBalance);
    });
  });

  describe('already liquidated', () => {
    describe('different origin - liquidated accounts', () => {
      beforeAll(async () => {
        testUser = (await createUser(connection)).databaseUser;
        testAccount = await createTestAccount(testUser);
        otherTestAccount = await createTestAccount(testUser);
        testPassive = await createTestPassive(testUser, testAccount);
        await liquidateTestPassive(testUser, testPassive, otherTestAccount);
        testPassive = await reloadPassive(testPassive);
        await deleteTestPassive(testUser, testPassive);
      });

      it('should delete the passive', async () => {
        const passive = await connection
          .getRepository(Passive)
          .findOne(testPassive.id);

        expect(passive).toBeUndefined();
      });

      it('should delete the sibling passive on root account', async () => {
        const rootPassive = await connection.getRepository(Passive).findOne({
          id: Not(testPassive.id),
          operationId: testPassive.operationId,
        });

        expect(rootPassive).toBeUndefined();
      });

      it('should change accounts balances', async () => {
        const updatedRootAccount = await testUser.getRootAccount();

        const updatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(testAccount.id);

        const otherUpdatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(otherTestAccount.id);

        const expectedBalance = testInitialBalance;

        expect(updatedRootAccount.balance).toBe(-2 * expectedBalance);
        expect(updatedAccount.balance).toBe(expectedBalance);
        expect(otherUpdatedAccount.balance).toBe(expectedBalance);
      });

      it('should change accounts unliquidated balances', async () => {
        const updatedRootAccount = await testUser.getRootAccount();

        const updatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(testAccount.id);

        const otherUpdatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(otherTestAccount.id);

        expect(updatedRootAccount.unliquidatedBalance).toBe(0);
        expect(updatedAccount.unliquidatedBalance).toBe(0);
        expect(otherUpdatedAccount.unliquidatedBalance).toBe(0);
      });
    });

    describe('same origin - liquidated accounts', () => {
      beforeAll(async () => {
        testUser = (await createUser(connection)).databaseUser;
        testAccount = await createTestAccount(testUser);
        testPassive = await createTestPassive(testUser, testAccount);
        testPassive.account = testAccount;
        await liquidateTestPassive(testUser, testPassive, testAccount);
        testPassive = await reloadPassive(testPassive);
        await deleteTestPassive(testUser, testPassive);
      });

      it('should delete the passive', async () => {
        const passive = await connection
          .getRepository(Passive)
          .findOne(testPassive.id);

        expect(passive).toBeUndefined();
      });

      it('should delete the sibling passive on root account', async () => {
        const rootPassive = await connection.getRepository(Passive).findOne({
          id: Not(testPassive.id),
          operationId: testPassive.operationId,
        });

        expect(rootPassive).toBeUndefined();
      });

      it('should change accounts balances', async () => {
        const updatedRootAccount = await testUser.getRootAccount();
        const updatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(testAccount.id);

        const expectedBalance = testInitialBalance;

        expect(updatedRootAccount.balance).toBe(-expectedBalance);
        expect(updatedAccount.balance).toBe(expectedBalance);
      });

      it('should change accounts unliquidated balances', async () => {
        const updatedRootAccount = await testUser.getRootAccount();

        const updatedAccount = await connection
          .getRepository(Account)
          .findOneOrFail(testAccount.id);

        expect(updatedRootAccount.unliquidatedBalance).toBe(0);
        expect(updatedAccount.unliquidatedBalance).toBe(0);
      });
    });
  });
});
