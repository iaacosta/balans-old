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

import User from '../models/User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async hashPassword(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async beforeInsert({ entity }: InsertEvent<User>) {
    entity.password = await this.hashPassword(entity.password);
  }

  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<User>) {
    if (entity.password === databaseEntity.password) return;
    entity.password = await this.hashPassword(entity.password);
  }
}
