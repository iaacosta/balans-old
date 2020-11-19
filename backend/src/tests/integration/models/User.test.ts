import { Connection, createConnection } from 'typeorm';
import { createUser } from '../../factory/userFactory';
import { createPgClient, seedTestDatabase } from '../../utils';

describe('User model integration tests', () => {
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

  describe('getRootAccount', () => {
    it('should get root account', async () => {
      const testUser = (await createUser(connection)).databaseUser;
      const rootAccount = await testUser.getRootAccount();
      expect(rootAccount).toBeDefined();
    });

    it('should get a root type account', async () => {
      const testUser = (await createUser(connection)).databaseUser;
      const rootAccount = await testUser.getRootAccount();
      expect(rootAccount.type).toBe('root');
    });
  });
});
