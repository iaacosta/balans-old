import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  Query,
  ID,
} from 'type-graphql';
import { Repository, getRepository, getManager, Not } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import Passive from '../../models/Passive';
import { Context } from '../../@types';
import Account from '../../models/Account';
import { CreatePassiveInput, LiquidatePassiveInput } from '../helpers/inputs';
import SavePassiveCommand from '../../commands/SavePassiveCommand';
import LiquidatePassiveCommand from '../../commands/LiquidatePassiveCommand';
import NotFoundError from '../errors/NotFoundError';
import DeletePassiveCommand from '../../commands/DeletePassiveCommand';

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
    { id, liquidatedAccountId }: LiquidatePassiveInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Passive> {
    const passive = await this.repository
      .createQueryBuilder('passive')
      .select()
      .leftJoinAndSelect('passive.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('passive.id = :id', { id })
      .andWhere('passive.root = false')
      .getOne();

    if (!passive) throw new NotFoundError('passive');
    if (passive.liquidated) {
      throw new ApolloError('passive was already liquidated');
    }

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
        { passive, liquidatedAccount },
        passiveManager,
      );

      const [liquidatedPassive] = await command.execute();
      return liquidatedPassive;
    });
  }

  @Mutation(() => ID)
  @Authorized()
  async deletePassive(
    @Arg('id', () => ID) id: string,
    @Ctx() { currentUser }: Context,
  ): Promise<string> {
    const passive = await this.repository
      .createQueryBuilder('passive')
      .select()
      .leftJoinAndSelect('passive.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('passive.id = :id', { id })
      .getOne();

    if (!passive) throw new NotFoundError('passive');

    if (passive.liquidated) {
      passive.liquidatedAccount = await getManager()
        .getRepository(Account)
        .findOneOrFail(passive.liquidatedAccountId);
    }

    await getManager().transaction((transactionManager) => {
      const command = new DeletePassiveCommand(
        currentUser!,
        { passive },
        transactionManager,
      );

      return command.execute();
    });

    return id;
  }

  @FieldResolver(() => Account)
  async account(
    @Root() { accountId }: Passive,
    @Ctx() { loaders }: Context,
  ): Promise<Account | null> {
    if (!accountId) return null;
    return loaders.accounts.byId.load(accountId);
  }

  @FieldResolver(() => Account)
  async liquidatedAccount(
    @Root() { liquidatedAccountId }: Passive,
    @Ctx() { loaders }: Context,
  ): Promise<Account | null> {
    if (!liquidatedAccountId) return null;
    return loaders.accounts.byId.load(liquidatedAccountId);
  }
}
