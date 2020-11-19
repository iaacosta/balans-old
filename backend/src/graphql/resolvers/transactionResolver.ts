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
import { Repository, getRepository, getManager } from 'typeorm';
import { size } from 'lodash';

import Transaction from '../../models/Transaction';
import { CreateTransactionInput, UpdateTransactionInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';
import NotFoundError from '../errors/NotFoundError';
import NoChangesError from '../errors/NoChangesError';
import Category from '../../models/Category';
import SaveTransactionCommand from '../../commands/SaveTransactionCommand';
import UpdateTransactionCommand from '../../commands/UpdateTransactionCommand';
import DeleteTransactionCommand from '../../commands/DeleteTransactionCommand';

@Resolver(Transaction)
export default class TransactionResolvers {
  repository: Repository<Transaction>;

  accountRepository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Transaction);
    this.accountRepository = getRepository(Account);
  }

  @Query(() => [Transaction])
  @Authorized()
  myTransactions(@Ctx() { currentUser }: Context): Promise<Transaction[]> {
    return this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoin('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('account.type != :type', { type: 'root' })
      .orderBy('transaction.issuedAt', 'DESC')
      .getMany();
  }

  @Mutation(() => Transaction)
  @Authorized()
  async createTransaction(
    @Arg('input')
    { accountId, categoryId, ...transactionInput }: CreateTransactionInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transaction> {
    const account = await this.accountRepository.findOneOrFail({
      id: accountId,
      userId: currentUser!.id,
    });

    const category = await getRepository(Category).findOneOrFail({
      id: categoryId,
      userId: currentUser!.id,
    });

    return getManager().transaction(async (transactionManager) => {
      const command = new SaveTransactionCommand(
        currentUser!,
        { account, category, ...transactionInput },
        transactionManager,
      );

      const [transaction] = await command.execute();
      return transaction;
    });
  }

  @Mutation(() => Transaction)
  @Authorized()
  async updateTransaction(
    @Arg('input')
    { id, ...toChange }: UpdateTransactionInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transaction> {
    if (!size(toChange)) throw new NoChangesError();

    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');

    return getManager().transaction(async (transactionManager) => {
      const command = new UpdateTransactionCommand(
        currentUser!,
        { transaction, ...toChange },
        transactionManager,
      );

      const [updatedTransaction] = await command.execute();
      return updatedTransaction;
    });
  }

  @Mutation(() => ID)
  @Authorized()
  async deleteTransaction(
    @Arg('id', () => ID) id: string,
    @Ctx() { currentUser }: Context,
  ): Promise<string> {
    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');

    await getManager().transaction((transactionManager) => {
      const command = new DeleteTransactionCommand(
        currentUser!,
        { transaction },
        transactionManager,
      );

      return command.execute();
    });

    return id;
  }

  @FieldResolver(() => Account)
  async account(
    @Root() { accountId }: Transaction,
    @Ctx() { loaders }: Context,
  ): Promise<Account | null> {
    if (!accountId) return null;
    return loaders.accounts.byId.load(accountId);
  }

  @FieldResolver()
  async category(
    @Root() { categoryId }: Transaction,
    @Ctx() { loaders }: Context,
  ): Promise<Category | null> {
    if (!categoryId) return null;
    return loaders.categories.byId.load(categoryId);
  }
}
