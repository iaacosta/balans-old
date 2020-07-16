import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { getRepository } from 'typeorm';

import User from '../../models/User';
import NotFoundError from '../errors/NotFoundError';
import { CreateUserInput, ByIdInput } from '../inputTypes';

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

  @Mutation(() => ID)
  async deleteUser(@Arg('input') { id }: ByIdInput): Promise<number> {
    const user = await repository.findOne(id);
    if (!user) throw new NotFoundError('user');
    await repository.remove(user);
    return id;
  }
}
