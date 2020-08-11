/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { validateOrReject } from 'class-validator';

import ValidationErrors from '../graphql/errors/ValidationErrors';

@EventSubscriber()
export class CommonSubscriber<T extends object>
  implements EntitySubscriberInterface<T> {
  async validate(entity: T, name: string) {
    try {
      await validateOrReject(entity);
    } catch (validationErrors) {
      throw new ValidationErrors(name.toLowerCase(), validationErrors);
    }
  }

  async beforeInsert({ entity, metadata }: InsertEvent<T>) {
    await this.validate(entity, metadata.tableName);
  }

  async beforeUpdate({ entity, metadata }: UpdateEvent<T>) {
    await this.validate(entity, metadata.tableName);
  }
}
