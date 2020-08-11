import { createConnection, Connection, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { keyBy } from 'lodash';

import { mountTestClient, seedTestDatabase, createPgClient } from '../../utils';
import User from '../../../models/User';
import { createUser, buildUser } from '../../factory/userFactory';

const USERS = gql`
  query Users {
    users {
      id
      name
      username
      email
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const DELETED_USERS = gql`
  query DeletedUsers {
    users: deletedUsers {
      id
      name
      username
      email
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      username
      email
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const ME = gql`
  query Me {
    me {
      id
      name
      username
      email
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      input: {
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        password: $password
      }
    ) {
      id
      name
      email
      username
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $firstName: String) {
    updateUser(input: { id: $id, firstName: $firstName }) {
      id
      name
      email
      username
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const UPDATE_ME = gql`
  mutation UpdateMe($firstName: String, $currentPassword: String!) {
    updateMe(
      input: { firstName: $firstName, currentPassword: $currentPassword }
    ) {
      id
      name
      email
      username
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const RESTORE_USER = gql`
  mutation RestoreUser($id: ID!) {
    restoreUser(id: $id) {
      id
      name
      email
      username
      role
      accounts {
        id
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

describe('user API calls', () => {
  let connection: Connection;
  let normalUsers: User[];
  let adminUsers: User[];
  let softDeletedUsers: User[];

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);

    const createUserPromises = Array.from(Array(2).keys()).map(
      async () => (await createUser(connection, { role: 'user' })).databaseUser,
    );

    const softDeletedUserPromises = Array.from(Array(2).keys()).map(
      async () => {
        const user = (await createUser(connection, { role: 'user' }))
          .databaseUser;
        await getRepository(User).softRemove(user);
        return user;
      },
    );

    const createAdminPromises = Array.from(Array(2).keys()).map(
      async () =>
        (await createUser(connection, { role: 'admin' })).databaseUser,
    );

    normalUsers = await Promise.all(createUserPromises);
    adminUsers = await Promise.all(createAdminPromises);
    softDeletedUsers = await Promise.all(softDeletedUserPromises);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('users', () => {
    let allUsers: User[];

    beforeAll(async () => {
      allUsers = [...adminUsers, ...normalUsers];
    });

    it('should get correct users if admin', async () => {
      const { query } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await query({ query: USERS });
      expect(response).toBeSuccessful();
      expect(response.data!.users).toHaveLength(allUsers.length);
      const usersById = keyBy(response.data!.users, 'id');
      allUsers.forEach((_user) => {
        expect(usersById[_user.id].username).toBe(_user.username);
      });
    });

    it('should not authorize normal users', async () => {
      const { query } = await mountTestClient({ currentUser: normalUsers[0] });
      const response = await query({ query: USERS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('user', () => {
    let targetUser: User;

    beforeEach(async () => {
      [targetUser] = adminUsers;
    });

    it('should get correct user if admin', async () => {
      const { query } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await query({
        query: USER,
        variables: { id: targetUser.id },
      });
      expect(response).toBeSuccessful();
      expect(response.data!.user.username).toBe(targetUser.username);
    });

    it('should not authorize normal users', async () => {
      const { query } = await mountTestClient({ currentUser: normalUsers[0] });
      const response = await query({
        query: USER,
        variables: { id: targetUser.id },
      });
      expect(response).toBeRejectedByAuth();
    });

    it('should reject if no user found', async () => {
      const { query } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await query({ query: USER, variables: { id: '-1' } });
      expect(response).toBeRejected();
    });
  });

  describe('deletedUsers', () => {
    let allUsers: User[];

    beforeAll(async () => {
      allUsers = softDeletedUsers;
    });

    it('should get correct users if admin', async () => {
      const { query } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await query({ query: DELETED_USERS });
      expect(response).toBeSuccessful();
      expect(response.data!.users).toHaveLength(allUsers.length);
      const usersById = keyBy(response.data!.users, 'id');
      allUsers.forEach((_user) => {
        expect(usersById[_user.id].username).toBe(_user.username);
      });
    });

    it('should not authorize normal users', async () => {
      const { query } = await mountTestClient({ currentUser: normalUsers[0] });
      const response = await query({ query: DELETED_USERS });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('me', () => {
    it('should get correct user on admin user', async () => {
      const [currentUser] = adminUsers;
      const { query } = await mountTestClient({ currentUser });
      const response = await query({
        query: ME,
        variables: { id: currentUser.id },
      });
      expect(response).toBeSuccessful();
      expect(response.data!.me.username).toBe(currentUser.username);
    });

    it('should get correct user on normal user', async () => {
      const [currentUser] = normalUsers;
      const { query } = await mountTestClient({ currentUser });
      const response = await query({
        query: ME,
        variables: { id: currentUser.id },
      });
      expect(response).toBeSuccessful();
      expect(response.data!.me.username).toBe(currentUser.username);
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const testUser = buildUser();
      const { mutate } = await mountTestClient();
      const response = await mutate({
        mutation: CREATE_USER,
        variables: testUser,
      });

      expect(response).toBeSuccessful();
      const createdUser = await getRepository(User).findOneOrFail(
        response.data!.createUser.id,
      );
      expect(createdUser.username).toBe(testUser.username);
    });
  });

  describe('updateUser', () => {
    let createdUser: User;

    beforeAll(async () => {
      createdUser = (await createUser(connection)).databaseUser;
    });

    it('should update user if admin user', async () => {
      const { mutate } = await mountTestClient({ currentUser: adminUsers[0] });
      const { firstName } = buildUser();
      const response = await mutate({
        mutation: UPDATE_USER,
        variables: { id: createdUser.id, firstName },
      });

      expect(response).toBeSuccessful();
      const updatedUsername = await getRepository(User).findOneOrFail(
        response.data!.updateUser.id,
      );
      expect(updatedUsername.firstName).toBe(firstName);
    });

    it('should reject if no changes given', async () => {
      const { mutate } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await mutate({
        mutation: UPDATE_USER,
        variables: { id: createdUser.id },
      });

      expect(response).toBeRejected();
    });

    it('should not authorize normal users', async () => {
      const { mutate } = await mountTestClient({ currentUser: normalUsers[0] });
      const { firstName } = buildUser();
      const response = await mutate({
        mutation: UPDATE_USER,
        variables: { id: createdUser.id, firstName },
      });
      expect(response).toBeRejectedByAuth();
    });
  });

  describe('updateMe', () => {
    const updateMe = async (currentUser: User, factoryUser: Partial<User>) => {
      const { mutate } = await mountTestClient({ currentUser });
      const { firstName } = buildUser();

      const response = await mutate({
        mutation: UPDATE_ME,
        variables: { firstName, currentPassword: factoryUser.password },
      });

      expect(response).toBeSuccessful();
      const updatedUsername = await getRepository(User).findOneOrFail(
        response.data!.updateMe.id,
      );

      expect(updatedUsername.firstName).toBe(firstName);
    };

    it('should update me if admin user', async () => {
      const {
        databaseUser: currentUser,
        factoryUser: builtUser,
      } = await createUser(connection, { role: 'admin' });

      await updateMe(currentUser, builtUser);
    });

    it('should update me if normal user', async () => {
      const {
        databaseUser: currentUser,
        factoryUser: builtUser,
      } = await createUser(connection, { role: 'user' });

      await updateMe(currentUser, builtUser);
    });

    it('should reject if wrong password given', async () => {
      const { databaseUser } = await createUser(connection, { role: 'user' });
      const { mutate } = await mountTestClient({ currentUser: databaseUser });
      const { firstName } = buildUser();

      const response = await mutate({
        mutation: UPDATE_ME,
        variables: { firstName, currentPassword: 'wrongPassword' },
      });

      expect(response).toBeRejectedByAuth();
    });

    it('should reject if no changes given', async () => {
      const { databaseUser, factoryUser } = await createUser(connection, {
        role: 'user',
      });

      const { mutate } = await mountTestClient({ currentUser: databaseUser });
      const response = await mutate({
        mutation: UPDATE_ME,
        variables: { currentPassword: factoryUser.password },
      });

      expect(response).toBeRejected();
    });
  });

  describe('deleteUser', () => {
    let createdUser: User;

    beforeAll(async () => {
      createdUser = (await createUser(connection)).databaseUser;
    });

    it('should soft delete a user if admin', async () => {
      const { mutate } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await mutate({
        mutation: DELETE_USER,
        variables: { id: createdUser.id },
      });

      expect(response).toBeSuccessful();
      await expect(
        getRepository(User).findOneOrFail(response.data!.deleteUser),
      ).rejects.toBeTruthy();
      await expect(
        getRepository(User).findOneOrFail(response.data!.deleteUser, {
          withDeleted: true,
        }),
      ).resolves.toBeTruthy();
    });

    it('should not soft delete a user if normal user', async () => {
      const { mutate } = await mountTestClient({ currentUser: normalUsers[0] });
      const response = await mutate({
        mutation: DELETE_USER,
        variables: { id: createdUser.id },
      });

      expect(response).toBeRejectedByAuth();
    });
  });

  describe('restoreUser', () => {
    let createdUser: User;

    beforeAll(async () => {
      createdUser = (await createUser(connection)).databaseUser;
      await getRepository(User).softRemove(createdUser);
    });

    it('should restore a user if admin', async () => {
      const { mutate } = await mountTestClient({ currentUser: adminUsers[0] });
      const response = await mutate({
        mutation: RESTORE_USER,
        variables: { id: createdUser.id },
      });

      expect(response).toBeSuccessful();
      await expect(
        getRepository(User).findOneOrFail(response.data!.deleteUser),
      ).resolves.toBeTruthy();
    });

    it('should not delete a user if normal user', async () => {
      const { mutate } = await mountTestClient({ currentUser: normalUsers[0] });
      const response = await mutate({
        mutation: RESTORE_USER,
        variables: { id: createdUser.id },
      });

      expect(response).toBeRejectedByAuth();
    });
  });
});
