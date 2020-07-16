import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Authorized,
  Ctx,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { size, forEach } from 'lodash';

import User from '../../models/User';
import {
  CreateUserInput,
  ByIdInput,
  UpdateUserInput,
  UpdateAnyUserInput,
} from '../inputTypes';
import NoChangesError from '../errors/NoChangesError';
import roles from '../../constants/roles';
import { Context } from '../../@types';

const repository = getRepository(User);
@Resolver(User)
export default class UserResolvers {
  @Query(() => [User])
  @Authorized(roles.ADMIN)
  users(): Promise<User[]> {
    return repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  @Query(() => User)
  @Authorized(roles.ADMIN)
  user(@Arg('input') { id }: ByIdInput): Promise<User> {
    return repository.findOneOrFail(id);
  }

  @Query(() => User)
  @Authorized()
  me(@Ctx() { currentUser }: Context): Promise<User> {
    return repository.findOneOrFail(currentUser!.id);
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input')
    { firstName, lastName, password, email, username }: CreateUserInput,
  ): Promise<User> {
    const newUser = new User(firstName, lastName, password, email, username);
    const user = await repository.save(newUser);
    return user;
  }

  @Mutation(() => User)
  @Authorized(roles.ADMIN)
  async updateUser(
    @Arg('input')
    { id, ...toChange }: UpdateAnyUserInput,
  ): Promise<User> {
    if (!size(toChange)) throw new NoChangesError();
    const user = await repository.findOneOrFail(id);
    forEach(toChange, (value, key) => {
      if (value) (user as any)[key] = value;
    });
    await repository.save(user);
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
    const user = await repository.findOneOrFail(currentUser!.id);
    await user.verifyPassword(currentPassword);
    forEach(toChange, (value, key) => {
      if (value) (user as any)[key] = value;
    });
    await repository.save(user);
    return user;
  }

  @Mutation(() => ID)
  @Authorized(roles.ADMIN)
  async deleteUser(@Arg('input') { id }: ByIdInput): Promise<number> {
    const user = await repository.findOneOrFail(id);
    await repository.remove(user);
    return id;
  }
}
