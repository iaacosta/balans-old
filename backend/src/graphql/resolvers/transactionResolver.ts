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
import { Repository, getRepository } from 'typeorm';
import { size } from 'lodash';

import Transaction from '../../models/Transaction';
import { CreateTransactionInput, UpdateTransactionInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';
import NotFoundError from '../errors/NotFoundError';
import TransactionCommands from '../../commands/TransactionCommands';
import NoChangesError from '../errors/NoChangesError';
import Category from '../../models/Category';

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
    const transactionCommands = new TransactionCommands(currentUser!);

    const account = await this.accountRepository.findOneOrFail({
      id: accountId,
      userId: currentUser!.id,
    });

    const category = await getRepository(Category).findOneOrFail({
      id: categoryId,
      userId: currentUser!.id,
    });

    const [transaction] = await transactionCommands.create(transactionInput, {
      account,
      category,
    });

    return transaction;
  }

  @Mutation(() => Transaction)
  @Authorized()
  async updateTransaction(
    @Arg('input')
    { id, ...toChange }: UpdateTransactionInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transaction> {
    if (!size(toChange)) throw new NoChangesError();
    const transactionCommands = new TransactionCommands(currentUser!);

    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');
    const [updatedTransaction] = await transactionCommands.update(
      transaction,
      toChange,
    );

    return updatedTransaction;
  }

  @Mutation(() => ID)
  @Authorized()
  async deleteTransaction(
    @Arg('id', () => ID) id: string,
    @Ctx() { currentUser }: Context,
  ): Promise<string> {
    const transactionCommands = new TransactionCommands(currentUser!);
    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');
    await transactionCommands.delete(transaction);
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
