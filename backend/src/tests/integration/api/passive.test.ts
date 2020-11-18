import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Passive from '../../../models/Passive';
import { createPassive, passiveFactory } from '../../factory/passiveFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';
import { AccountType } from '../../../graphql/helpers';

const CREATE_PASSIVE = gql`
  mutation CreatePassive($input: CreatePassiveInput!) {
    createPassive(input: $input) {
      id
      amount
      memo
      operationId
      liquidated
      account {
        id
      }
      liquidatedAccount {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

const LIQUIDATE_PASSIVE = gql`
  mutation LiquidatePassive($input: LiquidatePassiveInput!) {
    liquidatePassive(input: $input) {
      id
      amount
      memo
      operationId
      liquidated
      account {
        id
      }
      liquidatedAccount {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

describe('passive API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    testUser = (await createUser(connection)).databaseUser;

    testAccount = (
      await createAccount(connection, testUser.id, {
        type: AccountType.checking,
      })
    ).databaseAccount;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('createPassive', () => {
    it('should create passive', async () => {
      const testPassive = passiveFactory();

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: CREATE_PASSIVE,
        variables: {
          input: {
            ...testPassive,
            issuedAt: testPassive.issuedAt.valueOf(),
            accountId: testAccount.id,
          },
        },
      });

      expect(response).toBeSuccessful();

      const passive = await getRepository(Passive).findOneOrFail(
        response.data!.createPassive.id,
      );

      expect(passive.amount).toBe(testPassive.amount);
    });

    it('should not authorize unauthenticated users', async () => {
      const testPassive = passiveFactory();

      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: CREATE_PASSIVE,
        variables: {
          input: {
            ...testPassive,
            issuedAt: testPassive.issuedAt.valueOf(),
            accountId: testAccount.id,
          },
        },
      });

      expect(response).toBeRejectedByAuth();
    });
  });

  describe('liquidatePassive', () => {
    let testPassive: Passive;

    beforeAll(async () => {
      testPassive = (await createPassive(connection, { account: testAccount }))
        .databasePassive;
    });

    it('should liquidate passive', async () => {
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: LIQUIDATE_PASSIVE,
        variables: {
          input: { id: testPassive.id, liquidatedAccountId: testAccount.id },
        },
      });

      expect(response).toBeSuccessful();

      const passive = await getRepository(Passive).findOneOrFail(
        response.data!.liquidatePassive.id,
      );

      expect(passive.liquidatedAccountId).toBe(testAccount.id);
    });

    it('should not authorize unauthenticated users', async () => {
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: LIQUIDATE_PASSIVE,
        variables: {
          input: { id: testPassive.id, liquidatedAccountId: testAccount.id },
        },
      });

      expect(response).toBeRejectedByAuth();
    });
  });
});
