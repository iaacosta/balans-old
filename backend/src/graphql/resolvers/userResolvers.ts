import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Authorized,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import { getRepository, Repository } from 'typeorm';
import { size } from 'lodash';

import User from '../../models/User';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateAnyUserInput,
} from '../helpers';
import NoChangesError from '../errors/NoChangesError';
import roles from '../../constants/roles';
import { Context } from '../../@types';
import { updateEntity } from '../../utils/typeORM';
import Account from '../../models/Account';

@Resolver(User)
export default class UserResolvers {
  repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  @Query(() => [User])
  @Authorized(roles.ADMIN)
  users(): Promise<User[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  @Query(() => [User])
  @Authorized(roles.ADMIN)
  deletedUsers(): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .select()
      .orderBy('"createdAt"', 'DESC')
      .withDeleted()
      .where('"deletedAt" IS NOT NULL')
      .getMany();
  }

  @Query(() => User)
  @Authorized(roles.ADMIN)
  user(@Arg('id', () => ID) id: string): Promise<User> {
    return this.repository.findOneOrFail(id);
  }

  @Query(() => User)
  @Authorized()
  me(@Ctx() { currentUser }: Context): Promise<User> {
    return this.repository.findOneOrFail(currentUser!.id);
  }

  @Mutation(() => User)
  createUser(
    @Arg('input')
    user: CreateUserInput,
  ): Promise<User> {
    return this.repository.save(new User(user));
  }

  @Mutation(() => User)
  @Authorized(roles.ADMIN)
  async updateUser(
    @Arg('input')
    { id, ...toChange }: UpdateAnyUserInput,
  ): Promise<User> {
    if (!size(toChange)) throw new NoChangesError();
    const user = await this.repository.findOneOrFail(id);
    updateEntity(user, toChange);
    return this.repository.save(user);
  }

  @Mutation(() => User)
  @Authorized()
  async updateMe(
    @Arg('input')
    { currentPassword, ...toChange }: UpdateUserInput,
    @Ctx()
    { currentUser }: Context,
  ): Promise<User> {
    if (!size(toChange)) throw new NoChangesError();
    const user = await this.repository.findOneOrFail(currentUser!.id);
    await user.verifyPassword(currentPassword);
    updateEntity(user, toChange);
    return this.repository.save(user);
  }

  @Mutation(() => ID)
  @Authorized(roles.ADMIN)
  async deleteUser(@Arg('id', () => ID) id: string): Promise<string> {
    const user = await this.repository.findOneOrFail(id);
    await this.repository.softRemove(user);
    return id;
  }

  @Mutation(() => User)
  @Authorized(roles.ADMIN)
  async restoreUser(@Arg('id', () => ID) id: string): Promise<User> {
    const user = await this.repository.findOneOrFail(id, { withDeleted: true });
    return this.repository.recover(user);
  }

  @FieldResolver()
  accounts(@Root() { id }: User): Promise<Account[]> {
    return getRepository(Account).find({ where: { userId: id } });
  }
}
