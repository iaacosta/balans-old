import { Connection, createConnection } from 'typeorm';

import '../../../models/Transaction';
import Passive from '../../../models/Passive';
import Account from '../../../models/Account';
import User from '../../../models/User';
import SavePassiveCommand from '../../../commands/SavePassiveCommand';
import { AccountType } from '../../../graphql/helpers';
import { createAccount } from '../../factory/accountFactory';
import { passiveFactory } from '../../factory/passiveFactory';
import { createUser } from '../../factory/userFactory';
import { createPgClient, seedTestDatabase } from '../../utils';

describe('Passive model integration tests', () => {
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
        initialBalance: 0,
      })
    ).databaseAccount;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('getPairedPassive', () => {
    let testPassive: Passive;
    let testPairedPassive: Passive;

    beforeAll(async () => {
      const command = new SavePassiveCommand(testUser, {
        ...passiveFactory(),
        account: testAccount,
      });

      const [passive, pairedPassive] = await command.execute();
      testPassive = passive;
      testPairedPassive = pairedPassive;
    });

    it('should get paired passive', async () => {
      const pairedPassive = await testPassive.getPairedPassive();
      expect(pairedPassive).toBeDefined();
      expect(pairedPassive.id).toBe(testPairedPassive.id);
      expect(pairedPassive.amount).toBe(testPairedPassive.amount);
      expect(pairedPassive.operationId).toBe(testPairedPassive.operationId);
    });
  });
});
