import { getRepository, In } from 'typeorm';
import { validateOrReject } from 'class-validator';

import { ResolverMap } from '../../@types';
import SubCategory from '../../models/SubCategory';
import Category from '../../models/Category';
import { categoryById } from './category';
import { incomesById } from './income';

type Queries = 'getSubCategory' | 'getSubCategories';
type Mutations =
  | 'createSubCategory'
  | 'updateSubCategory'
  | 'deleteSubCategory';
interface Input {
  id: number;
  name: string;
  categoryId: number;
}

const relations = ['category', 'incomes'];

export const subCategoryById = async (id: number) => {
  const subCategory = await getRepository(SubCategory).findOne(id, {
    relations,
  });

  if (!subCategory) throw new Error('no sub category with such id');
  return subCategoryResolver(subCategory);
};

export const subCategoriesById = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const subCategories = await getRepository(SubCategory).find({
    where: { id: In(ids) },
    relations,
  });

  return subCategories.map((subCat) => subCategoryResolver(subCat));
};

export const subCategoryResolver = ({
  category,
  incomes,
  ...subCategory
}: SubCategory) => ({
  ...subCategory,
  incomes: () => incomesById(incomes.map(({ id }) => id)),
  category: () => categoryById(category.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getSubCategories: async () => {
      const subCategories = await getRepository(SubCategory).find({
        relations,
      });

      return subCategories.map(subCategoryResolver);
    },
    getSubCategory: async (parent, { id }) => subCategoryById(id),
  },
  Mutation: {
    createSubCategory: async (parent, { name, categoryId }) => {
      const category = await getRepository(Category).findOne(categoryId);
      if (!category) throw new Error('no category with such id');

      const subCategory = new SubCategory(name, category);
      await validateOrReject(subCategory);

      return subCategoryResolver(
        await getRepository(SubCategory).save(subCategory),
      );
    },
    updateSubCategory: async (parent, { id, name, categoryId }) => {
      const repo = getRepository(SubCategory);
      const subCategory = await repo.findOne(id, { relations });
      if (!subCategory) throw new Error('no sub category with such id');

      if (name && subCategory.name !== name) subCategory.name = name;

      if (categoryId && subCategory.category.id !== categoryId) {
        const category = await getRepository(Category).findOne(categoryId);
        if (!category) throw new Error('no category with such id');
        subCategory.category = category;
      }

      await validateOrReject(subCategory);
      return subCategoryResolver(await repo.save(subCategory));
    },
    deleteSubCategory: async (parent, { id }) => {
      const repo = getRepository(SubCategory);
      const subCategory = await repo.findOne(id);
      if (!subCategory) throw new Error('no sub category with such id');
      await repo.remove(subCategory);
      return id;
    },
  },
};

export default resolvers;
