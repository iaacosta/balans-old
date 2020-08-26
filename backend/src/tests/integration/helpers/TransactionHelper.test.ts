/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
  createConnection,
  Connection,
  Repository,
  getRepository,
} from 'typeorm';
import { UserInputError } from 'apollo-server-express';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import Account from '../../../models/Account';
import {
  transactionModelFactory,
  createTransaction,
  transactionFactory,
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import TransactionHelper from '../../../helpers/TransactionHelper';

describe('transaction helper tests', () => {
  const testInitialBalance = 1000;

  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection)).databaseUser;

    testAccount = (
      await createAccount(connection, testUser.id, {
        type: AccountType.cash,
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

  describe('performTransaction', () => {
    const getTransactionPair = async (operationId: string) => {
      const [transaction, rootTransaction] = await getRepository(
        Transaction,
      ).find({
        operationId,
      });
      return { transaction, rootTransaction };
    };

    const staticArray = Array.from(Array(5).keys());
    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];
    let testTransaction: Transaction;
    let rootTransaction: Transaction;

    beforeAll(async () => {
      const transactionHelper = new TransactionHelper(testUser);

      for (const _ of staticArray) {
        const [transaction] = await transactionHelper.performTransaction(
          transactionFactory(),
          testAccount,
        );

        testTransactions.push(transaction);
        testAmounts.push(transaction.amount);
      }
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

    staticArray.forEach((_, idx) => {
      describe(`transaction ${idx}`, () => {
        beforeAll(async () => {
          const transactions = await getTransactionPair(
            testTransactions[idx].operationId,
          );

          testTransaction = transactions.transaction;
          rootTransaction = transactions.rootTransaction;
        });

        it('should create transaction pairs', async () => {
          expect(testTransaction).toBeDefined();
          expect(rootTransaction).toBeDefined();
        });

        it('should have correct values', async () => {
          const expectedBalance =
            testInitialBalance +
            testAmounts
              .slice(0, idx + 1)
              .reduce((accum, curr) => accum + curr, 0);

          expect(testTransaction.resultantBalance).toBe(expectedBalance);
          expect(rootTransaction.resultantBalance).toBe(-expectedBalance);
        });
      });
    });
  });

  describe('delete', () => {
    const staticArray = Array.from(Array(5).keys());
    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];
    let transactionHelper: TransactionHelper;

    beforeAll(async () => {
      testUser = (await createUser(connection)).databaseUser;

      transactionHelper = new TransactionHelper(testUser);

      testRootAccount = await getRepository(Account).findOneOrFail({
        userId: testUser.id,
        type: 'root',
      });

      testAccount = (
        await createAccount(connection, testUser.id, {
          initialBalance: testInitialBalance,
        })
      ).databaseAccount;

      for (const _ of staticArray) {
        const [transaction] = await transactionHelper.performTransaction(
          transactionFactory(),
          testAccount,
        );

        testTransactions.push(transaction);
        testAmounts.push(transaction.amount);
      }
    });

    describe('delete transaction', () => {
      let toDeleteTransaction: Transaction;

      beforeAll(async () => {
        const sampleTransaction = testTransactions[testTransactions.length - 1];

        toDeleteTransaction = await connection
          .getRepository(Transaction)
          .findOneOrFail({
            where: { id: sampleTransaction.id },
            relations: ['account'],
          });

        await transactionHelper.revertTransaction(toDeleteTransaction);
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
