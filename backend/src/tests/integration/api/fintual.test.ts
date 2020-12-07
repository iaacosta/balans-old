/* eslint-disable @typescript-eslint/no-throw-literal */
import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';

import { seedTestDatabase, createPgClient, mountTestClient } from '../../utils';
import User from '../../../models/User';
import { createUser } from '../../factory/userFactory';
import { mockAxiosGet } from '../../mocks/axios';
import {
  fintualCredentialsBuilder,
  fintualGoalBuilder,
} from '../../factory/fintualFactory';
import { mockDecryption } from '../../mocks/crypto';

const MY_FINTUAL_GOALS = gql`
  query MyFintualGoals {
    myFintualGoals {
      id
      name
      value
      deposited
      profit
    }
  }
`;

const REGISTER_FINTUAL_CREDENTIALS = gql`
  mutation RegisterFintualCredentials($input: RegisterFintualAPIInput!) {
    registerFintualCredentials(input: $input)
  }
`;

describe('fintual API calls', () => {
  let connection: Connection;
  let testUser: User;
  let testAdmin: User;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection, { role: 'user' })).databaseUser;
    testAdmin = (
      await createUser(connection, {
        role: 'admin',
        fintualEmail: 'mock',
        fintualToken: 'mock',
      })
    ).databaseUser;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('myFintualGoals', () => {
    const testGoals = [fintualGoalBuilder(), fintualGoalBuilder()];

    beforeEach(() => {
      mockDecryption();
      mockAxiosGet(() => ({ data: { data: testGoals } }));
    });

    it('should get correct goals for user', async () => {
      const { mutate } = await mountTestClient({ currentUser: testAdmin });
      const response = await mutate({ mutation: MY_FINTUAL_GOALS });

      expect(response).toBeSuccessful();
      expect(response.data.myFintualGoals).toHaveLength(testGoals.length);
      testGoals.forEach((testGoal, idx) =>
        expect(response.data.myFintualGoals[idx].id).toBe(testGoal.id),
      );
    });

    it('should not get goals if API authentication error', async () => {
      mockAxiosGet(() => {
        throw { response: { status: 401 } };
      });

      const { mutate } = await mountTestClient({ currentUser: testAdmin });
      const response = await mutate({ mutation: MY_FINTUAL_GOALS });
      expect(response).toBeRejected();
    });

    it('should not get goals if other API error', async () => {
      mockAxiosGet(() => {
        throw { response: { status: 500 } };
      });

      const { mutate } = await mountTestClient({ currentUser: testAdmin });
      const response = await mutate({ mutation: MY_FINTUAL_GOALS });
      expect(response).toBeRejected();
    });

    it('should not get goals if no credentials', async () => {
      const testAdminWithoutCredentials = (
        await createUser(connection, { role: 'admin' })
      ).databaseUser;

      const { mutate } = await mountTestClient({
        currentUser: testAdminWithoutCredentials,
      });

      const response = await mutate({ mutation: MY_FINTUAL_GOALS });
      expect(response).toBeRejected();
    });

    it('should not authorize unauthenticated users', async () => {
      const { mutate } = await mountTestClient();
      const response = await mutate({ mutation: MY_FINTUAL_GOALS });
      expect(response).toBeRejectedByAuth();
    });

    it('should not authorize non admin users', async () => {
      const { mutate } = await mountTestClient({ currentUser: testUser });
      const response = await mutate({ mutation: MY_FINTUAL_GOALS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('registerFintualCredentials', () => {
    it('should register credentials', async () => {
      const testCredentials = fintualCredentialsBuilder();
      const { mutate } = await mountTestClient({ currentUser: testAdmin });

      const response = await mutate({
        mutation: REGISTER_FINTUAL_CREDENTIALS,
        variables: { input: testCredentials },
      });

      const user = await getRepository(User).findOneOrFail(testAdmin.id);

      expect(response).toBeSuccessful();
      expect(user.fintualEmail).toBeDefined();
      expect(user.fintualToken).toBeDefined();
      expect(user.fintualEmail).not.toBe(testCredentials.email);
      expect(user.fintualToken).not.toBe(testCredentials.token);
    });

    it('should not authorize unauthenticated users', async () => {
      const { mutate } = await mountTestClient();

      const response = await mutate({
        mutation: REGISTER_FINTUAL_CREDENTIALS,
        variables: { input: fintualCredentialsBuilder() },
      });

      expect(response).toBeRejectedByAuth();
    });

    it('should not authorize non admin users', async () => {
      const { mutate } = await mountTestClient({ currentUser: testUser });

      const response = await mutate({
        mutation: REGISTER_FINTUAL_CREDENTIALS,
        variables: { input: fintualCredentialsBuilder() },
      });

      expect(response).toBeRejectedByAuth();
    });
  });
});
