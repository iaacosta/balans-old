/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { createConnection, Connection, getRepository } from 'typeorm';

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
    it('should create a transaction to make up root account with many transactions', async () => {
      const testAccount = (await createAccount(connection, testUser.id))
        .databaseAccount;

      for (const { amount } of Array.from(Array(5).keys()).map(() =>
        transactionFactory(),
      )) {
        await testAccount.performTransaction(amount);
      }

      await getRepository(Account).remove(testAccount);
      const transaction = await getRepository(Transaction).findOne({
        amount: testAccount.balance,
        accountId: testRootAccount.id,
      });

      expect(transaction).toBeDefined();
    });
  });
});
