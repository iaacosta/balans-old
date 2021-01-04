/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

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

const testInitialBalance = 1000;
const amountOfTestTransactions = 5;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testCategories: CategoryPair;
  let testTransaction: Transaction;
  let testRootTransaction: Transaction;

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

  it('should change account balances', async () => {
    const refreshedRootAccount = await testUser.getRootAccount();
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
