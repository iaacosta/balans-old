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
import { size } from 'lodash';

import Category from '../../models/Category';
import { Context } from '../../@types';
import {
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../helpers';
import NotFoundError from '../errors/NotFoundError';
import NoChangesError from '../errors/NoChangesError';
import { updateEntity } from '../../utils';

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

  @Mutation(() => Category)
  @Authorized()
  async updateCategory(
    @Arg('input')
    { id, ...toChange }: UpdateCategoryInput,
    @Ctx() { currentUser }: Context,
  ): Promise<Category> {
    if (!size(toChange)) throw new NoChangesError();

    const category = await this.repository.findOneOrFail({
      id,
      userId: currentUser!.id,
    });

    updateEntity(category, toChange);
    return this.repository.save(category);
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
