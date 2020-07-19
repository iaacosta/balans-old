import { Resolver, Mutation, Arg } from 'type-graphql';
import { getRepository, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

import User from '../../models/User';
import { LoginInput, CreateUserInput } from '../inputTypes';

@Resolver(User)
export default class AuthenticationResolvers {
  repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  static generateToken(user: User) {
    return jwt.sign({ id: user.id }, process.env.SECRET!, {
      expiresIn: 3600 * 24 * 14, // two weeks
    });
  }

  @Mutation(() => String)
  async login(
    @Arg('input')
    { username, password }: LoginInput,
  ): Promise<string> {
    let user: User;

    try {
      user = await this.repository.findOneOrFail({ where: { username } });
      await user.verifyPassword(password);
    } catch (err) {
      throw new AuthenticationError('incorrect username or password');
    }

    return AuthenticationResolvers.generateToken(user);
  }

  @Mutation(() => String)
  async signUp(
    @Arg('input')
    { firstName, lastName, password, email, username }: CreateUserInput,
  ): Promise<string> {
    const newUser = new User(firstName, lastName, password, email, username);
    const user = await this.repository.save(newUser);
    return AuthenticationResolvers.generateToken(user);
  }
}
