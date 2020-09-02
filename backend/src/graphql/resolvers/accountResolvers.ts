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
import { Repository, getRepository, getConnection } from 'typeorm';

import Account from '../../models/Account';
import { CreateAccountInput } from '../helpers';
import { Context } from '../../@types';
import User from '../../models/User';
import TransactionCommands from '../../commands/TransactionCommands';

@Resolver(Account)
export default class AccountResolvers {
  repository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Account);
  }

  @Query(() => [Account])
  @Authorized()
  async myAccounts(@Ctx() { currentUser }: Context): Promise<Account[]> {
    return this.repository
      .createQueryBuilder('account')
      .select()
      .where('account.userId = :id', { id: currentUser!.id })
      .andWhere('account.type != :type', { type: 'root' })
      .orderBy('account.createdAt', 'DESC')
      .getMany();
  }

  @Mutation(() => Account)
  @Authorized()
  async createAccount(
    @Arg('input') { initialBalance, ...accountInput }: CreateAccountInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Account> {
    const account = getConnection().transaction(async (entityManager) => {
      const createdAccount = await entityManager
        .getRepository(Account)
        .save(new Account({ ...accountInput, userId: currentUser!.id }), {
          transaction: false,
        });

      if (initialBalance !== 0) {
        const transactionCommands = new TransactionCommands(
          currentUser!,
          entityManager,
        );

        await transactionCommands.create(
          { memo: 'Initial balance', amount: initialBalance },
          { account: createdAccount },
        );
      }

      return createdAccount;
    });

    return account;
  }

  /* TODO: use soft removal + UI to restore */
  @Mutation(() => ID)
  @Authorized()
  async deleteAccount(
    @Arg('id', () => ID) id: number,
    @Ctx() { currentUser }: Context,
  ): Promise<number> {
    const account = await this.repository.findOneOrFail({
      id,
      userId: currentUser!.id,
    });
    await this.repository.remove(account);
    return id;
  }

  /* TODO: check if this is necessary */
  @FieldResolver()
  async user(@Root() { userId }: Account): Promise<User | null> {
    const user = await getRepository(User).findOne(userId);
    return user || null;
  }
}
