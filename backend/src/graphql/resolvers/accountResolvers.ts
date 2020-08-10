import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import { createQueryBuilder } from 'typeorm';

import Account from '../../models/Account';
import { CreateAccountInput } from '../helpers';
import { Context } from '../../@types';
import roles from '../../constants/roles';
import User from '../../models/User';

@Resolver(Account)
export default class AuthenticationResolvers {
  @Mutation(() => Account)
  @Authorized([roles.ADMIN, roles.USER])
  async createAccount(
    @Arg('input') account: CreateAccountInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Account> {
    const createdAccount = await createQueryBuilder(Account)
      .insert()
      .values([new Account({ ...account, userId: currentUser!.id })])
      .getEntity();

    return createdAccount;
  }

  @FieldResolver()
  async user(@Root() { userId }: Account): Promise<User | null> {
    const user = await createQueryBuilder(User)
      .select()
      .where('id = :userId', { userId })
      .getOne();

    return user || null;
  }
}
