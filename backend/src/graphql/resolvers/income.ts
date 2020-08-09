import { getRepository, In } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Dayjs } from 'dayjs';

import { ResolverMap } from '../../@types';
import Income from '../../models/Income';
import { accountById } from './account';
import { subCategoryById } from './subCategory';
import SubCategory from '../../models/SubCategory';
import Account from '../../models/_Account';

type Queries = 'getIncome' | 'getIncomes';
type Mutations = 'createIncome' | 'updateIncome' | 'deleteIncome';
interface Input {
  id: number;
  amount: number;
  description?: string;
  date: Dayjs;
  accountId: number;
  subCategoryId: number;
}

const relations = ['account', 'subCategory'];
const accountRelations = ['expenses', 'incomes'];

export const incomeById = async (id: number) => {
  const income = await getRepository(Income).findOne(id, { relations });
  if (!income) throw new Error('no income with such id');
  return incomeResolver(income);
};

export const incomesById = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const incomes = await getRepository(Income).find({
    where: { id: In(ids) },
    relations,
  });

  return incomes.map((subCat) => incomeResolver(subCat));
};

export const incomeResolver = ({
  account,
  subCategory,
  ...income
}: Income) => ({
  ...income,
  account: () => accountById(account.id),
  subCategory: () => subCategoryById(subCategory.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getIncomes: async () => {
      const incomes = await getRepository(Income).find({
        relations,
        order: { id: 1 },
      });

      return incomes.map(incomeResolver);
    },
    getIncome: async (parent, { id }) => incomeById(id),
  },
  Mutation: {
    createIncome: async (
      parent,
      { description, amount, date, subCategoryId, accountId },
    ) => {
      const subCat = await getRepository(SubCategory).findOne(subCategoryId);
      if (!subCat) throw new Error('no sub category with such id');
      const account = await getRepository(Account).findOne(accountId, {
        relations: accountRelations,
      });
      if (!account) throw new Error('no account with such id');

      const income = new Income(amount, date, account, subCat, description);

      await validateOrReject(income);
      return incomeResolver(await getRepository(Income).save(income));
    },
    updateIncome: async (
      parent,
      { id, amount, date, subCategoryId, accountId, description },
    ) => {
      const repo = getRepository(Income);
      const income = await repo.findOne(id, {
        relations: [
          ...relations,
          ...accountRelations.map((val) => `account.${val}`),
        ],
      });
      if (!income) throw new Error('no income with such id');

      if (date && income.date !== date) income.date = date;
      if (amount !== undefined && income.amount !== amount) {
        income.amount = amount;
      }
      if (description !== undefined && income.description !== description) {
        income.description = description;
      }

      if (subCategoryId && income.subCategory.id !== subCategoryId) {
        const subCat = await getRepository(SubCategory).findOne(subCategoryId);
        if (!subCat) throw new Error('no sub category with such id');
        income.subCategory = subCat;
      }

      if (accountId && income.account.id !== accountId) {
        const account = await getRepository(Account).findOne(accountId);
        if (!account) throw new Error('no account with such id');
        income.account = account;
      }

      await validateOrReject(income);
      return incomeResolver(await repo.save(income));
    },
    deleteIncome: async (parent, { id }) => {
      const repo = getRepository(Income);
      const income = await repo.findOne(id, {
        relations: [
          ...relations,
          ...accountRelations.map((val) => `account.${val}`),
        ],
      });
      if (!income) throw new Error('no income with such id');
      await repo.remove(income);
      return id;
    },
  },
};

export default resolvers;
