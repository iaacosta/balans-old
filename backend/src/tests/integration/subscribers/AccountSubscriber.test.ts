import { createConnection, Connection, Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';

import { seedTestDatabase, createPgClient } from '../../utils';
import Account from '../../../models/Account';
import {
  accountModelFactory,
  createAccount,
} from '../../factory/accountFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createTransaction } from '../../factory/transactionFactory';
import Transaction from '../../../models/Transaction';

describe('account ORM tests', () => {
  let connection: Connection;
  let repo: Repository<Account>;
  let user: User;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    repo = connection.getRepository(Account);
    await pgClient.connect();
  });

  beforeEach(async () => {
    await seedTestDatabase(pgClient);
    user = (await createUser(connection)).databaseUser;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('subscribers', () => {
    describe('create', () => {
      it('should call validateOrReject on save', async () => {
        const { account } = accountModelFactory(user.id, { name: '' });
        await expect(repo.save(account)).rejects.toThrowError(UserInputError);
      });

      it('should not allow two root type accounts', async () => {
        const { account } = accountModelFactory(user.id, { type: 'root' });
        await expect(repo.save(account)).rejects.toThrowError();
      });
    });

    describe('update', () => {
      it('should call validateOrReject on update', async () => {
        const { databaseAccount } = await createAccount(connection, user.id);
        const testAccount = (await repo.findOne(databaseAccount.id)) as Account;
        expect(testAccount).toBeDefined();
        testAccount.name = '';
        await expect(repo.save(testAccount)).rejects.toThrowError(
          UserInputError,
        );
      });

      it('should not allow two root type accounts', async () => {
        const { databaseAccount } = await createAccount(connection, user.id);
        const testAccount = (await repo.findOne(databaseAccount.id)) as Account;
        expect(testAccount).toBeDefined();
        testAccount.type = 'root';
        await expect(repo.save(testAccount)).rejects.toThrowError();
      });
    });

    describe('remove', () => {
      it('should create a closure transaction for root account', async () => {
        const testAmount = 1000;
        const { databaseAccount } = await createAccount(connection, user.id, {
          initialBalance: testAmount,
        });

        const { databaseTransaction } = await createTransaction(
          connection,
          databaseAccount,
          { amount: testAmount },
        );

        await expect(repo.remove(databaseAccount)).resolves.toBeDefined();

        const transactions = await connection
          .getRepository(Transaction)
          .find({ operationId: databaseTransaction.operationId });

        expect(transactions).toHaveLength(0);
      });
    });
  });
});
