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

const testInitialBalance = 100000;

describe('transfer helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testFromAccount: Account;
  let testToAccount: Account;
  let testFromTransfer: Transfer;
  let testToTransfer: Transfer;

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

  const getTransferPair = async (operationId: string) => {
    const [fromTransfer, toTransfer] = await getRepository(Transfer).find({
      operationId,
    });
    return { fromTransfer, toTransfer };
  };

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();

    await seedTestDatabase(pgClient);
    await setupAccounts();

    for (let i = 0; i < numberOfTransfers; i += 1) {
      const testAmount = (i + 1) * 100;
      const { factoryTransfer } = transferModelFactory(
        { fromAccount: testFromAccount, toAccount: testToAccount },
        { amount: testAmount },
      );

      if (i === 0) factoryTransfer.memo = undefined;

      const transferCommands = new SaveTransferCommand(testUser, {
        fromAccount: testFromAccount,
        toAccount: testToAccount,
        ...factoryTransfer,
      });

      const [, toTransfer] = await transferCommands.execute();

      testTransfers.push(toTransfer);
      testAmounts.push(testAmount);
    }
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  it('should change account balances', async () => {
    const refreshedFromAccount = await getRepository(Account).findOneOrFail(
      testFromAccount.id,
    );
    const refreshedToAccount = await getRepository(Account).findOneOrFail(
      testToAccount.id,
    );

    const transferSum = testAmounts.reduce((accum, curr) => accum + curr, 0);
    const expectedFromBalance = testInitialBalance - transferSum;
    const expectedToBalance = testInitialBalance + transferSum;

    expect(refreshedFromAccount.balance).toBe(expectedFromBalance);
    expect(refreshedToAccount.balance).toBe(expectedToBalance);
  });

  Array.from(Array(numberOfTransfers).keys()).forEach((_, idx) => {
    describe(`transfer ${idx}`, () => {
      beforeAll(async () => {
        const transfers = await getTransferPair(testTransfers[idx].operationId);

        testFromTransfer = transfers.fromTransfer;
        testToTransfer = transfers.toTransfer;
      });

      it('should create transfer pairs', async () => {
        expect(testFromTransfer).toBeDefined();
        expect(testToTransfer).toBeDefined();
      });

      it('should have correct values', async () => {
        const expectedAmount = -testTransfers[idx].amount;

        expect(testFromTransfer.amount).toBe(expectedAmount);
        expect(testToTransfer.amount).toBe(-expectedAmount);
      });
    });
  });
});
