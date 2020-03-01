import { getRepository, In } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Dayjs } from 'dayjs';

import { ResolverMap } from '../../@types';
import Expense from '../../models/Expense';
import { accountById } from './account';
import { subCategoryById } from './subCategory';
import { placeById } from './place';
import SubCategory from '../../models/SubCategory';
import Account from '../../models/Account';
import Place from '../../models/Place';

type Queries = 'getExpense' | 'getExpenses';
type Mutations = 'createExpense' | 'updateExpense' | 'deleteExpense';
interface Input {
  id: number;
  amount: number;
  description?: string;
  date: Dayjs;
  installments?: number;
  accountId: number;
  subCategoryId: number;
  placeId: number;
}

const relations = ['account', 'subCategory', 'place'];

export const expenseById = async (id: number) => {
  const expense = await getRepository(Expense).findOne(id, {
    relations,
  });

  if (!expense) throw new Error('no expense with such id');

  return expenseResolver(expense);
};

export const expensesById = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const expenses = await getRepository(Expense).find({
    where: { id: In(ids) },
    relations,
  });

  return expenses.map((subCat) => expenseResolver(subCat));
};

export const expenseResolver = ({
  account,
  subCategory,
  place,
  ...expense
}: Expense) => ({
  ...expense,
  account: () => accountById(account.id),
  subCategory: () => subCategoryById(subCategory.id),
  place: () => placeById(place.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getExpenses: async () => {
      const expenses = await getRepository(Expense).find({
        relations,
        order: { id: 1 },
      });

      return expenses.map(expenseResolver);
    },
    getExpense: async (parent, { id }) => expenseById(id),
  },
  Mutation: {
    createExpense: async (
      parent,
      {
        description,
        amount,
        date,
        installments,
        subCategoryId,
        accountId,
        placeId,
      },
    ) => {
      const subCat = await getRepository(SubCategory).findOne(subCategoryId);
      if (!subCat) throw new Error('no sub category with such id');
      const account = await getRepository(Account).findOne(accountId, {
        relations: ['incomes', 'expenses'],
      });
      if (!account) throw new Error('no account with such id');
      const place = await getRepository(Place).findOne(placeId);
      if (!place) throw new Error('no place with such id');

      const expense = new Expense(
        amount,
        date,
        account,
        subCat,
        place,
        description,
        installments,
      );

      await validateOrReject(expense);

      return expenseResolver(await getRepository(Expense).save(expense));
    },
    updateExpense: async (
      parent,
      {
        id,
        amount,
        date,
        subCategoryId,
        accountId,
        placeId,
        description,
        installments,
      },
    ) => {
      const repo = getRepository(Expense);
      const expense = await repo.findOne(id, {
        relations: [...relations, 'account.incomes', 'account.expenses'],
      });
      if (!expense) throw new Error('no expense with such id');

      if (date && expense.date !== date) expense.date = date;
      if (amount !== undefined && expense.amount !== amount) {
        expense.amount = amount;
      }
      if (description !== undefined && expense.description !== description) {
        expense.description = description;
      }
      if (installments !== undefined && expense.installments !== installments) {
        expense.installments = installments;
      }

      if (subCategoryId && expense.subCategory.id !== subCategoryId) {
        const subCat = await getRepository(SubCategory).findOne(subCategoryId);
        if (!subCat) throw new Error('no sub category with such id');
        expense.subCategory = subCat;
      }

      if (accountId && expense.account.id !== accountId) {
        const account = await getRepository(Account).findOne(accountId);
        if (!account) throw new Error('no account with such id');
        expense.account = account;
      }

      if (placeId && expense.place.id !== placeId) {
        const place = await getRepository(Place).findOne(placeId);
        if (!place) throw new Error('no place with such id');
        expense.place = place;
      }

      await validateOrReject(expense);
      return expenseResolver(await repo.save(expense));
    },
    deleteExpense: async (parent, { id }) => {
      const repo = getRepository(Expense);
      const expense = await repo.findOne(id);
      if (!expense) throw new Error('no expense with such id');
      await repo.remove(expense);
      return id;
    },
  },
};

export default resolvers;
