import { createConnection, Connection, getRepository, In } from 'typeorm';
import { gql } from 'apollo-server-express';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Transfer from '../../../models/Transfer';
import { transferFactory } from '../../factory/transferFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';

const CREATE_TRANSFER = gql`
  mutation CreateTransfer($input: CreateTransferInput!) {
    createTransfer(input: $input) {
      id
      amount
      memo
      operationId
      account {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

describe('transfer API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testFromAccount: Account;
  let testToAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testFromAccount = (
      await createAccount(connection, testUser.id, { initialBalance: 20000 })
    ).databaseAccount;
    testToAccount = (await createAccount(connection, testUser.id))
      .databaseAccount;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('createTransfer', () => {
    it('should create transfer', async () => {
      const testTransfer = transferFactory();

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_TRANSFER,
        variables: {
          input: {
            ...testTransfer,
            fromAccountId: testFromAccount.id,
            toAccountId: testToAccount.id,
          },
        },
      });

      expect(response).toBeSuccessful();

      const [fromTransfer, toTransfer] = await getRepository(Transfer).find({
        id: In(response.data!.createTransfer.map(({ id }: any) => id)),
      });

      expect(fromTransfer.amount).toBe(-testTransfer.amount);
      expect(toTransfer.amount).toBe(testTransfer.amount);
    });

    it('should not authorize unauthenticated users', async () => {
      const testTransfer = transferFactory();

      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: CREATE_TRANSFER,
        variables: {
          input: {
            ...testTransfer,
            fromAccountId: testFromAccount.id,
            toAccountId: testToAccount.id,
          },
        },
      });

      expect(response).toBeRejectedByAuth();
    });
  });
});
