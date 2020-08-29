/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import Account from '../../../models/Account';
import {
  transactionFactory,
  CategoryPair,
  transactionModelFactory,
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import TransactionHelper from '../../../helpers/TransactionHelper';
import { createCategoryPair } from '../../factory/categoryFactory';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;
  let testCategories: CategoryPair;

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

    testCategories = await createCategoryPair(connection, testUser.id);
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let i = 0; i < staticArray.length; i += 1) {
        const { factoryTransaction, category } = transactionModelFactory({
          account: testAccount,
          categories: testCategories,
        });

        if (i === 0) factoryTransaction.memo = undefined;

        const [transaction] = await transactionHelper.performTransaction(
          factoryTransaction,
          {
            account: testAccount,
            category,
          },
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
          const expectedAmount = testTransactions[idx].amount;

          expect(testTransaction.amount).toBe(expectedAmount);
          expect(rootTransaction.amount).toBe(-expectedAmount);
        });
      });
    });
  });

  describe('updateTransaction', () => {
    const staticArray = Array.from(Array(5).keys());
    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];
    let transactionHelper: TransactionHelper;
    let toUpdateTransaction: Transaction;

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
          type: AccountType.checking,
        })
      ).databaseAccount;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of staticArray) {
        const { factoryTransaction, category } = transactionModelFactory({
          account: testAccount,
          categories: testCategories,
        });

        const [transaction] = await transactionHelper.performTransaction(
          factoryTransaction,
          {
            account: testAccount,
            category,
          },
        );

        testTransactions.push(transaction);
        testAmounts.push(transaction.amount);
      }
    });

    describe('same account', () => {
      describe('amount changes', () => {
        let toChange: { amount: number };

        beforeAll(async () => {
          toChange = { amount: transactionFactory().amount };
          const sampleTransaction =
            testTransactions[testTransactions.length - 1];

          toUpdateTransaction = await connection
            .getRepository(Transaction)
            .findOneOrFail({
              where: { id: sampleTransaction.id },
              relations: ['account'],
            });

          await transactionHelper.updateTransaction(
            toUpdateTransaction,
            toChange,
          );
        });

        it('should update transactions', async () => {
          const transaction = await getRepository(Transaction).findOne(
            toUpdateTransaction.id,
          );

          const siblingTransaction = await getRepository(Transaction).findOne({
            operationId: toUpdateTransaction.operationId,
            accountId: testRootAccount.id,
          });

          expect(transaction).toBeDefined();
          expect(transaction!.amount).toBe(toChange.amount);

          expect(siblingTransaction).toBeDefined();
          expect(siblingTransaction!.amount).toBe(-toChange.amount);
        });

        it('should update account balances', async () => {
          const refreshedAccount = await getRepository(Account).findOneOrFail(
            testAccount.id,
          );

          const refreshedRootAccount = await getRepository(
            Account,
          ).findOneOrFail(testRootAccount.id);

          const expectedBalance =
            testInitialBalance +
            testAmounts.reduce((accum, curr) => accum + curr, 0) +
            (toChange.amount - testAmounts[testAmounts.length - 1]);

          expect(refreshedAccount.balance).toBe(expectedBalance);
          expect(refreshedRootAccount.balance).toBe(-expectedBalance);
        });
      });

      describe('memo changes', () => {
        let toChange: { memo: string };

        beforeAll(async () => {
          toChange = { memo: 'changed' };
          const sampleTransaction =
            testTransactions[testTransactions.length - 1];

          toUpdateTransaction = await connection
            .getRepository(Transaction)
            .findOneOrFail({
              where: { id: sampleTransaction.id },
              relations: ['account'],
            });

          await transactionHelper.updateTransaction(
            toUpdateTransaction,
            toChange,
          );
        });

        it('should update transactions', async () => {
          const transaction = await getRepository(Transaction).findOne(
            toUpdateTransaction.id,
          );

          const siblingTransaction = await getRepository(Transaction).findOne({
            operationId: toUpdateTransaction.operationId,
            accountId: testRootAccount.id,
          });

          expect(transaction).toBeDefined();
          expect(transaction!.memo).toBe(toChange.memo);

          expect(siblingTransaction).toBeDefined();
          expect(siblingTransaction!.memo).toBe(
            toChange.memo?.concat(' (root)'),
          );
        });
      });
    });

    describe('different account', () => {
      let otherAccount: Account;
      let toChange: ReturnType<typeof transactionFactory> & {
        accountId: number;
      };

      beforeAll(async () => {
        otherAccount = (
          await createAccount(connection, testUser.id, {
            initialBalance: testInitialBalance,
            type: AccountType.checking,
          })
        ).databaseAccount;

        toChange = { ...transactionFactory(), accountId: otherAccount.id };

        const sampleTransaction = testTransactions[testTransactions.length - 1];
        toUpdateTransaction = await connection
          .getRepository(Transaction)
          .findOneOrFail({
            where: { id: sampleTransaction.id },
            relations: ['account'],
          });

        await transactionHelper.updateTransaction(
          toUpdateTransaction,
          toChange,
        );
      });

      it('should update transactions', async () => {
        const transaction = await getRepository(Transaction).findOne(
          toUpdateTransaction.id,
        );

        const siblingTransaction = await getRepository(Transaction).findOne({
          operationId: toUpdateTransaction.operationId,
          accountId: testRootAccount.id,
        });

        expect(transaction).toBeDefined();
        expect(transaction!.amount).toBe(toChange.amount);
        expect(transaction!.accountId).toBe(toChange.accountId);
        expect(transaction!.memo).toBe(toChange.memo);

        expect(siblingTransaction).toBeDefined();
        expect(siblingTransaction!.amount).toBe(-toChange.amount);
        expect(siblingTransaction!.memo).toBe(toChange.memo?.concat(' (root)'));
      });

      it('should update account balances', async () => {
        const otherRefreshedAccount = await getRepository(
          Account,
        ).findOneOrFail(otherAccount.id);
        const refreshedAccount = await getRepository(Account).findOneOrFail(
          testAccount.id,
        );
        const refreshedRootAccount = await getRepository(Account).findOneOrFail(
          testRootAccount.id,
        );

        const transactionAmount = testAmounts[testAmounts.length - 1];
        const updateEffect = toChange.amount - transactionAmount;
        const transactionEffect = testAmounts.reduce(
          (accum, curr) => accum + curr,
          0,
        );

        expect(refreshedAccount.balance).toBe(
          testInitialBalance + transactionEffect - transactionAmount,
        );

        expect(otherRefreshedAccount.balance).toBe(
          testInitialBalance + transactionAmount + updateEffect,
        );

        expect(refreshedRootAccount.balance).toBe(
          /* Two times the initial balance because we have two accounts */
          -(2 * testInitialBalance + transactionEffect + updateEffect),
        );
      });
    });
  });

  describe('revertTransaction', () => {
    const staticArray = Array.from(Array(5).keys());
    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];
    let transactionHelper: TransactionHelper;
    let toDeleteTransaction: Transaction;

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
          type: AccountType.checking,
        })
      ).databaseAccount;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of staticArray) {
        const { factoryTransaction, category } = transactionModelFactory({
          account: testAccount,
          categories: testCategories,
        });

        const [transaction] = await transactionHelper.performTransaction(
          factoryTransaction,
          {
            account: testAccount,
            category,
          },
        );

        testTransactions.push(transaction);
        testAmounts.push(transaction.amount);
      }

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
