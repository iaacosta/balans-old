import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import {
  transactionFactory,
  createTransaction,
} from '../../factory/transactionFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';

const MY_TRANSACTIONS = gql`
  query MyTransactions {
    transactions: myTransactions {
      id
      amount
      memo
      account {
        id
        name
        bank
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      memo
      account {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

describe('transaction API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let transactions: Transaction[];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testAccount = (await createAccount(connection, testUser.id))
      .databaseAccount;

    transactions = await Promise.all(
      Array.from(Array(5).keys()).map(() =>
        createTransaction(connection, testAccount).then(
          ({ databaseTransaction }) => databaseTransaction,
        ),
      ),
    );
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('myTransactions', () => {
    it('should get correct transactions for the user', async () => {
      const { query } = await mountTestClient({ currentUser: testUser });
      const response = await query({ query: MY_TRANSACTIONS });
      expect(response).toBeSuccessful();
      /* created transactions + initial balance */
      expect(response.data!.transactions).toHaveLength(transactions.length + 1);
      const transactionsById = keyBy(response.data!.transactions, 'id');
      transactions.forEach((account) =>
        expect(transactionsById[account.id].id).toBe(`${account.id}`),
      );
    });

    it('should not authorize unauthenticated users', async () => {
      const { query } = await mountTestClient();
      const response = await query({ query: MY_TRANSACTIONS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('createTransaction', () => {
    it('should create transaction', async () => {
      const testTransaction = transactionFactory();
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

    it('should not authorize unauthenticated users', async () => {
      const testTransaction = transactionFactory();
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input: { ...testTransaction, accountId: testAccount.id } },
      });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('deleteTransaction', () => {
    it('should delete an transaction if mine', async () => {
      const createdTransaction = (
        await createTransaction(connection, testAccount)
      ).databaseTransaction;

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_TRANSACTION,
        variables: { id: createdTransaction.id },
      });

      expect(response).toBeSuccessful();

      await expect(
        getRepository(Transaction).findOneOrFail(
          response.data!.deleteTransaction,
        ),
      ).rejects.toBeTruthy();
    });

    it('should not delete an transaction if not mine', async () => {
      const otherUser = (await createUser(connection)).databaseUser;
      const othersAccount = (await createAccount(connection, otherUser.id))
        .databaseAccount;
      const othersTransaction = (
        await createTransaction(connection, othersAccount)
      ).databaseTransaction;

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_TRANSACTION,
        variables: { id: othersTransaction.id },
      });

      expect(response).toBeRejected();
    });
  });
});
