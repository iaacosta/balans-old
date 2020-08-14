import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Account from '../../../models/Account';
import { buildAccount, createAccount } from '../../factory/accountFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';

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
        createAccount(connection, untrackableUser.id),
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
      const testAccount = buildAccount();
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
  });
});
