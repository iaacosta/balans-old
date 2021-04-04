/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import Account from '../models/Account';
import Transaction from '../models/Transaction';
import User from '../models/User';

type Events = InsertEvent<Account> | UpdateEvent<Account>;

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  listenTo() {
    return Account;
  }

  async checkExistingRootAccount<T extends Events>(event: T): Promise<void> {
    const { entity, manager } = event;
    const account = await manager
      .getRepository(Account)
      .findOne({ type: 'root', userId: entity.userId, currency: entity.currency });
    if (account) throw new Error('this user has already a root account');
  }

  async beforeInsert(event: InsertEvent<Account>): Promise<void> {
    if (event.entity.type === 'root') {
      await this.checkExistingRootAccount(event);
    }
  }

  async beforeUpdate(event: UpdateEvent<Account>): Promise<void> {
    const { entity, databaseEntity } = event;
    if (entity.type === 'root' && entity.type !== databaseEntity.type) {
      await this.checkExistingRootAccount(event);
    }
  }

  async beforeRemove(event: RemoveEvent<Account>): Promise<void> {
    const { databaseEntity, manager } = event;

    const operations = await manager
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('transaction.operationId')
      .where('transaction.accountId = :id', { id: databaseEntity.id })
      .getMany();

    const { sum } = await manager
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)')
      .where('transaction.accountId = :id', { id: databaseEntity.id })
      .getRawOne();

    if (operations.length > 0) {
      await manager
        .getRepository(Transaction)
        .createQueryBuilder('transaction')
        .delete()
        .where('"transaction"."operationId" IN (:...operations)', {
          operations: operations.map(({ operationId }) => `${operationId}`),
        })
        .execute();
    }

    const rootAccount = await (await manager.getRepository(User).findOneOrFail({
      id: databaseEntity.userId,
    })).getRootAccount();

    const amount = parseInt(sum, 10);
    if (Number.isNaN(amount)) return;

    rootAccount.balance += amount;
    await manager.getRepository(Account).save(rootAccount);
  }
}
