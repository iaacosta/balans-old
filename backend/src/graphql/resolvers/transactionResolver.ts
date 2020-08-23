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

import Transaction from '../../models/Transaction';
import { CreateTransactionInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';
import NotFoundError from '../errors/NotFoundError';

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
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();
  }

  @Mutation(() => Transaction)
  @Authorized()
  async createTransaction(
    @Arg('input') transaction: CreateTransactionInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transaction> {
    /* Check if account doesn't belong to user */
    const account = await this.accountRepository.findOneOrFail({
      id: transaction.accountId,
      userId: currentUser!.id,
    });

    return account.performTransaction(transaction.amount);
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
    await transaction.account.revertTransaction(transaction);
    return id;
  }

  @FieldResolver()
  async account(@Root() { accountId }: Transaction): Promise<Account | null> {
    const account = await this.accountRepository.findOne(accountId);
    return account || null;
  }
}