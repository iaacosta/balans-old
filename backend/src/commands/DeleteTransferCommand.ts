/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';

import Transfer from '../models/Transfer';
import Account from '../models/Account';
import { CurrentUser } from '../@types';
import IMovementCommand from './MovementCommand';

type TransferTuple = [Transfer, Transfer];
type Data = {
  fromTransfer: Transfer;
  toTransfer: Transfer;
};

export default class DeleteTransferCommand
  implements IMovementCommand<TransferTuple, Data> {
  manager: EntityManager;

  user: NonNullable<CurrentUser>;

  data: Data;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Data,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = data;
    this.manager = manager || getManager();
  }

  async execute(): Promise<TransferTuple> {
    Account.applyDetailedBalanceChange({
      from: this.data.toTransfer.account,
      fromAmount: this.data.toTransfer.amount,
      to: this.data.fromTransfer.account,
      toAmount: -this.data.fromTransfer.amount,
    });

    await this.manager.save([
      this.data.toTransfer.account,
      this.data.fromTransfer.account,
    ]);

    return Transfer.removeMovementPair([
      this.data.fromTransfer,
      this.data.toTransfer,
    ]);
  }
}
