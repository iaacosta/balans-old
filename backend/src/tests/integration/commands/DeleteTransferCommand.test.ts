/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transfer from '../../../models/Transfer';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { transferModelFactory } from '../../factory/transferFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SaveTransferCommand from '../../../commands/SaveTransferCommand';
import DeleteTransferCommand from '../../../commands/DeleteTransferCommand';

const testInitialBalance = 100000;

describe('transfer helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testFromAccount: Account;
  let testToAccount: Account;
  let toDeleteTransfers: Transfer[];

  const numberOfTransfers = 5;
  const testTransfers: Transfer[] = [];
  const testAmounts: number[] = [];
  const pgClient = createPgClient();

  const setupAccounts = async () => {
    testUser = (await createUser(connection)).databaseUser;

    testFromAccount = (
      await createAccount(connection, testUser.id, {
        initialBalance: testInitialBalance,
        type: AccountType.checking,
      })
    ).databaseAccount;

    testToAccount = (
      await createAccount(connection, testUser.id, {
        initialBalance: testInitialBalance,
        type: AccountType.checking,
      })
    ).databaseAccount;
  };

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);
    await setupAccounts();

    for (let i = 0; i < numberOfTransfers; i += 1) {
      const testAmount = (i + 1) * 100;
      const { factoryTransfer } = transferModelFactory(
        {
          fromAccount: testFromAccount,
          toAccount: testToAccount,
        },
        { amount: testAmount },
      );

      const transferCommands = new SaveTransferCommand(testUser, {
        fromAccount: testFromAccount,
        toAccount: testToAccount,
        ...factoryTransfer,
      });
      const [fromTransfer, toTransfer] = await transferCommands.execute();

      testTransfers.push(fromTransfer, toTransfer);
      testAmounts.push(testAmount);
    }
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  it('should delete transfers and change balances', async () => {
    const deletedTransfer = testTransfers[testTransfers.length - 1];

    toDeleteTransfers = await connection.getRepository(Transfer).find({
      where: { operationId: deletedTransfer.operationId },
      relations: ['account'],
    });

    const command = new DeleteTransferCommand(testUser, {
      toTransfer: toDeleteTransfers[0],
      fromTransfer: toDeleteTransfers[1],
    });
    await command.execute();

    testFromAccount = await getRepository(Account).findOneOrFail(
      testFromAccount.id,
    );

    testToAccount = await getRepository(Account).findOneOrFail(
      testToAccount.id,
    );

    expect(
      await connection
        .getRepository(Transfer)
        .find({ operationId: deletedTransfer.operationId }),
    ).toHaveLength(0);

    const transferEffect = testAmounts
      .slice(0, testAmounts.length - 1)
      .reduce((accum, curr) => accum + curr, 0);

    expect(testFromAccount.balance).toBe(testInitialBalance - transferEffect);
    expect(testToAccount.balance).toBe(testInitialBalance + transferEffect);
  });
});
