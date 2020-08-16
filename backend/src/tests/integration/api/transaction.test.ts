import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import { buildTransaction } from '../../factory/transactionFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      account {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

describe('transaction API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testAccount = await (await createAccount(connection, testUser.id))
      .databaseAccount;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('createTransaction', () => {
    it('should create transaction', async () => {
      const testTransaction = buildTransaction();
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input: { ...testTransaction, accountId: testAccount.id } },
      });

      expect(response).toBeSuccessful();
      const createdTransaction = await getRepository(Transaction).findOneOrFail(
        response.data!.createTransaction.id,
      );
      expect(createdTransaction.amount).toBe(testTransaction.amount);
    });
  });
});
