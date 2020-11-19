/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreatePassiveInput } from '../graphql/helpers';
import Passive from '../models/Passive';
import Account from '../models/Account';
import { CurrentUser } from '../@types';
import IMovementCommand from './MovementCommand';

type PassiveTuple = [Passive, Passive];

type Data = {
  account: Account;
  operationId: string;
} & Omit<CreatePassiveInput, 'accountId'>;

export default class SavePassiveCommand
  implements IMovementCommand<PassiveTuple, Data> {
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

  private buildPassives(rootAccount: Account) {
    const { amount, memo, account, issuedAt, operationId } = this.data;

    return {
      passive: new Passive({
        amount,
        memo,
        accountId: account.id,
        issuedAt,
        operationId,
      }),
      rootPassive: new Passive({
        amount: -amount,
        memo: memo?.concat(' (root)'),
        accountId: rootAccount.id,
        operationId,
        issuedAt,
      }),
    };
  }

  async execute(): Promise<PassiveTuple> {
    const rootAccount = await this.user.getRootAccount({
      manager: this.manager,
    });

    Account.applyPassiveBalanceChanges({
      amount: this.data.amount,
      from: rootAccount,
      to: this.data.account,
    });

    const { passive, rootPassive } = this.buildPassives(rootAccount);

    await this.manager.save(
      [this.data.account, rootAccount].filter((acc) => acc),
    );

    return Passive.saveMovementPair([passive, rootPassive], {
      manager: this.manager,
    });
  }
}
