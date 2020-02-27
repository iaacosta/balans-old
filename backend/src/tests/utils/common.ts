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

export const getCategoryById = (_id: number) => {
  const category = categories.find(({ id }) => id === _id)!;
  delete (category as any).createdAt;
  delete (category as any).updatedAt;
  return category;
};

export const getDebitAccountsRelatedToCurrency = (_currencyId: number) => {
  const accounts = debitAccounts.filter(
    ({ currencyId }) => currencyId === _currencyId,
  );

  return accounts.map(({ id, name, bank, allowsNegative, initialBalance }) => ({
    id: id.toString(),
    name,
    bank,
    initialBalance,
    allowsNegative,
  }));
};

export const getCreditAccountsRelatedToCurrency = (_currencyId: number) => {
  const accounts = creditAccounts.filter(
    ({ currencyId }) => currencyId === _currencyId,
  );

  return accounts.map(
    ({ id, name, bank, initialBalance, billingDay, paymentDay }) => ({
      id: id.toString(),
      name,
      bank,
      initialBalance,
      billingDay,
      paymentDay,
    }),
  );
};

export const getSubCategoriesRelatedToCategory = (_categoryId: number) => {
  const subCats = subCategories.filter(
    ({ categoryId }) => categoryId === _categoryId,
  );

  return subCats.map(({ id, name }) => ({ name, id: id.toString() }));
};
