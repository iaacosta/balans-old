/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { values } from 'lodash';

import User from '../models/User';
import Account from '../models/Account';
import { Currency } from '../graphql/helpers/enums/currencyEnum';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  listenTo() {
    return User;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    entity.password = await this.hashPassword(entity.password);
  }

  async afterInsert({ entity, manager }: InsertEvent<User>): Promise<void> {
    // TODO: change this when tests are adapted to multiple currencies
    const currencies = process.env.NODE_ENV === 'test' && !process.env.ALLOW_CURRENCIES ? [Currency.CLP] : Currency;
    const accounts = values(currencies).map((currency) => (
      new Account({
        name: 'Root account',
        bank: 'Balans',
        userId: entity.id,
        type: 'root',
        currency,
      })
    ));

    await manager.getRepository(Account).save(accounts);
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password === databaseEntity.password) return;
    entity.password = await this.hashPassword(entity.password);
  }
}
