/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Mutation, Resolver, Ctx, Arg } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Context } from '../../@types';
import { CreateUserInput } from '../helpers';
import User from '../../models/User';

@Resolver()
export default class TestResolvers {
  @Mutation(() => User, { nullable: true })
  async setupDatabase(
    @Arg('adminUser')
    { firstName, lastName, password, email, username }: CreateUserInput,
    @Ctx() { connection }: Context,
  ): Promise<User | null> {
    if (process.env.NODE_ENV !== 'cypress') return null;

    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);

      let query = `DELETE FROM ${entity.tableName};`;
      if (entity.tableName === 'user') {
        query = `DELETE FROM public.${entity.tableName};`;
      }

      await repository.query(query);
    }

    const newUser = new User(
      firstName,
      lastName,
      password,
      email,
      username,
      'admin',
    );

    const user = await getRepository(User).save(newUser);

    return user;
  }
}
