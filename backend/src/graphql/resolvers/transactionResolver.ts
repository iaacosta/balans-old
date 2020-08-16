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
import { Repository, getRepository, getConnection } from 'typeorm';

import Transaction from '../../models/Transaction';
import { CreateTransactionInput } from '../helpers';
import { Context } from '../../@types';
import Account from '../../models/Account';

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
      .createQueryBuilder()
      .select()
      .leftJoin(
        Account,
        'Account',
        '"Account"."id" = "Transaction"."accountId"',
      )
      .where('"Account"."userId" = :id', { id: currentUser!.id })
      .andWhere('"Account"."type" != :type', { type: 'root' })
      .orderBy('"Transaction"."createdAt"', 'DESC')
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

    const rootAccount = await this.accountRepository.findOneOrFail({
      type: 'root',
      userId: currentUser!.id,
    });

    return getConnection().transaction(async (manager) => {
      await rootAccount.performTransaction(-transaction.amount, {
        transaction: false,
        entityManager: manager,
      });

      return account.performTransaction(transaction.amount, {
        transaction: false,
        entityManager: manager,
      });
    });
  }

  @FieldResolver()
  async account(@Root() { accountId }: Transaction): Promise<Account | null> {
    const account = await this.accountRepository.findOne(accountId);
    return account || null;
  }
}
