import { Resolver, Mutation, Arg } from 'type-graphql';
import { getRepository, Repository, getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

import User from '../../models/User';
import { LoginInput, CreateUserInput, CategoryType } from '../helpers';
import defaultCategories from '../../static/defaultCategories.json';
import Category from '../../models/Category';

@Resolver(User)
export default class AuthenticationResolvers {
  repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  static generateToken(user: User): string {
    return jwt.sign({ user }, process.env.SECRET!, {
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
    userInput: CreateUserInput,
  ): Promise<string> {
    const user = await getConnection().transaction(async (manager) => {
      const createdUser = await manager
        .getRepository(User)
        .save(new User(userInput));

      const categories = defaultCategories.map(
        ({ type, name }) =>
          new Category({
            name,
            type: type as CategoryType,
            userId: createdUser.id,
          }),
      );

      await manager.getRepository(Category).save(categories);

      return createdUser;
    });

    return AuthenticationResolvers.generateToken(user);
  }
}
