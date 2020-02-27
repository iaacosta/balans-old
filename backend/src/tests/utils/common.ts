/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  currencies,
  debitAccounts,
  creditAccounts,
  categories,
  subCategories,
} from './data.json';

export const getCurrencyById = (_id: number) =>
  currencies.find(({ id }) => id === _id);

export const getDebitAccountById = (_id: number) =>
  debitAccounts.find(({ id }) => id === _id);

export const getCreditAccountById = (_id: number) =>
  creditAccounts.find(({ id }) => id === _id);

export const getCategoryById = (_id: number) => {
  const category = categories.find(({ id }) => id === _id)!;
  delete (category as any).createdAt;
  delete (category as any).updatedAt;
  return category;
};

export const getSubCategoriesRelatedToCategory = (_categoryId: number) => {
  const subCats = subCategories.filter(
    ({ categoryId }) => categoryId === _categoryId,
  );

  return subCats.map(({ id, name }) => ({ name, id: id.toString() }));
};
