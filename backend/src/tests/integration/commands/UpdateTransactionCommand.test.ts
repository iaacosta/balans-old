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
import { AccountType, CategoryType } from '../../../graphql/helpers';
import UpdateTransactionCommand from '../../../commands/UpdateTransactionCommand';
import SaveTransactionCommand from '../../../commands/SaveTransactionCommand';
import {
  createCategoryPair,
  createCategory,
} from '../../factory/categoryFactory';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;
  let testCategories: CategoryPair;

  let toUpdateTransaction: Transaction;
  const staticArray = Array.from(Array(5).keys());
  const testTransactions: Transaction[] = [];
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
    testCategories = await createCategoryPair(connection, testUser.id);
    testRootAccount = await getRepository(Account).findOneOrFail({
      userId: testUser.id,
      type: 'root',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of staticArray) {
      const { factoryTransaction, category } = transactionModelFactory({
        account: testAccount,
        categories: testCategories,
      });

      const command = new SaveTransactionCommand(testUser, {
        account: testAccount,
        category,
        ...factoryTransaction,
      });

      const [transaction] = await command.execute();
      testTransactions.push(transaction);
      testAmounts.push(transaction.amount);
    }
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  const getTransactionToUpdate = () =>
    connection.getRepository(Transaction).findOneOrFail({
      where: { id: testTransactions[testTransactions.length - 1].id },
      relations: ['account'],
    });

  describe('same account', () => {
    describe('amount changes', () => {
      let toChange: { amount: number };

      beforeAll(async () => {
        toChange = { amount: transactionFactory().amount };
        toUpdateTransaction = await getTransactionToUpdate();

        const command = new UpdateTransactionCommand(testUser, {
          transaction: toUpdateTransaction,
          ...toChange,
        });

        await command.execute();
      });

      it('should update transactions', async () => {
        const transaction = await getRepository(Transaction).findOne(
          toUpdateTransaction.id,
        );

        expect(transaction).toBeDefined();
        expect(transaction!.amount).toBe(toChange.amount);

        const pairedTransaction = await transaction?.getPairedTransaction();

        expect(pairedTransaction).toBeDefined();
        expect(pairedTransaction!.amount).toBe(-toChange.amount);
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
          (toChange.amount - testAmounts[testAmounts.length - 1]);

        expect(refreshedAccount.balance).toBe(expectedBalance);
        expect(refreshedRootAccount.balance).toBe(-expectedBalance);
      });
    });

    describe('memo changes', () => {
      let toChange: { memo: string };

      beforeAll(async () => {
        toChange = { memo: 'changed' };
        toUpdateTransaction = await getTransactionToUpdate();
        const command = new UpdateTransactionCommand(testUser, {
          transaction: toUpdateTransaction,
          ...toChange,
        });

        await command.execute();
      });

      it('should update transactions', async () => {
        const transaction = await getRepository(Transaction).findOne(
          toUpdateTransaction.id,
        );

        const pairedTransaction = await getRepository(Transaction).findOne({
          operationId: toUpdateTransaction.operationId,
          accountId: testRootAccount.id,
        });

        expect(transaction).toBeDefined();
        expect(transaction!.memo).toBe(toChange.memo);

        expect(pairedTransaction).toBeDefined();
        expect(pairedTransaction!.memo).toBe(toChange.memo?.concat(' (root)'));
      });
    });

    describe('category changes', () => {
      let toChange: { categoryId: number };

      beforeAll(async () => {
        toUpdateTransaction = await getTransactionToUpdate();

        toChange = {
          categoryId: (
            await createCategory(connection, testUser.id, {
              type:
                toUpdateTransaction.amount > 0
                  ? CategoryType.income
                  : CategoryType.expense,
            })
          ).databaseCategory.id,
        };

        const command = new UpdateTransactionCommand(testUser, {
          transaction: toUpdateTransaction,
          ...toChange,
        });

        await command.execute();
      });

      it('should update transactions', async () => {
        const transaction = await getRepository(Transaction).findOne(
          toUpdateTransaction.id,
        );

        expect(transaction).toBeDefined();
        expect(transaction!.categoryId).toBe(toChange.categoryId);
      });
    });

    describe('issuedAt changes', () => {
      let toChange: { issuedAt: Date };

      beforeAll(async () => {
        toChange = { issuedAt: new Date() };
        toUpdateTransaction = await getTransactionToUpdate();
        const command = new UpdateTransactionCommand(testUser, {
          transaction: toUpdateTransaction,
          ...toChange,
        });

        await command.execute();
      });

      it('should update transactions', async () => {
        const transaction = await getRepository(Transaction).findOne(
          toUpdateTransaction.id,
        );

        expect(transaction).toBeDefined();
        expect(transaction!.issuedAt).toEqual(toChange.issuedAt);
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
      toUpdateTransaction = await getTransactionToUpdate();

      const command = new UpdateTransactionCommand(testUser, {
        transaction: toUpdateTransaction,
        ...toChange,
      });

      await command.execute();
    });

    it('should update transactions', async () => {
      const transaction = await getRepository(Transaction).findOne(
        toUpdateTransaction.id,
      );

      const pairedTransaction = await getRepository(Transaction).findOne({
        operationId: toUpdateTransaction.operationId,
        accountId: testRootAccount.id,
      });

      expect(transaction).toBeDefined();
      expect(transaction!.amount).toBe(toChange.amount);
      expect(transaction!.accountId).toBe(toChange.accountId);
      expect(transaction!.memo).toBe(toChange.memo);

      expect(pairedTransaction).toBeDefined();
      expect(pairedTransaction!.amount).toBe(-toChange.amount);
      expect(pairedTransaction!.memo).toBe(toChange.memo?.concat(' (root)'));
    });

    it('should update account balances', async () => {
      const otherRefreshedAccount = await getRepository(Account).findOneOrFail(
        otherAccount.id,
      );

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
        -(2 * testInitialBalance + transactionEffect + updateEffect),
      );
    });
  });
});
