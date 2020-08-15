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

import Account from '../../models/Account';
import { CreateAccountInput } from '../helpers';
import { Context } from '../../@types';
import User from '../../models/User';

@Resolver(Account)
export default class AccountResolvers {
  repository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Account);
  }

  @Query(() => [Account])
  @Authorized()
  async myAccounts(@Ctx() { currentUser }: Context): Promise<Account[]> {
    return this.repository.find({
      where: { userId: currentUser!.id },
      order: { createdAt: 'DESC' },
    });
  }

  @Mutation(() => Account)
  @Authorized()
  async createAccount(
    @Arg('input') account: CreateAccountInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Account> {
    return this.repository.save(
      new Account({ ...account, userId: currentUser!.id }),
    );
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

  @FieldResolver()
  async user(@Root() { userId }: Account): Promise<User | null> {
    const user = await getRepository(User).findOne(userId);
    return user || null;
  }
}
