import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Account from '../../../models/Account';
import { buildAccount } from '../../factory/accountFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';

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
  let user: User;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);

    user = (await createUser(connection, user)).databaseUser;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('createAccount', () => {
    it('should create account', async () => {
      const testAccount = buildAccount();
      const { mutate } = await mountTestClient({ currentUser: user });
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
