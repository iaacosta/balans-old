import {
  Resolver,
  Ctx,
  Authorized,
  Query,
  Arg,
  Mutation,
  ID,
} from 'type-graphql';
import { Repository, getRepository } from 'typeorm';

import Category from '../../models/Category';
import { Context } from '../../@types';
import { CategoryType, CreateCategoryInput } from '../helpers';
import NotFoundError from '../errors/NotFoundError';

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

  @Mutation(() => Category)
  @Authorized()
  async createCategory(
    @Arg('input') categoryInput: CreateCategoryInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Category> {
    const category = await this.repository.save(
      new Category({ ...categoryInput, userId: currentUser!.id }),
    );

    return category;
  }

  @Mutation(() => ID)
  @Authorized()
  async deleteCategory(
    @Arg('id', () => ID) id: string,
    @Ctx() { currentUser }: Context,
  ): Promise<string> {
    const category = await this.repository
      .createQueryBuilder('category')
      .select()
      .where('category.id = :id', { id })
      .andWhere('category.userId = :userId', { userId: currentUser!.id })
      .getOne();

    if (!category) throw new NotFoundError('category');
    await this.repository.remove(category);
    return id;
  }
}
