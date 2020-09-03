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
import TransferCommands from '../../../commands/TransferCommands';

const testInitialBalance = 100000;

describe('transfer helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testFromAccount: Account;
  let testToAccount: Account;

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
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('create', () => {
    const getTransferPair = async (operationId: string) => {
      const [fromTransfer, toTransfer] = await getRepository(Transfer).find({
        operationId,
      });
      return { fromTransfer, toTransfer };
    };

    const numberOfTransfers = 5;
    const testTransfers: Transfer[] = [];
    const testAmounts: number[] = [];

    let testFromTransfer: Transfer;
    let testToTransfer: Transfer;

    beforeAll(async () => {
      await setupAccounts();

      const transferCommands = new TransferCommands(testUser);

      for (let i = 0; i < numberOfTransfers; i += 1) {
        const testAmount = (i + 1) * 100;
        const { factoryTransfer } = transferModelFactory(
          { fromAccount: testFromAccount, toAccount: testToAccount },
          { amount: testAmount },
        );

        if (i === 0) factoryTransfer.memo = undefined;

        const [, toTransfer] = await transferCommands.create(factoryTransfer, {
          fromAccount: testFromAccount,
          toAccount: testToAccount,
        });

        testTransfers.push(toTransfer);
        testAmounts.push(testAmount);
      }
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
          const transfers = await getTransferPair(
            testTransfers[idx].operationId,
          );

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

  describe('delete', () => {
    const numberOfTransfers = 5;
    const testTransfers: Transfer[] = [];
    const testAmounts: number[] = [];
    let toDeleteTransfers: Transfer[];

    beforeAll(async () => {
      await setupAccounts();
      const transferCommands = new TransferCommands(testUser);

      for (let i = 0; i < numberOfTransfers; i += 1) {
        const testAmount = (i + 1) * 100;
        const { factoryTransfer } = transferModelFactory(
          {
            fromAccount: testFromAccount,
            toAccount: testToAccount,
          },
          { amount: testAmount },
        );

        const [fromTransfer, toTransfer] = await transferCommands.create(
          factoryTransfer,
          {
            fromAccount: testFromAccount,
            toAccount: testToAccount,
          },
        );

        testTransfers.push(fromTransfer, toTransfer);
        testAmounts.push(testAmount);
      }
    });

    it('should delete transfers and change balances', async () => {
      const transferCommands = new TransferCommands(testUser);
      const deletedTransfer = testTransfers[testTransfers.length - 1];

      toDeleteTransfers = await connection.getRepository(Transfer).find({
        where: { operationId: deletedTransfer.operationId },
        relations: ['account'],
      });

      await transferCommands.delete(toDeleteTransfers);

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
});
