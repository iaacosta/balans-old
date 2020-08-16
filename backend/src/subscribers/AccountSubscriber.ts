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

type Events = InsertEvent<Account> | UpdateEvent<Account>;

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  listenTo() {
    return Account;
  }

  async checkExistingRootAccount<T extends Events>(event: T) {
    const { entity, manager } = event;
    const account = await manager
      .getRepository(Account)
      .findOne({ type: 'root', userId: entity.userId });
    if (account) throw new Error('this user has already a root account');
  }

  async beforeInsert(event: InsertEvent<Account>) {
    if (event.entity.type === 'root') {
      await this.checkExistingRootAccount(event);
    }
  }

  async beforeUpdate(event: UpdateEvent<Account>) {
    const { entity, databaseEntity } = event;
    if (entity.type === 'root' && entity.type !== databaseEntity.type) {
      await this.checkExistingRootAccount(event);
    }
  }

  async beforeRemove(event: RemoveEvent<Account>) {
    const { databaseEntity, manager } = event;

    const { sum } = await manager
      .getRepository(Transaction)
      .createQueryBuilder()
      .select('SUM("amount")')
      .where('"accountId" = :id', { id: databaseEntity.id })
      .getRawOne();

    const rootAccount = await manager.getRepository(Account).findOneOrFail({
      type: 'root',
      userId: databaseEntity.userId,
    });

    await rootAccount.performTransaction(parseInt(sum, 10));
  }
}
