/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { currencies, accounts, categories, subCategories } from './data.json';

export const getCurrencyById = (_id: number) =>
  currencies.find(({ id }) => id === _id);

export const getCategoryById = (_id: number) => {
  const category = categories.find(({ id }) => id === _id)!;
  delete (category as any).createdAt;
  delete (category as any).updatedAt;
  return category;
};

export const getAccountsRelatedToCurrency = (_currencyId: number) => {
  const accs = accounts.filter(({ currencyId }) => currencyId === _currencyId);

  return accs.map(
    ({ id, type, name, bank, initialBalance, paymentDay, billingDay }) => {
      const acc: any = {
        id: id.toString(),
        type,
        name,
        bank,
        initialBalance,
      };

      if (paymentDay) acc.paymentDay = paymentDay;
      if (billingDay) acc.billingDay = billingDay;

      return acc as Account;
    },
  );
};

export const getSubCategoriesRelatedToCategory = (_categoryId: number) => {
  const subCats = subCategories.filter(
    ({ categoryId }) => categoryId === _categoryId,
  );

  return subCats.map(({ id, name }) => ({ name, id: id.toString() }));
};
