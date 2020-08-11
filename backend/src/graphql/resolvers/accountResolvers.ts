import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Repository, getRepository } from 'typeorm';

import Account from '../../models/Account';
import { CreateAccountInput } from '../helpers';
import { Context } from '../../@types';
import roles from '../../constants/roles';
import User from '../../models/User';

@Resolver(Account)
export default class AccountResolvers {
  repository: Repository<Account>;

  constructor() {
    this.repository = getRepository(Account);
  }

  @Mutation(() => Account)
  @Authorized([roles.ADMIN, roles.USER])
  async createAccount(
    @Arg('input') account: CreateAccountInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Account> {
    return this.repository.save(
      new Account({ ...account, userId: currentUser!.id }),
    );
  }

  @FieldResolver()
  async user(@Root() { userId }: Account): Promise<User | null> {
    const user = await getRepository(User).findOne(userId);
    return user || null;
  }
}
