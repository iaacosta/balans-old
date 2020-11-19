/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';

import { CurrentUser } from '../@types';
import { UpdateTransactionInput } from '../graphql/helpers';
import Account from '../models/Account';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import { updateEntity } from '../utils';
import IMovementCommand from './MovementCommand';

type Data = {
  transaction: Transaction;
} & Omit<UpdateTransactionInput, 'id'>;

type TransactionTuple = [Transaction, Transaction];

export default class UpdateTransactionCommand
  implements IMovementCommand<TransactionTuple, Data> {
  user: NonNullable<CurrentUser>;

  data: Data;

  manager: EntityManager;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Data,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = data;
    this.manager = manager || getManager();
  }

  private async checkAccountChange(): Promise<Account | null> {
    const { transaction, accountId } = this.data;

    if (accountId) {
      const previousAccount = transaction.account;

      transaction.account = await this.manager
        .getRepository(Account)
        .findOneOrFail({ id: accountId, userId: this.user.id });

      Account.applyBalanceChanges({
        amount: transaction.amount,
        from: previousAccount,
        to: transaction.account,
      });

      return previousAccount;
    }

    return null;
  }

  private async checkCategoryChange() {
    const { transaction, categoryId } = this.data;

    if (categoryId) {
      transaction.category = await this.manager
        .getRepository(Category)
        .findOneOrFail({ id: categoryId, userId: this.user.id });
    }
  }

  private async checkAmountChange(rootAccount: Account) {
    const { transaction, amount } = this.data;

    if (amount) {
      const realChange = amount - transaction.amount;

      transaction.account.balance += realChange;
      rootAccount.balance -= realChange;
    }
  }

  private async checkRootTransactionChanges(rootTransaction: Transaction) {
    const { transaction, memo } = this.data;
    const hasAmountChanged =
      Math.abs(transaction.amount) !== Math.abs(rootTransaction.amount);

    updateEntity(rootTransaction, {
      amount: hasAmountChanged ? -transaction.amount : undefined,
      memo: memo?.concat(' (root)'),
    });
  }

  private async checkOtherChanges() {
    const { transaction, ...toChange } = this.data;
    updateEntity(transaction, toChange);
  }

  public async execute(): Promise<TransactionTuple> {
    const { transaction } = this.data;
    const rootAccount = await this.user.getRootAccount();
    const rootTransaction = await transaction.getPairedTransaction();

    const previousAccount = await this.checkAccountChange();
    await this.checkCategoryChange();
    await this.checkAmountChange(rootAccount);
    this.checkOtherChanges();
    await this.checkRootTransactionChanges(rootTransaction);

    await this.manager.save(
      [previousAccount, rootAccount, transaction.account].filter(
        (acc) => !!acc,
      ),
    );

    return Transaction.saveMovementPair([transaction, rootTransaction], {
      manager: this.manager,
    });
  }
}
