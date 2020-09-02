/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateTransferInput } from '../graphql/helpers';
import Transfer from '../models/Transfer';
import Account from '../models/Account';
import User from '../models/User';

export default class TransferCommands {
  manager: EntityManager;

  user: Pick<User, 'id'>;

  constructor(currentUser: Pick<User, 'id'>, manager?: EntityManager) {
    this.user = currentUser;
    this.manager = manager || getManager();
  }

  async create(
    { memo, amount }: Pick<CreateTransferInput, 'memo' | 'amount'>,
    { fromAccount, toAccount }: { fromAccount: Account; toAccount: Account },
  ): Promise<Transfer[]> {
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    const operationId = uuid();
    await this.manager.getRepository(Account).save([fromAccount, toAccount]);
    return this.manager.getRepository(Transfer).save([
      new Transfer({
        amount: -amount,
        memo,
        accountId: fromAccount.id,
        operationId,
      }),
      new Transfer({
        amount,
        memo,
        accountId: toAccount.id,
        operationId,
      }),
    ]);
  }
}