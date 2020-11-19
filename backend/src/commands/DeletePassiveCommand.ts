import { EntityManager, getManager } from 'typeorm';

import { CurrentUser } from '../@types';
import Account from '../models/Account';
import Passive from '../models/Passive';
import IMovementCommand from './MovementCommand';

type Data = { passive: Passive };
type PassiveTuple = [Passive, Passive];

export default class DeletePassiveCommand
  implements IMovementCommand<PassiveTuple, Data> {
  user: NonNullable<CurrentUser>;

  data: Data;

  manager: EntityManager;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Data,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = data;
    this.manager = manager || getManager();
  }

  private applyPaidBalanceChanges(passive: Passive) {
    if (passive.accountId === passive.liquidatedAccountId) return;
    Account.applyBalanceChanges({
      amount: -passive.amount,
      from: passive.account,
      to: passive.liquidatedAccount!,
    });
  }

  private applyPendingBalanceChanges(passive: Passive, rootAccount: Account) {
    Account.applyBalanceChanges({
      amount: -passive.amount,
      from: passive.account,
      to: rootAccount,
    });

    Account.applyUnliquidatedBalanceChanges({
      amount: passive.amount,
      from: passive.account,
      to: rootAccount,
    });
  }

  private applyBalanceChanges(passive: Passive, rootAccount: Account) {
    if (passive.liquidated) this.applyPaidBalanceChanges(passive);
    else this.applyPendingBalanceChanges(passive, rootAccount);
  }

  public async execute(): Promise<PassiveTuple> {
    const { passive } = this.data;
    const rootAccount = await this.user.getRootAccount();
    const rootPassive = await passive.getPairedPassive();

    this.applyBalanceChanges(passive, rootAccount);

    await this.manager.save(
      [passive.account, rootAccount, passive.liquidatedAccount].filter(
        (acc) => !!acc,
      ),
    );

    return Passive.removeMovementPair([passive, rootPassive], {
      manager: this.manager,
    });
  }
}
