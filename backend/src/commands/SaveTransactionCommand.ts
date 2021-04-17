import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateMovementCommandInput, CurrentUser } from '../@types';
import { CreateTransactionInput } from '../graphql/helpers';
import Account from '../models/Account';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import IMovementCommand from './MovementCommand';

type Data = {
  account: Account;
  category?: Category;
  operationId: string;
} & CreateMovementCommandInput<CreateTransactionInput>;

type TransactionTuple = [Transaction, Transaction];

export default class SaveTransactionCommand
  implements IMovementCommand<TransactionTuple, Data> {
  user: NonNullable<CurrentUser>;

  data: Data;

  manager: EntityManager;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Omit<Data, 'operationId'>,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = { ...data, operationId: uuid() };
    this.manager = manager || getManager();
  }

  private buildTransactions(rootAccount: Account) {
    const {
      account,
      category,
      amount,
      memo,
      issuedAt,
      operationId,
    } = this.data;

    return {
      transaction: new Transaction({
        amount,
        memo,
        accountId: account.id,
        issuedAt,
        operationId,
        category,
      }),
      rootTransaction: new Transaction({
        amount: -amount,
        memo: memo?.concat(' (root)'),
        accountId: rootAccount.id,
        operationId,
        issuedAt,
        root: true,
      }),
    };
  }

  public async execute(): Promise<TransactionTuple> {
    const rootAccount = await this.user.getRootAccount(this.data.account.currency, {
      manager: this.manager,
    });

    Account.applyBalanceChanges({
      amount: this.data.amount,
      from: rootAccount,
      to: this.data.account,
    });

    const { transaction, rootTransaction } = this.buildTransactions(
      rootAccount,
    );

    await this.manager.save([this.data.account, rootAccount]);

    return Transaction.saveMovementPair([transaction, rootTransaction], {
      manager: this.manager,
    });
  }
}
