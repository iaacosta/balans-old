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
  operationExchangeRate?: CreateTransferInput['operationExchangeRate'];
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

  private get convertedAmount() {
    const exchangeRate = this.data.operationExchangeRate || 1;
    return Math.round(this.data.amount / exchangeRate);
  }

  private buildTransfers() {
    const {
      amount,
      memo,
      fromAccount,
      toAccount,
      issuedAt,
      operationId,
      operationExchangeRate,
    } = this.data;

    return {
      from: new Transfer({
        amount: -amount,
        memo,
        accountId: fromAccount.id,
        operationId,
        issuedAt,
        operationExchangeRate,
      }),
      to: new Transfer({
        amount: this.convertedAmount,
        memo,
        accountId: toAccount.id,
        operationId,
        issuedAt,
        operationExchangeRate,
      }),
    };
  }

  async execute(): Promise<TransferTuple> {
    Account.applyDetailedBalanceChange({
      fromAmount: this.data.amount,
      from: this.data.fromAccount,
      toAmount: this.convertedAmount,
      to: this.data.toAccount,
    });

    await this.manager.save([this.data.fromAccount, this.data.toAccount]);
    const { from, to } = this.buildTransfers();
    return Transfer.saveMovementPair([from, to]);
  }
}
