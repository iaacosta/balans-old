/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import Income from '../models/Income';

@EventSubscriber()
export class MovementSubscriber implements EntitySubscriberInterface<Income> {
  listenTo() {
    return Income;
  }

  beforeInsert({ entity }: InsertEvent<Income>) {
    if (!entity.account.canReceive(entity.amount)) {
      throw new Error("the account can't receive this amount");
    }
  }

  beforeUpdate({ entity, databaseEntity }: UpdateEvent<Income>) {
    const diff = entity.amount - databaseEntity.amount;

    if (diff > 0 && !entity.account.canReceive(diff)) {
      throw new Error("the account can't receive this amount");
    }

    if (diff < 0 && !entity.account.canPay(-diff)) {
      throw new Error("the account can't pay this amount");
    }
  }

  beforeRemove({ entity }: RemoveEvent<Income>) {
    if (!entity!.account.canPay(entity!.amount)) {
      throw new Error(
        "can't delete this income because account can't afford the loss",
      );
    }
  }
}
