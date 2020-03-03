/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import Expense from '../models/Expense';

@EventSubscriber()
export class MovementSubscriber implements EntitySubscriberInterface<Expense> {
  listenTo() {
    return Expense;
  }

  beforeInsert({ entity }: InsertEvent<Expense>) {
    if (!entity.account.canPay(entity.amount)) {
      throw new Error("the account can't pay this amount");
    }
  }

  beforeUpdate({ entity, databaseEntity }: UpdateEvent<Expense>) {
    const diff = databaseEntity.amount - entity.amount;

    if (diff > 0 && !entity.account.canReceive(diff)) {
      throw new Error("the account can't receive this amount");
    }

    if (diff < 0 && !entity.account.canPay(-diff)) {
      throw new Error("the account can't pay this amount");
    }
  }

  beforeRemove({ entity }: RemoveEvent<Expense>) {
    if (!entity!.account.canReceive(entity!.amount)) {
      throw new Error(
        "can't delete this expense because account can't afford the gain",
      );
    }
  }
}
