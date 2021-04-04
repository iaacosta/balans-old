/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection, getRepository } from 'typeorm';
import { forEach } from 'lodash';

import { seedTestDatabase, createPgClient } from '../../utils';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';
import Account from '../../../models/Account';
import {
  CategoryPair,
  transactionModelFactory,
} from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import SaveTransactionCommand from '../../../commands/SaveTransactionCommand';
import DeleteTransactionCommand from '../../../commands/DeleteTransactionCommand';
import { createCategoryPair } from '../../factory/categoryFactory';
import { Currency } from '../../../graphql/helpers/enums/currencyEnum';

const testInitialBalance = 1000;

describe('transaction helper tests', () => {
  let connection: Connection;
  let testUser: User;
  let testCategories: CategoryPair;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    await seedTestDatabase(pgClient);
    // TODO: remove this when objective is finished
    process.env.ALLOW_CURRENCIES = 'true';
    testUser = (await createUser(connection)).databaseUser;
    testCategories = await createCategoryPair(connection, testUser.id);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  forEach(Currency, (currency) => {
    let testAccount: Account;
    let toDeleteTransaction: Transaction;

    const staticArray = Array.from(Array(5).keys());
    const testTransactions: Transaction[] = [];
    const testAmounts: number[] = [];

    describe(`${currency}`, () => {
      beforeAll(async () => {
        testAccount = (
          await createAccount(connection, testUser.id, {
            initialBalance: testInitialBalance,
            type: AccountType.checking,
            currency,
          })
        ).databaseAccount;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of staticArray) {
          const { factoryTransaction, category } = transactionModelFactory({
            account: testAccount,
            categories: testCategories,
          });

          const command = new SaveTransactionCommand(testUser, {
            account: testAccount,
            category,
            ...factoryTransaction,
          });

          const [transaction] = await command.execute();

          testTransactions.push(transaction);
          testAmounts.push(transaction.amount);
        }
      });

      beforeAll(async () => {
        const sampleTransaction = testTransactions[testTransactions.length - 1];

        toDeleteTransaction = await connection
          .getRepository(Transaction)
          .findOneOrFail({
            where: { id: sampleTransaction.id },
            relations: ['account'],
          });

        const command = new DeleteTransactionCommand(testUser, {
          transaction: toDeleteTransaction,
        });

        await command.execute();
      });

      it('should delete the sibling transaction on root account', async () => {
        const counterTransaction = await getRepository(Transaction).findOne({
          operationId: toDeleteTransaction.operationId,
          accountId: (await testUser.getRootAccount(currency)).id,
        });

        expect(counterTransaction).toBeUndefined();
      });

      it('should change account balances', async () => {
        const refreshedAccount = await getRepository(Account).findOneOrFail(
          testAccount.id,
        );

        const refreshedRootAccount = await getRepository(Account).findOneOrFail(
          (await testUser.getRootAccount(currency)).id,
        );

        const expectedBalance =
          testInitialBalance +
          testAmounts
            .slice(0, testTransactions.length - 1)
            .reduce((accum, curr) => accum + curr, 0);

        expect(refreshedAccount.balance).toBe(expectedBalance);
        expect(refreshedRootAccount.balance).toBe(-expectedBalance);
      });
    });
  });
});
