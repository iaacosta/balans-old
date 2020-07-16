import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { getRepository } from 'typeorm';
import { size, forEach } from 'lodash';

import User from '../../models/User';
import { CreateUserInput, ByIdInput, UpdateUserInput } from '../inputTypes';
import NoChangesError from '../errors/NoChangesError';

const repository = getRepository(User);
@Resolver(User)
export default class UserResolvers {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await repository.find({
      order: { createdAt: 'DESC' },
    });

    return users;
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
  async updateUser(
    @Arg('input')
    { id, currentPassword, ...toChange }: UpdateUserInput,
  ): Promise<User> {
    if (!size(toChange)) throw new NoChangesError();
    const user = await repository.findOneOrFail(id);
    await user.verifyPassword(currentPassword);
    forEach(toChange, (value, key) => value && ((user as any)[key] = value));
    await repository.save(user);
    return user;
  }

  @Mutation(() => ID)
  async deleteUser(@Arg('input') { id }: ByIdInput): Promise<number> {
    const user = await repository.findOneOrFail(id);
    await repository.remove(user);
    return id;
  }
}
