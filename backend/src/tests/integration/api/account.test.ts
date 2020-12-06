import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Account from '../../../models/Account';
import { createAccount, accountFactory } from '../../factory/accountFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import Transaction from '../../../models/Transaction';

const MY_ACCOUNTS = gql`
  query MyAccounts {
    accounts: myAccounts {
      id
      name
      bank
      type
      user {
        id
        name
        email
        username
        role
        createdAt
        updatedAt
        deletedAt
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      bank
      type
      user {
        id
        name
        email
        username
        role
        createdAt
        updatedAt
        deletedAt
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: ID!) {
    deleteAccount(id: $id)
  }
`;

describe('account API calls', () => {
  let connection: Connection;
  let testUser: User;
  let accounts: Account[];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection)).databaseUser;
    const untrackableUser = (await createUser(connection)).databaseUser;

    accounts = await Promise.all(
      Array.from(Array(4).keys()).map(() =>
        createAccount(connection, testUser.id).then(
          ({ databaseAccount }) => databaseAccount,
        ),
      ),
    );

    await Promise.all(
      Array.from(Array(4).keys()).map(() =>
        createAccount(connection, untrackableUser.id).then(
          ({ databaseAccount }) => databaseAccount,
        ),
      ),
    );
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('myAccounts', () => {
    it('should get correct accounts for the user', async () => {
      const { query } = await mountTestClient({ currentUser: testUser });
      const response = await query({ query: MY_ACCOUNTS });
      expect(response).toBeSuccessful();
      expect(response.data!.accounts).toHaveLength(accounts.length);
      const accountsById = keyBy(response.data!.accounts, 'id');
      accounts.forEach((account) =>
        expect(accountsById[account.id].id).toBe(`${account.id}`),
      );
    });

    it('should not authorize unauthenticated users', async () => {
      const { query } = await mountTestClient();
      const response = await query({ query: MY_ACCOUNTS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('createAccount', () => {
    it('should create account', async () => {
      const testAccount = accountFactory();
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_ACCOUNT,
        variables: { input: testAccount },
      });

      expect(response).toBeSuccessful();
      const createdAccount = await getRepository(Account).findOneOrFail(
        response.data!.createAccount.id,
      );
      expect(createdAccount.name).toBe(testAccount.name);
    });

    it('should create account with initial balance 0', async () => {
      const testAccount = accountFactory({ initialBalance: 0 });
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_ACCOUNT,
        variables: { input: testAccount },
      });

      expect(response).toBeSuccessful();
      const createdAccount = await getRepository(Account).findOneOrFail(
        response.data!.createAccount.id,
      );
      expect(createdAccount.name).toBe(testAccount.name);
    });

    it('should create two transactions with initial balance', async () => {
      const initialBalance = 1000;
      const testAccount = accountFactory({ initialBalance });
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_ACCOUNT,
        variables: { input: testAccount },
      });

      expect(response).toBeSuccessful();

      const rootAccount = await getRepository(Account).findOneOrFail({
        type: 'root',
        userId: testUser.id,
      });

      const transaction = await getRepository(Transaction).findOne({
        amount: initialBalance,
        accountId: response.data!.createAccount.id,
      });

      expect(transaction).toBeDefined();
      expect(transaction!.amount).toBe(initialBalance);

      const rootTransaction = await getRepository(Transaction).findOne({
        amount: -initialBalance,
        operationId: transaction!.operationId,
        accountId: rootAccount.id,
      });

      expect(rootTransaction).toBeDefined();
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account if mine', async () => {
      const createdAccount = (await createAccount(connection, testUser.id))
        .databaseAccount;

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_ACCOUNT,
        variables: { id: createdAccount.id },
      });

      expect(response).toBeSuccessful();
      await expect(
        getRepository(Account).findOneOrFail(response.data!.deleteAccount),
      ).rejects.toBeTruthy();
    });

    it('should not delete an account if root', async () => {
      const rootAccount = await testUser.getRootAccount();

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_ACCOUNT,
        variables: { id: rootAccount.id },
      });

      expect(response).toBeRejected();
    });

    it('should not delete an account if not mine', async () => {
      const otherUser = (await createUser(connection)).databaseUser;
      const createdAccount = (await createAccount(connection, otherUser.id))
        .databaseAccount;

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_ACCOUNT,
        variables: { id: createdAccount.id },
      });

      expect(response).toBeRejected();
    });
  });
});
