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
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';

describe('transaction ORM tests', () => {
  const testInitialBalance = 1000;

  let connection: Connection;
  let repo: Repository<Transaction>;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    repo = connection.getRepository(Transaction);
    await pgClient.connect();
  });

  beforeAll(async () => {
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

  describe('subscribers', () => {
    describe('create', () => {
      it('should call validateOrReject on save', async () => {
        const { transaction } = transactionModelFactory(testAccount, {
          amount: -2 * testInitialBalance,
        });

        await expect(repo.save(transaction)).rejects.toThrowError(
          UserInputError,
        );
      });

      describe("multiple transactions' balance", () => {
        const getTransactionPair = (operationId: string) =>
          getRepository(Transaction).find({ operationId });

        const staticArray = Array.from(Array(5).keys());
        const testTransactions: Transaction[] = [];
        const testAmounts: number[] = [];
        let testTransaction: Transaction;
        let rootTransaction: Transaction;

        beforeAll(async () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const _ of staticArray) {
            const transaction = (
              await createTransaction(connection, testAccount)
            ).databaseTransaction;

            testTransactions.push(transaction);
            testAmounts.push(transaction.amount);
          }
        });

        it('should change account balances', async () => {
          const refreshedAccount = await getRepository(Account).findOneOrFail(
            testAccount.id,
          );

          const refreshedRootAccount = await getRepository(
            Account,
          ).findOneOrFail(testRootAccount.id);

          const expectedBalance =
            testInitialBalance +
            testAmounts.reduce((accum, curr) => accum + curr, 0);

          expect(refreshedAccount.balance).toBe(expectedBalance);
          expect(refreshedRootAccount.balance).toBe(-expectedBalance);
        });

        staticArray.forEach((_, idx) => {
          describe(`transaction ${idx}`, () => {
            beforeAll(async () => {
              [rootTransaction, testTransaction] = await getTransactionPair(
                testTransactions[idx].operationId,
              );
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
    });

    describe('delete', () => {
      const staticArray = Array.from(Array(5).keys());
      const testTransactions: Transaction[] = [];
      const testAmounts: number[] = [];

      beforeAll(async () => {
        testUser = (await createUser(connection)).databaseUser;

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
          const transaction = (await createTransaction(connection, testAccount))
            .databaseTransaction;

          testTransactions.push(transaction);
          testAmounts.push(transaction.amount);
        }
      });

      describe('delete transaction', () => {
        let toDeleteTransaction: Transaction;

        beforeAll(async () => {
          toDeleteTransaction = testTransactions[testTransactions.length - 1];
          await connection
            .getRepository(Transaction)
            .remove(toDeleteTransaction);
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

          const refreshedRootAccount = await getRepository(
            Account,
          ).findOneOrFail(testRootAccount.id);

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
});
