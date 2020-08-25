/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';
import { transactionFactory } from '../../factory/transactionFactory';

/*
  NOTE: all amounts should be unique, because I still don't handle
  two transactions that belong to the same operation
*/
describe('transaction creation tests', () => {
  const testInitialBalance = 1000;

  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;

  const pgClient = createPgClient();

  const getTransactionPair = (targetAmount: number) =>
    getRepository(Transaction).find({
      where: [
        { amount: targetAmount, accountId: testAccount.id },
        { amount: -targetAmount, accountId: testRootAccount.id },
      ],
    });

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;

    testAccount = (
      await createAccount(connection, testUser.id, {
        initialBalance: testInitialBalance,
      })
    ).databaseAccount;

    testRootAccount = await getRepository(Account).findOneOrFail({
      userId: testUser.id,
      type: 'root',
    });
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('initial balance', () => {
    it('should create two transactions on initial balance', async () => {
      const [transaction, rootTransaction] = await getTransactionPair(
        testInitialBalance,
      );

      expect(transaction).toBeDefined();
      expect(transaction.resultantBalance).toBe(testInitialBalance);
      expect(rootTransaction).toBeDefined();
      expect(rootTransaction.resultantBalance).toBe(-testInitialBalance);
    });
  });

  describe('performTransaction', () => {
    const staticArray = Array.from(Array(5).keys());

    let testAmounts: number[];
    let testTransactions: ReturnType<typeof transactionFactory>[];

    let testTransaction: ReturnType<typeof transactionFactory>;
    let transaction: Transaction;
    let rootTransaction: Transaction;

    beforeAll(async () => {
      testTransactions = staticArray.map(() => transactionFactory());
      testAmounts = testTransactions.map(({ amount }) => amount);

      for (const { amount } of testTransactions) {
        await testAccount.performTransaction({ amount });
      }
    });

    staticArray.forEach((_, idx) => {
      describe(`transaction ${idx}`, () => {
        beforeAll(async () => {
          testTransaction = testTransactions[idx];
          [transaction, rootTransaction] = await getTransactionPair(
            testTransaction.amount,
          );
        });

        it('should create transaction pairs', async () => {
          expect(transaction).toBeDefined();
          expect(rootTransaction).toBeDefined();
        });

        it('should have correct values', async () => {
          const expectedBalance =
            testInitialBalance +
            testAmounts
              .slice(0, idx + 1)
              .reduce((accum, curr) => accum + curr, 0);

          expect(transaction.resultantBalance).toBe(expectedBalance);
          expect(rootTransaction.resultantBalance).toBe(-expectedBalance);
        });
      });
    });

    it('should change account balances', async () => {
      const refreshedAccount = await getRepository(Account).findOneOrFail(
        testAccount.id,
      );

      const refreshedRootAccount = await getRepository(Account).findOneOrFail(
        testRootAccount.id,
      );

      const expectedBalance =
        testInitialBalance +
        testAmounts.reduce((accum, curr) => accum + curr, 0);

      expect(refreshedAccount.balance).toBe(expectedBalance);
      expect(refreshedRootAccount.balance).toBe(-expectedBalance);
    });
  });
});
