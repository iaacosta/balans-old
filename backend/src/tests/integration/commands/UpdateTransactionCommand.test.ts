/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

import { forEach, times, values } from 'lodash';
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
import { Currency } from '../../../graphql/helpers/enums/currencyEnum';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testCategories: CategoryPair;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    // TODO: remove this when objective is finished
    process.env.ALLOW_CURRENCIES = 'true';
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  beforeEach(async () => {
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testCategories = await createCategoryPair(connection, testUser.id);
  });

  forEach([Currency.CLP], (currency) => {
    describe(`${currency}`, () => {
      let testAccount: Account;
      let testAmounts: number[];
      let testTransactions: Transaction[];

      let toUpdateTransaction: Transaction;

      const getTransactionToUpdate = (transaction: Transaction[]) =>
        connection.getRepository(Transaction).findOneOrFail({
          where: { id: transaction[transaction.length - 1].id },
          relations: ['account'],
        });

      beforeEach(async () => {
        testAmounts = [];
        testTransactions = [];
        testAccount = (
          await createAccount(connection, testUser.id, {
            initialBalance: testInitialBalance,
            type: AccountType.checking,
            currency,
          })
        ).databaseAccount;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of times(2)) {
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

      describe('same account', () => {
        describe('amount changes', () => {
          let toChange: { amount: number };

          beforeEach(async () => {
            toChange = { amount: transactionFactory().amount };
            toUpdateTransaction = await getTransactionToUpdate(testTransactions);

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
            const refreshedRootAccount = await testUser.getRootAccount(currency);
            const refreshedAccount = await getRepository(Account).findOneOrFail(
              testAccount.id,
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

          beforeEach(async () => {
            toChange = { memo: 'changed' };
            toUpdateTransaction = await getTransactionToUpdate(testTransactions);
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
              accountId: (await testUser.getRootAccount(currency)).id,
            });

            expect(transaction).toBeDefined();
            expect(transaction!.memo).toBe(toChange.memo);

            expect(pairedTransaction).toBeDefined();
            expect(pairedTransaction!.memo).toBe(toChange.memo?.concat(' (root)'));
          });
        });

        describe('category changes', () => {
          let toChange: { categoryId: number };

          beforeEach(async () => {
            toUpdateTransaction = await getTransactionToUpdate(testTransactions);

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

          beforeEach(async () => {
            toChange = { issuedAt: new Date() };
            toUpdateTransaction = await getTransactionToUpdate(testTransactions);
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

        describe('when accounts have same currency', () => {
          beforeEach(async () => {
            otherAccount = (
              await createAccount(connection, testUser.id, {
                initialBalance: testInitialBalance,
                type: AccountType.checking,
                currency,
              })
            ).databaseAccount;

            toChange = { ...transactionFactory(), accountId: otherAccount.id };
            toUpdateTransaction = await getTransactionToUpdate(testTransactions);

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
              accountId: (await testUser.getRootAccount(currency)).id,
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
              (await testUser.getRootAccount(currency)).id,
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

        describe('when accounts have not the same currency', () => {
          it('should throw error', async () => {
            otherAccount = (
              await createAccount(connection, testUser.id, {
                initialBalance: testInitialBalance,
                type: AccountType.checking,
                currency: values(Currency).find((originalCurrency) =>
                  originalCurrency !== currency,
                ),
              })
            ).databaseAccount;

            toChange = { ...transactionFactory(), accountId: otherAccount.id };

            const command = new UpdateTransactionCommand(testUser, {
              transaction: await getTransactionToUpdate(testTransactions),
              ...toChange,
            });

            expect(() => command.execute()).rejects.toBe(true);
          });
        });
      });
    });
  });
});
