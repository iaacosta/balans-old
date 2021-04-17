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
import { Repository, getRepository, Not, getManager } from 'typeorm';

import Account from '../../models/Account';
import { CreateAccountInput } from '../helpers';
import { Context } from '../../@types';
import User from '../../models/User';
import SaveTransactionCommand from '../../commands/SaveTransactionCommand';

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
    return getManager().transaction(async (entityManager) => {
      const createdAccount = await entityManager
        .getRepository(Account)
        .save(new Account({ ...accountInput, userId: currentUser!.id }), {
          transaction: false,
        });

      if (initialBalance !== 0) {
        const transactionCommands = new SaveTransactionCommand(
          currentUser!,
          {
            account: createdAccount,
            memo: 'Initial balance',
            amount: initialBalance,
          },
          entityManager,
        );

        await transactionCommands.execute();
      }

      return createdAccount;
    });
  }

  @Mutation(() => ID)
  @Authorized()
  async deleteAccount(
    @Arg('id', () => ID) id: number,
    @Ctx() { currentUser }: Context,
  ): Promise<number> {
    const account = await this.repository.findOneOrFail({
      where: { id, userId: currentUser!.id, type: Not('root') },
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
