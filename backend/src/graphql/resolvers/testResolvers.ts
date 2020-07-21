/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Mutation, Resolver, Ctx } from 'type-graphql';
import { Context } from '../../@types';

@Resolver()
export default class TestResolvers {
  @Mutation(() => Boolean)
  async resetDatabase(@Ctx() { connection }: Context): Promise<boolean> {
    if (process.env.NODE_ENV !== 'cypress') return false;

    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);

      let query = `DELETE FROM ${entity.tableName};`;
      if (entity.tableName === 'user') {
        query = `DELETE FROM public.${entity.tableName};`;
      }

      await repository.query(query);
    }

    return true;
  }
}
