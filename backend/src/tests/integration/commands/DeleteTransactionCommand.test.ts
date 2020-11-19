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
import DeleteTransactionCommand from '../../../commands/DeleteTransactionCommand';
import { createCategoryPair } from '../../factory/categoryFactory';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testRootAccount: Account;
  let testCategories: CategoryPair;
  let toDeleteTransaction: Transaction;

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

  beforeAll(async () => {
    const sampleTransaction = testTransactions[testTransactions.length - 1];

    toDeleteTransaction = await connection
      .getRepository(Transaction)
      .findOneOrFail({
        where: { id: sampleTransaction.id },
        relations: ['account'],
      });

    const command = new DeleteTransactionCommand(testUser, {
      transaction: toDeleteTransaction,
    });

    await command.execute();
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
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
