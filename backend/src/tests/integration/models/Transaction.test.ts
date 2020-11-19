import { Connection, createConnection } from 'typeorm';
import SaveTransactionCommand from '../../../commands/SaveTransactionCommand';
import { AccountType } from '../../../graphql/helpers';
import Account from '../../../models/Account';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import { createAccount } from '../../factory/accountFactory';
import { transactionFactory } from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createPgClient, seedTestDatabase } from '../../utils';

describe('Transaction model integration tests', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection)).databaseUser;

    testAccount = (
      await createAccount(connection, testUser.id, {
        type: AccountType.cash,
        initialBalance: 0,
      })
    ).databaseAccount;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('getPairedTransaction', () => {
    let testTransaction: Transaction;
    let testPairedTransaction: Transaction;

    beforeAll(async () => {
      const command = new SaveTransactionCommand(testUser, {
        ...transactionFactory(),
        account: testAccount,
      });

      const [transaction, pairedTransaction] = await command.execute();
      testTransaction = transaction;
      testPairedTransaction = pairedTransaction;
    });

    it('should get paired transaction', async () => {
      const pairedTransaction = await testTransaction.getPairedTransaction();
      expect(pairedTransaction).toBeDefined();
      expect(pairedTransaction.id).toBe(testPairedTransaction.id);
      expect(pairedTransaction.amount).toBe(testPairedTransaction.amount);
      expect(pairedTransaction.operationId).toBe(
        testPairedTransaction.operationId,
      );
    });
  });
});
