import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  Query,
} from 'type-graphql';
import { Repository, getRepository, getManager, Not } from 'typeorm';

import Passive from '../../models/Passive';
import { Context } from '../../@types';
import Account from '../../models/Account';
import { CreatePassiveInput, LiquidatePassiveInput } from '../helpers/inputs';
import SavePassiveCommand from '../../commands/SavePassiveCommand';
import LiquidatePassiveCommand from '../../commands/LiquidatePassiveCommand';

@Resolver(Passive)
export default class PassiveResolvers {
  repository: Repository<Passive>;

  accountRepository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Passive);
    this.accountRepository = getRepository(Account);
  }

  @Query(() => [Passive])
  @Authorized()
  myPassives(@Ctx() { currentUser }: Context): Promise<Passive[]> {
    return this.repository
      .createQueryBuilder('passive')
      .select()
      .leftJoin('passive.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('account.type != :type', { type: 'root' })
      .orderBy('passive.issuedAt', 'DESC')
      .getMany();
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

  @Mutation(() => Passive)
  @Authorized()
  async liquidatePassive(
    @Arg('input')
    { liquidatedAccountId, ...input }: LiquidatePassiveInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Passive> {
    const liquidatedAccount = await this.accountRepository.findOneOrFail({
      where: {
        id: liquidatedAccountId,
        userId: currentUser!.id,
        type: Not('root'),
      },
    });

    return getManager().transaction(async (passiveManager) => {
      const command = new LiquidatePassiveCommand(
        currentUser!,
        { liquidatedAccount, ...input },
        passiveManager,
      );

      const [liquidatedPassive] = await command.execute();
      return liquidatedPassive;
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
