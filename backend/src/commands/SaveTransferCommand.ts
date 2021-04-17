/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateTransferInput } from '../graphql/helpers';
import Transfer from '../models/Transfer';
import Account from '../models/Account';
import { CreateMovementCommandInput, CurrentUser } from '../@types';
import IMovementCommand from './MovementCommand';

type TransferTuple = [Transfer, Transfer];
type Data = {
  fromAccount: Account;
  toAccount: Account;
  operationId: string;
} & CreateMovementCommandInput<CreateTransferInput>;

export default class SaveTransferCommand
  implements IMovementCommand<TransferTuple, Data> {
  manager: EntityManager;

  data: Data;

  user: NonNullable<CurrentUser>;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Omit<Data, 'operationId'>,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = { ...data, operationId: uuid() };
    this.manager = manager || getManager();
  }

  private buildTransfers() {
    const {
      amount,
      memo,
      fromAccount,
      toAccount,
      issuedAt,
      operationId,
    } = this.data;

    return {
      from: new Transfer({
        amount: -amount,
        memo,
        accountId: fromAccount.id,
        operationId,
        issuedAt,
      }),
      to: new Transfer({
        amount,
        memo,
        accountId: toAccount.id,
        operationId,
        issuedAt,
      }),
    };
  }

  async execute(): Promise<TransferTuple> {
    Account.applyBalanceChanges({
      amount: this.data.amount,
      from: this.data.fromAccount,
      to: this.data.toAccount,
    });

    await this.manager.save([this.data.fromAccount, this.data.toAccount]);
    const { from, to } = this.buildTransfers();
    return Transfer.saveMovementPair([from, to]);
  }
}
