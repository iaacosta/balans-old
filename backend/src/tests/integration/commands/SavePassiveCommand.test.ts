/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Passive from '../../../models/Passive';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { passiveModelFactory } from '../../factory/passiveFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SavePassiveCommand from '../../../commands/SavePassiveCommand';

const testInitialBalance = 1000;
const amountOfTestPassives = 5;

describe('passive helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testPassive: Passive;
  let testRootPassive: Passive;

  const testPassives: Passive[] = [];
  const testAmounts: number[] = [];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testAccount = (
      await createAccount(connection, testUser.id, {
        initialBalance: testInitialBalance,
        type: AccountType.checking,
      })
    ).databaseAccount;

    for (let i = 0; i < amountOfTestPassives; i += 1) {
      const { factoryPassive } = passiveModelFactory({
        account: testAccount,
      });

      if (i === 0) factoryPassive.memo = undefined;

      const command = new SavePassiveCommand(testUser, {
        account: testAccount,
        ...factoryPassive,
      });

      const [passive] = await command.execute();

      testPassives.push(passive);
      testAmounts.push(passive.amount);
    }
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  const getPassivePair = async (operationId: string) => {
    const [passive, rootPassive] = await getRepository(Passive).find({
      operationId,
    });

    return { passive, rootPassive };
  };

  it('should change account balances', async () => {
    const refreshedRootAccount = await testUser.getRootAccount();
    const refreshedAccount = await getRepository(Account).findOneOrFail(
      testAccount.id,
    );

    const expectedBalance = testAmounts.reduce(
      (accum, curr) => accum + curr,
      0,
    );

    expect(refreshedAccount.balance).toBe(testInitialBalance - expectedBalance);
    expect(refreshedAccount.unliquidatedBalance).toBe(expectedBalance);
    expect(refreshedRootAccount.balance).toBe(
      -testInitialBalance + expectedBalance,
    );
    expect(refreshedRootAccount.unliquidatedBalance).toBe(-expectedBalance);
  });

  Array.from(Array(amountOfTestPassives).keys()).forEach((_, idx) => {
    describe(`passive ${idx}`, () => {
      beforeAll(async () => {
        const passives = await getPassivePair(testPassives[idx].operationId);

        testPassive = passives.passive;
        testRootPassive = passives.rootPassive;
      });

      it('should create passive pairs', async () => {
        expect(testPassive).toBeDefined();
        expect(testRootPassive).toBeDefined();
      });

      it('should have correct root flags', async () => {
        expect(testPassive.root).toBe(false);
        expect(testRootPassive.root).toBe(true);
      });

      it('should have correct values', async () => {
        const expectedAmount = testPassives[idx].amount;
        expect(testPassive.amount).toBe(expectedAmount);
        expect(testRootPassive.amount).toBe(-expectedAmount);
      });
    });
  });
});
