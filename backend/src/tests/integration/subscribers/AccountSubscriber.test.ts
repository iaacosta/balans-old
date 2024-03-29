/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { createConnection, Connection, Repository, In } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import { seedTestDatabase, createPgClient } from '../../utils';
import Account from '../../../models/Account';
import {
  accountModelFactory,
  createAccount,
} from '../../factory/accountFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import Transaction from '../../../models/Transaction';
import { createTransaction } from '../../factory/transactionFactory';
import { createCategoryPair } from '../../factory/categoryFactory';
import { Currency } from '../../../graphql/helpers/enums/currencyEnum';

describe('account ORM tests', () => {
  let connection: Connection;
  let repo: Repository<Account>;
  let testUser: User;
  let testRootAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    repo = connection.getRepository(Account);
    await pgClient.connect();

    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection)).databaseUser;

    testRootAccount = await connection.getRepository(Account).findOneOrFail({
      userId: testUser.id,
      type: 'root',
      currency: Currency.CLP,
    });
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('subscribers', () => {
    describe('create', () => {
      it('should call validateOrReject on save', async () => {
        const { account } = accountModelFactory(testUser.id, { name: '' });
        await expect(repo.save(account)).rejects.toThrow(ApolloError);
      });

      it('should not allow two root type accounts with same currency', async () => {
        const { account } = accountModelFactory(testUser.id, { type: 'root', currency: Currency.CLP });
        await expect(repo.save(account)).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('should call validateOrReject on update', async () => {
        const { databaseAccount } = await createAccount(
          connection,
          testUser.id,
        );
        const testAccount = (await repo.findOne(databaseAccount.id)) as Account;
        expect(testAccount).toBeDefined();
        testAccount.name = '';
        await expect(repo.save(testAccount)).rejects.toThrow(ApolloError);
      });

      it('should not allow two root type accounts', async () => {
        const { databaseAccount } = await createAccount(
          connection,
          testUser.id,
        );
        const testAccount = (await repo.findOne(databaseAccount.id)) as Account;
        expect(testAccount).toBeDefined();
        testAccount.type = 'root';
        await expect(repo.save(testAccount)).rejects.toThrow();
      });
    });

    describe('remove', () => {
      describe('with transactions', () => {
        const operations: string[] = [];
        let testAccount: Account;

        beforeAll(async () => {
          testUser = (await createUser(connection)).databaseUser;

          testRootAccount = await connection
            .getRepository(Account)
            .findOneOrFail({
              userId: testUser.id,
              type: 'root',
              currency: Currency.CLP,
            });

          testAccount = (await createAccount(connection, testUser.id))
            .databaseAccount;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const _ of Array.from(Array(5).keys())) {
            const { operationId } = (
              await createTransaction(connection, {
                account: testAccount,
                categories: await createCategoryPair(connection, testUser.id),
              })
            ).databaseTransaction;

            operations.push(operationId);
          }

          await connection.getRepository(Account).remove(testAccount);
        });

        it('should delete all related root account transactions', async () => {
          const transactions = await connection
            .getRepository(Transaction)
            .find({
              operationId: In(operations),
              accountId: testRootAccount.id,
            });

          expect(transactions).toHaveLength(0);
        });

        it('should have correct balance after deletion', async () => {
          const refreshedRootAccount = await connection
            .getRepository(Account)
            .findOneOrFail(testRootAccount.id);

          expect(refreshedRootAccount.balance).toBe(0);
        });
      });

      describe('without transactions', () => {
        let testAccount: Account;

        beforeAll(async () => {
          testUser = (await createUser(connection)).databaseUser;

          testRootAccount = await connection
            .getRepository(Account)
            .findOneOrFail({
              userId: testUser.id,
              type: 'root',
              currency: Currency.CLP,
            });

          testAccount = (
            await createAccount(connection, testUser.id, { initialBalance: 0 })
          ).databaseAccount;

          await connection.getRepository(Account).remove(testAccount);
        });

        it('should have correct balance after deletion', async () => {
          const refreshedRootAccount = await connection
            .getRepository(Account)
            .findOneOrFail(testRootAccount.id);

          expect(refreshedRootAccount.balance).toBe(0);
        });
      });
    });
  });
});
