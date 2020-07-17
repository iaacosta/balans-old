import { Resolver, Mutation, Arg } from 'type-graphql';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

import User from '../../models/User';
import { LoginInput } from '../inputTypes';

const repository = getRepository(User);
@Resolver(User)
export default class UserResolvers {
  @Mutation(() => String)
  async login(
    @Arg('input')
    { username, password }: LoginInput,
  ): Promise<string> {
    let user: User;

    try {
      user = await repository.findOneOrFail({ where: { username } });
      await user.verifyPassword(password);
    } catch (err) {
      throw new AuthenticationError('incorrect username or password');
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET!, {
      expiresIn: 3600 * 24 * 14, // two weeks
    });

    return token;
  }
}
