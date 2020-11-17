import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Repository, getRepository, getManager, Not } from 'typeorm';

import Passive from '../../models/Passive';
import { Context } from '../../@types';
import Account from '../../models/Account';
import { CreatePassiveInput } from '../helpers/inputs';
import SavePassiveCommand from '../../commands/SavePassiveCommand';

@Resolver(Passive)
export default class PassiveResolvers {
  repository: Repository<Passive>;

  accountRepository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Passive);
    this.accountRepository = getRepository(Account);
  }

  @Mutation(() => Passive)
  @Authorized()
  async createPassive(
    @Arg('input')
    { accountId, ...loanInput }: CreatePassiveInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Passive> {
    const account = await this.accountRepository.findOneOrFail({
      where: { id: accountId, userId: currentUser!.id, type: Not('root') },
    });

    return getManager().transaction(async (passiveManager) => {
      const command = new SavePassiveCommand(
        currentUser!,
        { account, ...loanInput },
        passiveManager,
      );

      const [passive] = await command.execute();
      return passive;
    });
  }

  @FieldResolver(() => Account)
  async account(
    @Root() { accountId }: Passive,
    @Ctx() { loaders }: Context,
  ): Promise<Account | null> {
    if (!accountId) return null;
    return loaders.accounts.byId.load(accountId);
  }
}
