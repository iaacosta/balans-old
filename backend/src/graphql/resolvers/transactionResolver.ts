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
import TransactionHelper from '../../helpers/TransactionHelper';
import NoChangesError from '../errors/NoChangesError';

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
    @Arg('input') { accountId, ...transactionInput }: CreateTransactionInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Transaction> {
    const transactionHelper = new TransactionHelper(currentUser!);

    const account = await this.accountRepository.findOneOrFail({
      id: accountId,
      userId: currentUser!.id,
    });

    const [transaction] = await transactionHelper.performTransaction(
      transactionInput,
      account,
    );

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
    const transactionHelper = new TransactionHelper(currentUser!);

    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');
    const [updatedTransaction] = await transactionHelper.updateTransaction(
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
    const transactionHelper = new TransactionHelper(currentUser!);
    const transaction = await this.repository
      .createQueryBuilder('transaction')
      .select()
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId: currentUser!.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transaction) throw new NotFoundError('transaction');
    await transactionHelper.revertTransaction(transaction);
    return id;
  }

  @FieldResolver()
  async account(@Root() { accountId }: Transaction): Promise<Account | null> {
    const account = await this.accountRepository.findOne(accountId);
    return account || null;
  }
}
