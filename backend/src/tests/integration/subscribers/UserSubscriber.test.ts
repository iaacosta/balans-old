import { createConnection, Connection, Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import { size } from 'lodash';

import { seedTestDatabase, createPgClient } from '../../utils';
import User from '../../../models/User';
import { userModelFactory, createUser } from '../../factory/userFactory';
import Account from '../../../models/Account';
import { Currency } from '../../../graphql/helpers/enums/currencyEnum';

describe('user ORM tests', () => {
  let connection: Connection;
  let repo: Repository<User>;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    repo = connection.getRepository(User);
    await pgClient.connect();
  });

  beforeEach(async () => {
    await seedTestDatabase(pgClient);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('subscribers', () => {
    describe('create', () => {
      it('should hash password on save', async () => {
        const { user, factoryUser } = userModelFactory();
        await expect(repo.save(user)).resolves.toBeTruthy();
        expect(user.password).not.toBe(factoryUser.password);
        expect(await compare(factoryUser.password, user.password)).toBe(true);
      });

      it('should call validateOrReject on save', async () => {
        const { user } = userModelFactory({ password: 'nope' });
        await expect(repo.save(user)).rejects.toThrow(ApolloError);
      });

      it('creates root accounts on save', async () => {
        const { user } = userModelFactory();
        await expect(repo.save(user)).resolves.toBeTruthy();
        const accounts = await connection.getRepository(Account).find({
          userId: user.id,
        });

        // TODO: change this when tests are adapted to two all currencies
        expect(accounts).toHaveLength(size([Currency.CLP]));
      });
    });

    describe('update', () => {
      it('should hash password on update', async () => {
        const { databaseUser } = await createUser(connection);
        let testUser = (await repo.findOne(databaseUser.id)) as User;
        expect(testUser).toBeDefined();

        const newPassword = 'examplePassword';
        testUser.password = newPassword;
        await repo.save(testUser);
        testUser = (await repo.findOne(databaseUser.id)) as User;

        expect(testUser.password).not.toBe(newPassword);
        expect(await compare(newPassword, testUser.password)).toBe(true);
      });

      it('should call validateOrReject on update', async () => {
        const { databaseUser } = await createUser(connection);
        const testUser = (await repo.findOne(databaseUser.id)) as User;
        expect(testUser).toBeDefined();
        testUser.password = 'noop';
        await expect(repo.save(testUser)).rejects.toThrow(ApolloError);
      });
    });
  });
});
