import { createConnection, Connection, getRepository, In } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Transfer from '../../../models/Transfer';
import { transferFactory, createTransfer } from '../../factory/transferFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';
import { AccountType } from '../../../graphql/helpers';

const MY_TRANSFERS = gql`
  query MyTransfers {
    transfers: myTransfers {
      id
      amount
      memo
      operationId
      account {
        id
        name
        bank
      }
      createdAt
      updatedAt
    }
  }
`;

const MY_PAIRED_TRANSFERS = gql`
  query MyTransfers {
    transfers: myPairedTransfers {
      from {
        id
        amount
        memo
        operationId
        account {
          id
          name
        }
        createdAt
        updatedAt
      }
      to {
        id
        amount
        memo
        operationId
        account {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

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

const DELETE_TRANSFER = gql`
  mutation DeleteTransfer($operationId: String!) {
    deleteTransfer(operationId: $operationId)
  }
`;

describe('transfer API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testFromAccount: Account;
  let testToAccount: Account;
  let testTransfers: Transfer[];
  let testPairedTransfers: { to: Transfer; from: Transfer }[];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;

    testFromAccount = (
      await createAccount(connection, testUser.id, {
        type: AccountType.checking,
      })
    ).databaseAccount;

    testToAccount = (await createAccount(connection, testUser.id))
      .databaseAccount;

    const staticArray = Array.from(Array(5).keys());
    testPairedTransfers = await Promise.all(
      staticArray.map(() =>
        createTransfer(connection, {
          fromAccount: testFromAccount,
          toAccount: testToAccount,
        }).then(({ toDatabaseTransfer, fromDatabaseTransfer }) => ({
          to: toDatabaseTransfer,
          from: fromDatabaseTransfer,
        })),
      ),
    );

    testTransfers = testPairedTransfers
      .map(({ to, from }) => [from, to])
      .flat();

    const { databaseUser: otherUser } = await createUser(connection);
    const { databaseAccount: otherFromAccount } = await createAccount(
      connection,
      otherUser.id,
      {
        type: AccountType.checking,
      },
    );

    const { databaseAccount: otherToAccount } = await createAccount(
      connection,
      otherUser.id,
    );

    await Promise.all(
      Array.from(Array(4).keys()).map(() =>
        createTransfer(connection, {
          fromAccount: otherFromAccount,
          toAccount: otherToAccount,
        }),
      ),
    );
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('myTransfers', () => {
    it('should get correct transfers for the user', async () => {
      const { query } = await mountTestClient({ currentUser: testUser });
      const response = await query({ query: MY_TRANSFERS });
      expect(response).toBeSuccessful();

      expect(response.data!.transfers).toHaveLength(testTransfers.length);

      const transfersById = keyBy(response.data!.transfers, 'id');
      testTransfers.forEach((transfer) =>
        expect(transfersById[transfer.id].id).toBe(`${transfer.id}`),
      );
    });

    it('should not authorize unauthenticated users', async () => {
      const { query } = await mountTestClient();
      const response = await query({ query: MY_TRANSFERS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('myPairedTransfers', () => {
    it('should get correct paired transfers for the user', async () => {
      const { query } = await mountTestClient({ currentUser: testUser });
      const response = await query({ query: MY_PAIRED_TRANSFERS });
      expect(response).toBeSuccessful();

      expect(response.data!.transfers).toHaveLength(testPairedTransfers.length);

      const transfersByOperationId = keyBy(
        response.data!.transfers,
        (transferPair) => transferPair.from.operationId,
      );

      testPairedTransfers.forEach(({ from, to }) => {
        const { operationId } = from;
        expect(transfersByOperationId[operationId].from.id).toBe(`${from.id}`);
        expect(transfersByOperationId[operationId].to.id).toBe(`${to.id}`);
      });
    });

    it('should not authorize unauthenticated users', async () => {
      const { query } = await mountTestClient();
      const response = await query({ query: MY_PAIRED_TRANSFERS });
      expect(response).toBeRejectedByAuth();
    });
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

  describe('deleteTransfer', () => {
    it('should delete a transfer if mine', async () => {
      const { fromDatabaseTransfer } = await createTransfer(
        connection,
        { fromAccount: testFromAccount, toAccount: testToAccount },
        { amount: 100 },
      );

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_TRANSFER,
        variables: { operationId: fromDatabaseTransfer.operationId },
      });

      expect(response).toBeSuccessful();

      await expect(
        getRepository(Transfer).findOneOrFail(response.data!.deleteTransfer),
      ).rejects.toBeTruthy();
    });

    it('should not delete a transfer if not mine', async () => {
      const { databaseUser: otherUser } = await createUser(connection);
      const { databaseAccount: otherFromAccount } = await createAccount(
        connection,
        otherUser.id,
        {
          type: AccountType.checking,
        },
      );

      const { databaseAccount: otherToAccount } = await createAccount(
        connection,
        otherUser.id,
        {
          type: AccountType.checking,
        },
      );

      const { fromDatabaseTransfer } = await createTransfer(connection, {
        fromAccount: otherFromAccount,
        toAccount: otherToAccount,
      });

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_TRANSFER,
        variables: { operationId: fromDatabaseTransfer.operationId },
      });

      expect(response).toBeRejected();
    });
  });
});
