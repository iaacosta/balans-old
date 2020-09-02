import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import { EntityManager, getConnection } from 'typeorm';

import Transfer from '../../models/Transfer';
import { CreateTransferInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';
import TransferCommands from '../../commands/TransferCommands';

@Resolver(Transfer)
export default class TransferResolvers {
  manager: EntityManager;

  constructor() {
    this.manager = getConnection().createEntityManager();
  }

  @Mutation(() => [Transfer])
  @Authorized()
  async createTransfer(
    @Arg('input')
    { fromAccountId, toAccountId, ...transferInput }: CreateTransferInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transfer[]> {
    const transferCommands = new TransferCommands(currentUser!);

    const fromAccount = await this.manager
      .getRepository(Account)
      .findOneOrFail({
        id: fromAccountId,
        userId: currentUser!.id,
      });

    const toAccount = await this.manager.getRepository(Account).findOneOrFail({
      id: toAccountId,
      userId: currentUser!.id,
    });

    return transferCommands.create(transferInput, { fromAccount, toAccount });
  }

  @FieldResolver(() => Account)
  async account(
    @Root() { accountId }: Transfer,
    @Ctx() { loaders }: Context,
  ): Promise<Account | null> {
    if (!accountId) return null;
    return loaders.accounts.byId.load(accountId);
  }
}
