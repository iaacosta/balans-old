/* eslint-disable no-param-reassign */
import { EntityManager, getManager } from 'typeorm';

import { LiquidatePassiveInput } from '../graphql/helpers';
import Passive from '../models/Passive';
import Account from '../models/Account';
import { CurrentUser } from '../@types';
import IMovementCommand from './MovementCommand';

type PassiveTuple = [Passive, Passive];
type Data = { liquidatedAccount: Account } & Omit<
  LiquidatePassiveInput,
  'liquidatedAccountId'
>;

export default class LiquidatePassiveCommand
  implements IMovementCommand<PassiveTuple, Data> {
  manager: EntityManager;

  data: Data;

  user: NonNullable<CurrentUser>;

  constructor(
    currentUser: NonNullable<CurrentUser>,
    data: Data,
    manager?: EntityManager,
  ) {
    this.user = currentUser;
    this.data = data;
    this.manager = manager || getManager();
  }

  private findPassive() {
    const { id } = this.data;
    return this.manager.getRepository(Passive).findOneOrFail(id);
  }

  private findOriginalAccount(passive: Passive) {
    return this.manager.getRepository(Account).findOneOrFail(passive.accountId);
  }

  private async findAccounts(passive: Passive) {
    const { liquidatedAccount } = this.data;
    const originalAccount = await this.findOriginalAccount(passive);
    const rootAccount = await this.user.getRootAccount({
      manager: this.manager,
    });

    return {
      originalAccount,
      rootAccount,
      liquidatedAccount,
    };
  }

  private async findPassives() {
    const passive = await this.findPassive();
    const rootPassive = await passive.getPairedPassive();

    return {
      passive,
      rootPassive,
    };
  }

  private liquidatePassives(passive: Passive, rootPassive: Passive) {
    passive.liquidated = true;
    rootPassive.liquidated = true;
  }

  private assignLiquidatedAccount(passive: Passive, accountId: number) {
    passive.liquidatedAccountId = accountId;
  }

  private applyBalanceChanges({
    amount,
    ...accounts
  }: {
    amount: number;
    originalAccount: Account;
    rootAccount: Account;
    liquidatedAccount: Account;
  }) {
    Account.applyPassiveBalanceChanges({
      amount,
      from: accounts.originalAccount,
      to: accounts.rootAccount,
    });

    if (accounts.originalAccount.id !== accounts.liquidatedAccount.id) {
      Account.applyBalanceChanges({
        amount,
        from: accounts.originalAccount,
        to: accounts.liquidatedAccount,
      });
    }
  }

  async execute(): Promise<PassiveTuple> {
    const { passive, rootPassive } = await this.findPassives();
    const {
      originalAccount,
      rootAccount,
      liquidatedAccount,
    } = await this.findAccounts(passive);

    this.applyBalanceChanges({
      amount: passive.amount,
      originalAccount,
      rootAccount,
      liquidatedAccount,
    });

    this.liquidatePassives(passive, rootPassive);
    this.assignLiquidatedAccount(passive, liquidatedAccount.id);

    await this.manager.save([liquidatedAccount, originalAccount, rootAccount]);
    return Passive.saveMovementPair([passive, rootPassive], {
      manager: this.manager,
    });
  }
}
