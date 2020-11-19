import { EntityManager, getManager } from 'typeorm';

import { CurrentUser } from '../@types';
import Account from '../models/Account';
import Transaction from '../models/Transaction';
import IMovementCommand from './MovementCommand';

type Data = { transaction: Transaction };
type TransactionTuple = [Transaction, Transaction];

export default class DeleteTransactionCommand
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

  public async execute(): Promise<TransactionTuple> {
    const { transaction } = this.data;
    const rootAccount = await this.user.getRootAccount();
    const rootTransaction = await transaction.getPairedTransaction();

    Account.applyBalanceChanges({
      amount: transaction.amount,
      from: transaction.account,
      to: rootAccount,
    });

    await this.manager.save([transaction.account, rootAccount]);
    return Transaction.removeMovementPair([transaction, rootTransaction], {
      manager: this.manager,
    });
  }
}
