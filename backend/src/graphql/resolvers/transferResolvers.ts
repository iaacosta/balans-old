import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  Query,
  ObjectType,
  Field,
} from 'type-graphql';
import { EntityManager, getConnection } from 'typeorm';
import { groupBy, map } from 'lodash';

import Transfer from '../../models/Transfer';
import { CreateTransferInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';
import NotFoundError from '../errors/NotFoundError';
import SaveTransferCommand from '../../commands/SaveTransferCommand';
import DeleteTransferCommand from '../../commands/DeleteTransferCommand';

@ObjectType()
class PairedTransfer {
  @Field(() => Transfer)
  from: Transfer;

  @Field(() => Transfer)
  to: Transfer;
}

@Resolver(Transfer)
export default class TransferResolvers {
  manager: EntityManager;

  constructor() {
    this.manager = getConnection().createEntityManager();
  }

  @Query(() => [Transfer])
  @Authorized()
  async myTransfers(@Ctx() { currentUser }: Context): Promise<Transfer[]> {
    return this.manager
      .getRepository(Transfer)
      .createQueryBuilder('transfer')
      .select()
      .leftJoin('transfer.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .orderBy('transfer.createdAt', 'DESC')
      .addOrderBy('transfer.amount', 'ASC')
      .getMany();
  }

  @Query(() => [PairedTransfer])
  @Authorized()
  async myPairedTransfers(
    @Ctx() { currentUser }: Context,
  ): Promise<PairedTransfer[]> {
    const transfers = await this.manager
      .getRepository(Transfer)
      .createQueryBuilder('transfer')
      .select()
      .leftJoin('transfer.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .orderBy('transfer.issuedAt', 'DESC')
      .addOrderBy('transfer.amount', 'ASC')
      .getMany();

    return map(groupBy(transfers, 'operationId'), ([from, to]) => ({
      from,
      to,
    }));
  }

  @Mutation(() => [Transfer])
  @Authorized()
  async createTransfer(
    @Arg('input')
    { fromAccountId, toAccountId, ...transferInput }: CreateTransferInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transfer[]> {
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

    return this.manager.transaction((transactionManager) => {
      const command = new SaveTransferCommand(
        currentUser!,
        { fromAccount, toAccount, ...transferInput },
        transactionManager,
      );

      return command.execute();
    });
  }

  @Mutation(() => String)
  @Authorized()
  async deleteTransfer(
    @Arg('operationId') operationId: string,
    @Ctx() { currentUser }: Context,
  ): Promise<string> {
    const [toTransfer, fromTransfer] = await this.manager
      .getRepository(Transfer)
      .createQueryBuilder('transfer')
      .select()
      .leftJoinAndSelect('transfer.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transfer.operationId = :operationId', { operationId })
      .orderBy('transfer.amount', 'ASC')
      .getMany();

    if (!toTransfer || !fromTransfer) throw new NotFoundError('transfer');

    await this.manager.transaction((transactionManager) => {
      const transferCommands = new DeleteTransferCommand(
        currentUser!,
        { toTransfer, fromTransfer },
        transactionManager,
      );

      return transferCommands.execute();
    });

    return operationId;
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
