/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../graphql/helpers';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import User from '../models/User';
import { updateEntity } from '../utils';

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
    });

    const rootTransaction = new Transaction({
      amount: -amount,
      memo: memo?.concat(' (root)'),
      accountId: rootAccount.id,
      operationId,
    });

    await this.manager.getRepository(Account).save([account, rootAccount]);

    return this.manager
      .getRepository(Transaction)
      .save([transaction, rootTransaction]);
  }

  async updateTransaction(
    transaction: Transaction,
    toChange: Omit<UpdateTransactionInput, 'id'>,
  ): Promise<Transaction[]> {
    const rootAccount = await this.getRootAccount();
    const accountChanged = !!toChange.accountId;
    let { account } = transaction;

    /* Change the account and it's balance if said so */
    if (accountChanged) {
      account = await this.manager
        .getRepository(Account)
        .findOneOrFail({ id: toChange.accountId });

      /* We inmediately pass the effect, so that either
      there is a change in the amount or not, it will
      always consider the effect of an account change */
      account.balance += transaction.amount;

      /* We also recover the balance of the original account,
      but we save it inmediatly because we lose reference */
      transaction.account.balance -= transaction.amount;

      await this.manager
        .getRepository(Account)
        .save([account, transaction.account]);
    }

    /* Change the balance if the amount changes */
    if (toChange.amount) {
      const balanceChange = toChange.amount - transaction.amount;

      /* We change both in root and transaction account */
      account.balance += balanceChange;
      rootAccount.balance -= balanceChange;

      await this.manager.getRepository(Account).save([account, rootAccount]);
    }

    const rootTransaction = await this.manager
      .getRepository(Transaction)
      .findOneOrFail({
        operationId: transaction.operationId,
        accountId: rootAccount.id,
      });

    /* We only update two fields on the root transaction */
    updateEntity(rootTransaction, {
      amount: toChange.amount ? -toChange.amount : undefined,
      memo: toChange.memo?.concat(' (root)'),
    });
    updateEntity(transaction, toChange);

    delete transaction.account;

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
