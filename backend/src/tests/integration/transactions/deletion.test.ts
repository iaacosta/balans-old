/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import Account from '../../../models/Account';
import { createAccount } from '../../factory/accountFactory';
import Transaction from '../../../models/Transaction';
import { transactionFactory } from '../../factory/transactionFactory';

describe('transaction deletion tests', () => {
  let connection: Connection;
  let testUser: User;
  let testRootAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;

    testRootAccount = await getRepository(Account).findOneOrFail({
      userId: testUser.id,
      type: 'root',
    });
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('delete account', () => {
    let testAccount: Account;

    beforeAll(async () => {
      testAccount = (await createAccount(connection, testUser.id))
        .databaseAccount;

      for (const { amount } of Array.from(Array(5).keys()).map(() =>
        transactionFactory(),
      )) {
        await testAccount.performTransaction({ amount });
      }

      await getRepository(Account).remove(testAccount);
    });

    it('should create a transaction to make up root account with many transactions', async () => {
      const transaction = await getRepository(Transaction).findOne({
        amount: testAccount.balance,
        accountId: testRootAccount.id,
      });

      expect(transaction).toBeDefined();
    });

    it('should have correct balance after deletion', async () => {
      const refreshedRootAccount = await getRepository(Account).findOneOrFail(
        testRootAccount.id,
      );

      expect(refreshedRootAccount.balance).toBe(0);
    });
  });

  describe('revertTransaction', () => {
    const testInitialBalance = 1000;
    const staticArray = Array.from(Array(5).keys());

    const testTransactions: Transaction[] = [];
    let testAccount: Account;
    let testAmounts: number[];

    beforeAll(async () => {
      const factoryTransactions = staticArray.map(() => transactionFactory());

      testAccount = (
        await createAccount(connection, testUser.id, {
          initialBalance: testInitialBalance,
        })
      ).databaseAccount;

      testAmounts = factoryTransactions.map(({ amount }) => amount);

      for (const { amount } of factoryTransactions) {
        testTransactions.push(await testAccount.performTransaction({ amount }));
      }
    });

    describe('delete transaction', () => {
      let toDeleteTransaction: Transaction;

      beforeAll(async () => {
        toDeleteTransaction = testTransactions[testTransactions.length - 1];
        await testAccount.revertTransaction(toDeleteTransaction);
      });

      it('should delete the sibling transaction on root account', async () => {
        const counterTransaction = await getRepository(Transaction).findOne({
          operationId: toDeleteTransaction.operationId,
          accountId: testRootAccount.id,
        });

        expect(counterTransaction).toBeUndefined();
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
          testAmounts
            .slice(0, testTransactions.length - 1)
            .reduce((accum, curr) => accum + curr, 0);

        expect(refreshedAccount.balance).toBe(expectedBalance);
        expect(refreshedRootAccount.balance).toBe(-expectedBalance);
      });
    });
  });
});
