/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';

import User from '../models/User';
import Account from '../models/Account';
import { CryptoUtil } from '../utils';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  listenTo() {
    return User;
  }

  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    entity.password = await CryptoUtil.hashData(entity.password);
  }

  async afterInsert({ entity, manager }: InsertEvent<User>): Promise<void> {
    await manager.getRepository(Account).save(
      new Account({
        name: 'Root account',
        bank: 'Balans',
        userId: entity.id,
        type: 'root',
      }),
    );
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password === databaseEntity.password) return;
    entity.password = await CryptoUtil.hashData(entity.password);
  }
}
