/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
  EntityManager,
} from 'typeorm';

import Account from '../models/Account';
import Transaction from '../models/Transaction';

type Events = InsertEvent<Transaction> | UpdateEvent<Transaction>;

@EventSubscriber()
export class TransactionSubscriber
  implements EntitySubscriberInterface<Transaction> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  listenTo() {
    return Transaction;
  }

  private async _findAccounts(
    entity: Transaction,
    manager: EntityManager,
  ): Promise<[Account, Account] | null> {
    const account = await manager
      .getRepository(Account)
      .findOneOrFail({ id: entity.accountId });

    /*
      If the original account is type 'root', then this
      is the root transaction
    */
    if (account.type === 'root') return null;

    return [
      account,
      await manager.getRepository(Account).findOneOrFail({
        type: 'root',
        userId: account.userId,
      }),
    ];
  }

  async beforeInsert(event: InsertEvent<Transaction>): Promise<void> {
    const accounts = await this._findAccounts(event.entity, event.manager);

    /*
      Don't do anything if the transaction being saved is a
      root transaction, so that there's no infinite recursion.
    */
    if (!accounts) return;

    const [account, rootAccount] = accounts;
    const { entity, manager } = event;
    const { amount, memo, operationId } = entity;

    /* Refresh balances */
    account.balance += amount;
    rootAccount.balance -= amount;
    await manager.getRepository(Account).save([account, rootAccount]);

    /* Create the root transaction and update entity */
    const rootTransaction = new Transaction({
      amount: -amount,
      memo: memo && `(root) ${memo}`,
      accountId: rootAccount.id,
    });

    rootTransaction.operationId = operationId;
    rootTransaction.resultantBalance = rootAccount.balance;
    entity.resultantBalance = account.balance;

    await manager.getRepository(Transaction).save(rootTransaction);
  }

  async beforeRemove(event: RemoveEvent<Transaction>): Promise<void> {
    if (!event.entity || !event.databaseEntity) return;

    const accounts = await this._findAccounts(
      event.databaseEntity,
      event.manager,
    );

    /*
      Don't do anything if the transaction being deleted is a
      root transaction, so that there's no infinite recursion.
    */
    if (!accounts) return;

    const [account, rootAccount] = accounts;
    const { databaseEntity, manager } = event;

    const siblingTransaction = await manager
      .getRepository(Transaction)
      .findOneOrFail({
        accountId: rootAccount.id,
        operationId: databaseEntity.operationId,
      });

    account.balance -= databaseEntity.amount;
    rootAccount.balance += databaseEntity.amount;

    await manager.getRepository(Account).save([account, rootAccount]);
    await manager.getRepository(Transaction).remove(siblingTransaction);
  }
}
