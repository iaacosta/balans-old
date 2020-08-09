import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Authorized,
  Ctx,
} from 'type-graphql';
import { getRepository, Repository, IsNull, Not } from 'typeorm';
import { size, forEach } from 'lodash';

import User from '../../models/User';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateAnyUserInput,
} from '../inputTypes';
import NoChangesError from '../errors/NoChangesError';
import roles from '../../constants/roles';
import { Context } from '../../@types';

@Resolver(User)
export default class UserResolvers {
  repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  @Query(() => [User])
  @Authorized(roles.ADMIN)
  users(): Promise<User[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  @Query(() => [User])
  @Authorized(roles.ADMIN)
  deletedUsers(): Promise<User[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
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
    { firstName, lastName, password, email, username }: CreateUserInput,
  ): Promise<User> {
    const newUser = new User(firstName, lastName, password, email, username);
    const user = await this.repository.save(newUser);
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
    forEach(toChange, (value, key) => {
      /* istanbul ignore next */
      if (value) (user as any)[key] = value;
    });
    await this.repository.save(user);
    return user;
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
    forEach(toChange, (value, key) => {
      /* istanbul ignore next */
      if (value) (user as any)[key] = value;
    });
    await this.repository.save(user);
    return user;
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
    await this.repository.recover(user);
    return user;
  }
}
