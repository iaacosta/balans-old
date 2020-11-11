import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import {
  transactionFactory,
  createTransaction,
  CategoryPair,
  getCategoryForTransaction,
} from '../../factory/transactionFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';
import { createCategoryPair } from '../../factory/categoryFactory';

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
      category {
        id
        name
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
      category {
        id
        name
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
      amount
      memo
      account {
        id
      }
      category {
        id
        name
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
  let testCategories: CategoryPair;
  let transactions: Transaction[];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;
    testAccount = (await createAccount(connection, testUser.id))
      .databaseAccount;

    testCategories = await createCategoryPair(connection, testUser.id);

    transactions = await Promise.all(
      Array.from(Array(5).keys()).map(() =>
        createTransaction(connection, {
          account: testAccount,
          categories: testCategories,
        }).then(({ databaseTransaction }) => databaseTransaction),
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
      const testCategory = getCategoryForTransaction(
        testTransaction,
        testCategories,
      );

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_TRANSACTION,
        variables: {
          input: {
            ...testTransaction,
            issuedAt: testTransaction.issuedAt.valueOf(),
            accountId: testAccount.id,
            categoryId: testCategory.id,
          },
        },
      });

      expect(response).toBeSuccessful();
      const createdTransaction = await getRepository(Transaction).findOneOrFail(
        response.data!.createTransaction.id,
      );
      expect(createdTransaction.amount).toBe(testTransaction.amount);
    });

    it('should not authorize unauthenticated users', async () => {
      const testTransaction = transactionFactory();
      const testCategory = getCategoryForTransaction(
        testTransaction,
        testCategories,
      );

      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: CREATE_TRANSACTION,
        variables: {
          input: {
            ...testTransaction,
            issuedAt: testTransaction.issuedAt.valueOf(),
            accountId: testAccount.id,
            categoryId: testCategory.id,
          },
        },
      });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('updateTransaction', () => {
    let createdTransaction: Transaction;

    beforeAll(async () => {
      createdTransaction = (
        await createTransaction(connection, {
          account: testAccount,
          categories: testCategories,
        })
      ).databaseTransaction;
    });

    it('should update transaction if mine', async () => {
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const { amount, memo } = transactionFactory();
      const response = await mutate({
        mutation: UPDATE_TRANSACTION,
        variables: { input: { id: createdTransaction.id, amount, memo } },
      });

      expect(response).toBeSuccessful();
      const updatedTransaction = await getRepository(Transaction).findOneOrFail(
        response.data!.updateTransaction.id,
      );
      expect(updatedTransaction.amount).toBe(amount);
      expect(updatedTransaction.memo).toBe(memo);
    });

    it('should reject if no changes given', async () => {
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: UPDATE_TRANSACTION,
        variables: { input: { id: createdTransaction.id } },
      });

      expect(response).toBeRejected();
    });

    it('should not authorize if account is not mine', async () => {
      const otherUser = (await createUser(connection)).databaseUser;
      const otherAccount = (await createAccount(connection, otherUser.id))
        .databaseAccount;
      const othersTransaction = (
        await createTransaction(connection, {
          account: otherAccount,
          categories: testCategories,
        })
      ).databaseTransaction;

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const { amount, memo } = transactionFactory();
      const response = await mutate({
        mutation: UPDATE_TRANSACTION,
        variables: { input: { id: othersTransaction.id, amount, memo } },
      });

      expect(response).toBeRejected();
    });
  });

  describe('deleteTransaction', () => {
    it('should delete an transaction if mine', async () => {
      const createdTransaction = (
        await createTransaction(connection, {
          account: testAccount,
          categories: testCategories,
        })
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
        await createTransaction(connection, {
          account: othersAccount,
          categories: testCategories,
        })
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
