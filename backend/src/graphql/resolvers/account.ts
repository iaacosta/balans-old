import { getRepository, In } from 'typeorm';
import { validateOrReject } from 'class-validator';

import Account from '../../models/Account';
import Currency from '../../models/Currency';
import { currencyById } from './currency';
import { incomesById } from './income';
import { ResolverMap, AccountType } from '../../@types';
import { expensesById } from './expense';

type Queries = 'getAccount' | 'getAccounts';
type Mutations = 'createAccount' | 'updateAccount' | 'deleteAccount';
type Input = {
  id: number;
  type: AccountType;
  name: string;
  bank: string;
  initialBalance: number;
  currencyId: number;
  billingDay?: number;
  paymentDay?: number;
};

const relations = ['currency', 'incomes', 'expenses'];

export const accountById = async (id: number) => {
  const account = await getRepository(Account).findOne(id, { relations });
  if (!account) throw new Error('no debit account with such id');
  return accountResolver(account);
};

export const accountsById = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const accounts = await getRepository(Account).find({
    where: { id: In(ids) },
    relations,
  });

  return accounts.map((account) => accountResolver(account));
};

export const accountResolver = ({
  currency,
  incomes,
  expenses,
  ...account
}: Account) => ({
  ...account,
  incomes: () => incomesById(incomes.map(({ id }) => id)),
  expenses: () => expensesById(expenses.map(({ id }) => id)),
  currency: () => currencyById(currency.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getAccounts: async () => {
      const accounts = await getRepository(Account).find({
        relations,
        order: { id: 1 },
      });

      return accounts.map((account) => accountResolver(account));
    },
    getAccount: (parent, { id }) => accountById(id),
  },
  Mutation: {
    createAccount: async (
      parent,
      { type, name, bank, initialBalance, currencyId, billingDay, paymentDay },
    ) => {
      const currency = await getRepository(Currency).findOne(currencyId);
      if (!currency) throw new Error('no currency with such id');
      const account = new Account(
        type,
        name,
        bank,
        initialBalance,
        currency,
        billingDay,
        paymentDay,
      );

      await validateOrReject(account);
      return accountResolver(await getRepository(Account).save(account));
    },
    updateAccount: async (
      parent,
      { id, name, bank, initialBalance, currencyId, billingDay, paymentDay },
    ) => {
      const repo = getRepository(Account);
      const account = await repo.findOne(id, { relations });
      if (!account) throw new Error('no debit account with such id');

      /* Base attributes */
      if (name && account.name !== name) account.name = name;
      if (bank && account.bank !== bank) account.bank = bank;

      if (
        initialBalance !== undefined &&
        account.initialBalance !== initialBalance
      ) {
        account.initialBalance = initialBalance;
      }

      if (
        account.type === 'credit' &&
        billingDay &&
        billingDay !== account.billingDay
      ) {
        account.billingDay = billingDay;
      }

      if (
        account.type === 'credit' &&
        paymentDay &&
        paymentDay !== account.paymentDay
      ) {
        account.paymentDay = paymentDay;
      }

      /* Currency */
      if (currencyId && account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

      await validateOrReject(account);
      return accountResolver(await repo.save(account));
    },
    deleteAccount: async (parent, { id }) => {
      const repo = getRepository(Account);
      const account = await repo.findOne(id);
      if (!account) throw new Error('no account with such id');
      await repo.remove(account);
      return id;
    },
  },
};

export default resolvers;
