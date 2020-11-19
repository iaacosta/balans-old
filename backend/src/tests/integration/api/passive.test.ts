import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import Passive from '../../../models/Passive';
import { createPassive, passiveFactory } from '../../factory/passiveFactory';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import Account from '../../../models/Account';
import { AccountType } from '../../../graphql/helpers';
import LiquidatePassiveCommand from '../../../commands/LiquidatePassiveCommand';

const MY_PASSIVES = gql`
  query MyPassives {
    passives: myPassives {
      id
      amount
      memo
      operationId
      liquidated
      account {
        id
        name
        bank
      }
      liquidatedAccount {
        id
        name
        bank
      }
      createdAt
      updatedAt
    }
  }
`;

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

const DELETE_PASSIVE = gql`
  mutation DeletePassive($id: ID!) {
    deletePassive(id: $id)
  }
`;

describe('passive API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testPassives: Passive[];

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

    testPassives = await Promise.all(
      Array.from(Array(5).keys()).map(() =>
        createPassive(connection, {
          account: testAccount,
        }).then(({ databasePassive }) => databasePassive),
      ),
    );
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('myPassives', () => {
    it('should get correct passives for the user', async () => {
      const { query } = await mountTestClient({ currentUser: testUser });
      const response = await query({ query: MY_PASSIVES });

      expect(response).toBeSuccessful();
      expect(response.data!.passives).toHaveLength(testPassives.length);

      const passivesById = keyBy(response.data!.passives, 'id');
      testPassives.forEach((passive) =>
        expect(passivesById[passive.id].id).toBe(`${passive.id}`),
      );
    });

    it('should not authorize unauthenticated users', async () => {
      const { query } = await mountTestClient();
      const response = await query({ query: MY_PASSIVES });
      expect(response).toBeRejectedByAuth();
    });
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

  describe('deletePassive', () => {
    const createTestPassive = async (liquidate?: boolean) => {
      const { databasePassive } = await createPassive(connection, {
        account: testAccount,
      });

      if (liquidate) {
        databasePassive.account = testAccount;
        await new LiquidatePassiveCommand(testUser, {
          liquidatedAccount: testAccount,
          passive: databasePassive,
        }).execute();
      }

      return databasePassive;
    };

    it('should delete a passive if mine and not liquidated', async () => {
      const createdPassive = await createTestPassive();

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_PASSIVE,
        variables: { id: createdPassive.id },
      });

      expect(response).toBeSuccessful();

      const databasePassive = getRepository(Passive).findOneOrFail(
        response.data!.deletePassive,
      );

      await expect(databasePassive).rejects.toBeTruthy();
    });

    it('should delete a passive if mine and liquidated', async () => {
      const createdPassive = await createTestPassive(true);

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_PASSIVE,
        variables: { id: createdPassive.id },
      });

      expect(response).toBeSuccessful();

      const databasePassive = getRepository(Passive).findOneOrFail(
        response.data!.deletePassive,
      );

      await expect(databasePassive).rejects.toBeTruthy();
    });

    it('should not delete a passive if not mine', async () => {
      const otherUser = (await createUser(connection)).databaseUser;

      const { databaseAccount: othersAccount } = await createAccount(
        connection,
        otherUser.id,
        { type: AccountType.checking },
      );

      const { databasePassive: othersPassive } = await createPassive(
        connection,
        { account: othersAccount },
      );

      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({
        mutation: DELETE_PASSIVE,
        variables: { id: othersPassive.id },
      });

      expect(response).toBeRejected();
    });
  });
});
