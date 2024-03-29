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
import { getRepository, Repository, getConnection } from 'typeorm';
import { size } from 'lodash';

import User from '../../models/User';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateAnyUserInput,
  CategoryType,
} from '../helpers';
import NoChangesError from '../errors/NoChangesError';
import roles from '../../constants/roles';
import { Context } from '../../@types';
import { updateEntity } from '../../utils/typeORM';
import defaultCategories from '../../static/defaultCategories.json';
import Category from '../../models/Category';
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
      .createQueryBuilder('user')
      .select()
      .orderBy('user.createdAt', 'DESC')
      .withDeleted()
      .where('user.deletedAt IS NOT NULL')
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
  async createUser(
    @Arg('input')
    userInput: CreateUserInput,
  ): Promise<User> {
    const user = await getConnection().transaction(async (manager) => {
      const createdUser = await manager
        .getRepository(User)
        .save(new User(userInput));

      const categories = defaultCategories.map(
        ({ type, ...category }) =>
          new Category({
            ...category,
            type: type as CategoryType,
            userId: createdUser.id,
          }),
      );

      await manager.getRepository(Category).save(categories);

      return createdUser;
    });

    return user;
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

  /* TODO: check if this is necessary */
  @FieldResolver()
  accounts(@Root() { id }: User): Promise<Account[]> {
    return getRepository(Account).find({ where: { userId: id } });
  }
}
