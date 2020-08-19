import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import { createUser, userBuilder } from '../../factory/userFactory';
import User from '../../../models/User';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password })
  }
`;

const SIGN_UP = gql`
  mutation SignUp($input: CreateUserInput!) {
    signUp(input: $input)
  }
`;

describe('authentication API calls', () => {
  let connection: Connection;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      const { factoryUser, databaseUser } = await createUser(connection);
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: LOGIN,
        variables: {
          username: factoryUser.username,
          password: factoryUser.password,
        },
      });

      expect(response).toBeSuccessful();
      const payload = jwt.verify(response.data!.login, process.env.SECRET!);
      expect((payload as any).user.id).toBe(databaseUser.id);
    });

    it('should not login with incorrect username', async () => {
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: LOGIN,
        variables: { username: 'incorrect', password: 'incorrect' },
      });

      expect(response).toBeRejectedByAuth();
    });

    it('should not login with incorrect password but correct username', async () => {
      const { factoryUser } = await createUser(connection);
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: LOGIN,
        variables: { username: factoryUser.username, password: 'incorrect' },
      });

      expect(response).toBeRejectedByAuth();
    });
  });

  describe('signUp', () => {
    let testUser: ReturnType<typeof userBuilder>;

    beforeEach(() => {
      testUser = userBuilder();
      delete testUser.role;
    });

    it('should return a token', async () => {
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: SIGN_UP,
        variables: { input: testUser },
      });

      expect(response).toBeSuccessful();
      const { user } = jwt.decode(response.data!.signUp) as any;
      expect(user.username).toBe(testUser.username);
    });

    it('should create a user', async () => {
      const { mutate } = await mountTestClient();
      await mutate({ mutation: SIGN_UP, variables: { input: testUser } });

      const user = await getRepository(User).findOneOrFail({
        username: testUser.username,
      });

      expect(user.username).toBe(testUser.username);
    });
  });
});
