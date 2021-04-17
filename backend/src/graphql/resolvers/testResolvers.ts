/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Mutation, Resolver, Arg } from 'type-graphql';
import { getRepository, getConnection } from 'typeorm';
import { CreateUserInput } from '../helpers';
import User from '../../models/User';

@Resolver()
export default class TestResolvers {
  @Mutation(() => User, { nullable: true })
  async setupDatabase(
    @Arg('adminUser')
    user: CreateUserInput,
  ): Promise<User | null> {
    if (process.env.NODE_ENV !== 'cypress') return null;
    const connection = getConnection();

    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(
        `DELETE FROM "${entity.tableName}"; ALTER SEQUENCE ${entity.tableName}_id_seq RESTART WITH 1;`,
      );
    }

    const createdUser = await getRepository(User).save(
      new User({ ...user, role: 'admin' }),
    );

    return createdUser;
  }
}
