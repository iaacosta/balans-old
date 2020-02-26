import { getRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import { ResolverMap, CategoryType } from '../../@types';
import Category from '../../models/Category';

type Queries = 'getCategory' | 'getCategories';
type Mutations = 'createCategory' | 'updateCategory' | 'deleteCategory';
interface Input {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
}

export const categoryById = async (id: number) => {
  const category = await getRepository(Category).findOne(id);
  if (!category) throw new Error('no category with such id');
  return categoryResolver(category);
};

export const categoryResolver = (category: Category) => ({
  ...category,
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getCategories: async () => {
      const categories = await getRepository(Category).find();
      return categories.map(categoryResolver);
    },
    getCategory: async (parent, { id }) => categoryById(id),
  },
  Mutation: {
    createCategory: async (parent, { name, type, icon }) => {
      const category = new Category(name, type, icon);

      await validateOrReject(category);
      return categoryResolver(await getRepository(Category).save(category));
    },
    updateCategory: async (parent, { id, name, type, icon }) => {
      const repo = getRepository(Category);
      const category = await repo.findOne(id);
      if (!category) throw new Error('no category with such id');

      if (name && category.name !== name) category.name = name;
      if (type && category.type !== type) category.type = type;
      if (icon && category.icon !== icon) category.icon = icon;

      await validateOrReject(category);
      return categoryResolver(await repo.save(category));
    },
    deleteCategory: async (parent, { id }) => {
      const repo = getRepository(Category);
      const category = await repo.findOne(id);
      if (!category) throw new Error('no category with such id');
      await repo.remove(category);
      return id;
    },
  },
};

export default resolvers;
