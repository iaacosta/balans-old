import { Resolver, Ctx, Authorized, Query, Arg } from 'type-graphql';
import { Repository, getRepository } from 'typeorm';

import Category from '../../models/Category';
import { Context } from '../../@types';
import { CategoryType } from '../helpers';

@Resolver(Category)
export default class CategoryResolvers {
  repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  @Query(() => [Category])
  @Authorized()
  async myCategories(
    @Arg('type', () => CategoryType) type: CategoryType,
    @Ctx() { currentUser }: Context,
  ): Promise<Category[]> {
    return this.repository
      .createQueryBuilder('category')
      .select()
      .where('category.userId = :id', { id: currentUser!.id })
      .andWhere('category.type = :type', { type })
      .orderBy('category.name', 'ASC')
      .getMany();
  }
}
