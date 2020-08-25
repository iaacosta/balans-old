/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { createConnection, Connection, getRepository, In } from 'typeorm';

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
    const operations: string[] = [];
    let testAccount: Account;

    beforeAll(async () => {
      testAccount = (await createAccount(connection, testUser.id))
        .databaseAccount;

      for (const { amount } of Array.from(Array(5).keys()).map(() =>
        transactionFactory(),
      )) {
        const { operationId } = await testAccount.performTransaction({
          amount,
        });
        operations.push(operationId);
      }

      await getRepository(Account).remove(testAccount);
    });

    it('should delete all related root account transactions', async () => {
      const transactions = await getRepository(Transaction).find({
        operationId: In(operations),
        accountId: testRootAccount.id,
      });

      expect(transactions).toHaveLength(0);
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
