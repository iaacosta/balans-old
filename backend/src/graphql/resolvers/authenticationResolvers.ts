import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import User from '../../models/User';
import { LoginInput } from '../inputTypes';
import { Context } from '../../@types';

const repository = getRepository(User);
@Resolver(User)
export default class UserResolvers {
  @Mutation(() => String)
  async login(
    @Arg('input')
    { username, password }: LoginInput,
  ): Promise<string> {
    const user = await repository.findOneOrFail({ where: { username } });
    await user.verifyPassword(password);

    const token = jwt.sign({ id: user.id }, process.env.SECRET!, {
      expiresIn: 3600 * 24 * 14, // two weeks
    });

    return token;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() {}: Context): Promise<boolean> {
    /* TODO: blacklist token */
    return true;
  }
}
