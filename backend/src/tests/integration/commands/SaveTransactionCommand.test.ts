/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';
import { forEach } from 'lodash';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import Account from '../../../models/Account';
import {
  CategoryPair,
  transactionModelFactory,
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SaveTransactionCommand from '../../../commands/SaveTransactionCommand';
import { createCategoryPair } from '../../factory/categoryFactory';
import { Currency } from '../../../graphql/helpers/enums/currencyEnum';

const testInitialBalance = 1000;
const amountOfTestTransactions = 3;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testCategories: CategoryPair;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    // TODO: remove this when objective is finished
    process.env.ALLOW_CURRENCIES = 'true';
    testUser = (await createUser(connection)).databaseUser;
    testCategories = await createCategoryPair(connection, testUser.id);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  const getTransactionPair = async (operationId: string) => {
    const [transaction, rootTransaction] = await getRepository(
      Transaction,
    ).find({ operationId });

    return { transaction, rootTransaction };
  };

  forEach(Currency, (currency) => {
    let testAccount: Account;
    let testTransaction: Transaction;
    let testRootTransaction: Transaction;

    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];

    describe(`${currency}`, () => {
      beforeAll(async () => {
        testAccount = (
          await createAccount(connection, testUser.id, {
            initialBalance: testInitialBalance,
            type: AccountType.checking,
            currency,
          })
        ).databaseAccount;

        for (let i = 0; i < amountOfTestTransactions; i += 1) {
          const { factoryTransaction, category } = transactionModelFactory({
            account: testAccount,
            categories: testCategories,
          });

          if (i === 0) factoryTransaction.memo = undefined;

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

      it('should change account balances', async () => {
        const refreshedRootAccount = await testUser.getRootAccount(currency);
        const refreshedAccount = await getRepository(Account).findOneOrFail(
          testAccount.id,
        );

        const expectedBalance =
          testInitialBalance + testAmounts.reduce((accum, curr) => accum + curr, 0);

        expect(refreshedAccount.balance).toBe(expectedBalance);
        expect(refreshedRootAccount.balance).toBe(-expectedBalance);
      });

      Array.from(Array(amountOfTestTransactions).keys()).forEach((_, idx) => {
        describe(`transaction ${idx}`, () => {
          beforeAll(async () => {
            const transactions = await getTransactionPair(
              testTransactions[idx].operationId,
            );

            testTransaction = transactions.transaction;
            testRootTransaction = transactions.rootTransaction;
          });

          it('should create transaction pairs', async () => {
            expect(testTransaction).toBeDefined();
            expect(testRootTransaction).toBeDefined();
          });

          it('should have correct root flags', async () => {
            expect(testTransaction.root).toBe(false);
            expect(testRootTransaction.root).toBe(true);
          });

          it('should have correct values', async () => {
            const expectedAmount = testTransactions[idx].amount;
            expect(testTransaction.amount).toBe(expectedAmount);
            expect(testRootTransaction.amount).toBe(-expectedAmount);
          });
        });
      });
    });
  });
});
