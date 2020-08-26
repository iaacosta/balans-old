/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { transactionFactory } from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import TransactionHelper from '../../../helpers/TransactionHelper';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
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
        initialBalance: testInitialBalance,
        type: AccountType.checking,
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const [transaction] = await transactionHelper.performTransaction(
          transactionFactory(),
          testAccount,
        );

        testTransactions.push(transaction);
        testAmounts.push(transaction.amount);
      }
    });

    describe('same account', () => {
      let changed: ReturnType<typeof transactionFactory>;

      beforeAll(async () => {
        changed = transactionFactory();
        const sampleTransaction = testTransactions[testTransactions.length - 1];

        toUpdateTransaction = await connection
          .getRepository(Transaction)
          .findOneOrFail({
            where: { id: sampleTransaction.id },
            relations: ['account'],
          });

        await transactionHelper.updateTransaction(toUpdateTransaction, changed);
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
        expect(transaction!.amount).toBe(changed.amount);
        expect(transaction!.memo).toBe(changed.memo);

        expect(siblingTransaction).toBeDefined();
        expect(siblingTransaction!.amount).toBe(-changed.amount);
        expect(siblingTransaction!.memo).toBe(changed.memo?.concat(' (root)'));
      });

      it('should update account balances', async () => {
        const refreshedAccount = await getRepository(Account).findOneOrFail(
          testAccount.id,
        );

        const refreshedRootAccount = await getRepository(Account).findOneOrFail(
          testRootAccount.id,
        );

        const expectedBalance =
          testInitialBalance +
          testAmounts.reduce((accum, curr) => accum + curr, 0) +
          (changed.amount - testAmounts[testAmounts.length - 1]);

        expect(refreshedAccount.balance).toBe(expectedBalance);
        expect(refreshedRootAccount.balance).toBe(-expectedBalance);
      });
    });

    describe('other account', () => {
      let otherAccount: Account;
      let changed: ReturnType<typeof transactionFactory> & {
        accountId: number;
      };

      beforeAll(async () => {
        otherAccount = (
          await createAccount(connection, testUser.id, {
            initialBalance: testInitialBalance,
            type: AccountType.checking,
          })
        ).databaseAccount;

        changed = { ...transactionFactory(), accountId: otherAccount.id };

        const sampleTransaction = testTransactions[testTransactions.length - 1];
        toUpdateTransaction = await connection
          .getRepository(Transaction)
          .findOneOrFail({
            where: { id: sampleTransaction.id },
            relations: ['account'],
          });

        await transactionHelper.updateTransaction(toUpdateTransaction, changed);
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
        expect(transaction!.amount).toBe(changed.amount);
        expect(transaction!.accountId).toBe(changed.accountId);
        expect(transaction!.memo).toBe(changed.memo);

        expect(siblingTransaction).toBeDefined();
        expect(siblingTransaction!.amount).toBe(-changed.amount);
        expect(siblingTransaction!.memo).toBe(changed.memo?.concat(' (root)'));
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
        const updateEffect = changed.amount - transactionAmount;
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
        const [transaction] = await transactionHelper.performTransaction(
          transactionFactory(),
          testAccount,
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
