import { Connection, createConnection, getRepository, In } from 'typeorm';
import { AccountType } from '../../../graphql/helpers';
import Account from '../../../models/Account';
import Transaction from '../../../models/Transaction';
import Movement from '../../../models/Movement';
import User from '../../../models/User';
import { createAccount } from '../../factory/accountFactory';
import {
  createTransaction,
  transactionModelFactory,
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createPgClient, seedTestDatabase } from '../../utils';

describe('Movement model integration tests', () => {
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

  describe('saveMovementPair', () => {
    it('should save transactions', async () => {
      const { transaction } = transactionModelFactory({ account: testAccount });
      const { transaction: otherTransaction } = transactionModelFactory({
        account: testAccount,
      });

      await Movement.saveMovementPair([transaction, otherTransaction]);

      const transactions = await getRepository(Transaction).find({
        operationId: In([
          transaction.operationId,
          otherTransaction.operationId,
        ]),
      });

      expect(transactions).toHaveLength(2);
    });

    it('should match first transaction', async () => {
      const { transaction } = transactionModelFactory({ account: testAccount });
      const [savedTransaction] = await Movement.saveMovementPair([
        transaction,
        transactionModelFactory({ account: testAccount }).transaction,
      ]);

      expect(savedTransaction.amount).toBe(transaction.amount);
      expect(savedTransaction.memo).toBe(transaction.memo);
    });

    it('should match second transaction', async () => {
      const { transaction: otherTransaction } = transactionModelFactory({
        account: testAccount,
      });

      const [, savedTransaction] = await Movement.saveMovementPair([
        transactionModelFactory({ account: testAccount }).transaction,
        otherTransaction,
      ]);

      expect(savedTransaction.amount).toBe(otherTransaction.amount);
      expect(savedTransaction.memo).toBe(otherTransaction.memo);
    });
  });

  describe('removeMovementPair', () => {
    it('should remove transactions', async () => {
      const [transaction, otherTransaction] = await Promise.all([
        createTransaction(connection, { account: testAccount }),
        createTransaction(connection, { account: testAccount }),
      ]);

      await Movement.removeMovementPair([
        transaction.databaseTransaction,
        otherTransaction.databaseTransaction,
      ]);

      const transactions = await getRepository(Transaction).find({
        id: In([
          transaction.databaseTransaction.id,
          otherTransaction.databaseTransaction.id,
        ]),
      });

      expect(transactions).toHaveLength(0);
    });
  });
});
