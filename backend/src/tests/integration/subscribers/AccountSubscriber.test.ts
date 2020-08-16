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
  });
});
