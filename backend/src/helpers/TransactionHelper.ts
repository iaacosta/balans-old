/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateTransactionInput } from '../graphql/helpers';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import User from '../models/User';

export default class TransactionHelper {
  manager: EntityManager;

  user: Pick<User, 'id'>;

  constructor(currentUser: Pick<User, 'id'>, manager?: EntityManager) {
    this.user = currentUser;
    this.manager = manager || getManager();
  }

  private getRootAccount(): Promise<Account> {
    return this.manager
      .getRepository(Account)
      .findOneOrFail({ userId: this.user.id, type: 'root' });
  }

  async performTransaction(
    { memo, amount }: Pick<CreateTransactionInput, 'memo' | 'amount'>,
    account: Account,
  ): Promise<Transaction[]> {
    const rootAccount = await this.getRootAccount();

    account.balance += amount;
    rootAccount.balance -= amount;

    const operationId = uuid();
    const transaction = new Transaction({
      amount,
      memo,
      accountId: account.id,
      operationId,
      resultantBalance: account.balance,
    });

    const rootTransaction = new Transaction({
      amount: -amount,
      memo: memo?.concat(' (root)'),
      accountId: rootAccount.id,
      operationId,
      resultantBalance: rootAccount.balance,
    });

    await this.manager.getRepository(Account).save([account, rootAccount]);

    return this.manager
      .getRepository(Transaction)
      .save([transaction, rootTransaction]);
  }

  async revertTransaction(transaction: Transaction): Promise<Transaction[]> {
    const rootAccount = await this.getRootAccount();
    const rootTransaction = await this.manager
      .getRepository(Transaction)
      .findOneOrFail({
        operationId: transaction.operationId,
        accountId: rootAccount.id,
      });

    transaction.account.balance -= transaction.amount;
    rootAccount.balance += transaction.amount;

    await this.manager.save([transaction.account, rootAccount]);

    return this.manager
      .getRepository(Transaction)
      .remove([transaction, rootTransaction]);
  }
}
