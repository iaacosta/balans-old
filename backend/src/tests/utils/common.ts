import {
  currencies,
  accounts,
  categories,
  subCategories,
  incomes,
  places,
  expenses,
} from './data.json';

export const getCurrencyById = (_id: number) => {
  const currency = currencies.find(({ id }) => id === _id)!;
  delete (currency as any).createdAt;
  delete (currency as any).updatedAt;
  return currency;
};

export const getCategoryById = (_id: number) => {
  const category = categories.find(({ id }) => id === _id)!;
  delete (category as any).createdAt;
  delete (category as any).updatedAt;
  return category;
};

export const getSubCategoryById = (_id: number) => {
  const subCat = subCategories.find(({ id }) => id === _id)!;
  delete (subCat as any).createdAt;
  delete (subCat as any).updatedAt;
  return subCat;
};

export const getPlaceById = (_id: number) => {
  const place = places.find(({ id }) => id === _id)!;
  delete (place as any).createdAt;
  delete (place as any).updatedAt;
  return place;
};

export const getAccountById = (_id: number) => {
  const account = accounts.find(({ id }) => id === _id)!;
  delete (account as any).createdAt;
  delete (account as any).updatedAt;
  return account;
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

export const getIncomesRelated = (
  _id: number,
  model: 'subCategory' | 'account',
) => {
  const incs = incomes.filter((income) => {
    const chosenId =
      model === 'subCategory' ? income.subCategoryId : income.accountId;
    return _id === chosenId;
  });

  return incs.map(({ id, amount, description, date }) => ({
    amount,
    id: id.toString(),
    date: new Date(date).valueOf(),
    description,
  }));
};

export const getExpensesRelated = (
  _id: number,
  model: 'subCategory' | 'account' | 'place',
) => {
  const exps = expenses.filter((expense) => {
    let chosenId = 0;

    if (model === 'subCategory') chosenId = expense.subCategoryId;
    else if (model === 'account') chosenId = expense.accountId;
    else if (model === 'place') chosenId = expense.placeId;

    return _id === chosenId;
  });

  return exps.map(({ id, amount, description, date, installments }) => ({
    id: id.toString(),
    amount,
    date: new Date(date).valueOf(),
    description,
    installments,
  }));
};
