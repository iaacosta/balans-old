/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Category from '../../models/Category';
import { CategoryType } from '../../graphql/helpers';
import { CategoryPair } from './transactionFactory';

export type BuildType = Pick<Category, 'name' | 'type'>;

export const categoryFactory = (overrides?: Partial<BuildType>) => {
  const categoryBuilder = build<BuildType>('Category', {
    fields: {
      name: fake((faker) => faker.commerce.productName()),
      type: oneOf(CategoryType.expense, CategoryType.income),
    },
  });

  return categoryBuilder({
    map: (category) => ({ ...category, ...overrides }),
  });
};

export const categoryModelFactory = (
  userId: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryCategory = categoryFactory(overrides);
  const category = new Category({ ...factoryCategory, userId });

  return { factoryCategory, category };
};

export const createCategory = async (
  connection: Connection,
  userId: number,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();
  const factoryCategory = categoryFactory(overrides);
  const category = new Category({ ...factoryCategory, userId });
  const databaseCategory = await entityManager
    .getRepository(Category)
    .save(category);

  return {
    databaseCategory,
    factoryCategory,
    category,
  };
};

export const createCategoryPair = async (
  connection: Connection,
  userId: number,
): Promise<CategoryPair> => ({
  income: (
    await createCategory(connection, userId, { type: CategoryType.income })
  ).databaseCategory,
  expense: (
    await createCategory(connection, userId, { type: CategoryType.expense })
  ).databaseCategory,
});
