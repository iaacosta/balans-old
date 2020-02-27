import { getRepository, In } from 'typeorm';
import { validateOrReject } from 'class-validator';

import { currencyById } from './currency';
import DebitAccount from '../../models/DebitAccount';
import { ResolverMap } from '../../@types';
import Currency from '../../models/Currency';

type Queries = 'getDebitAccount' | 'getDebitAccounts';
type Mutations =
  | 'createDebitAccount'
  | 'updateDebitAccount'
  | 'deleteDebitAccount';
type Input = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  allowsNegative: boolean;
  currencyId: number;
};

export const debitAccountById = async (id: number) => {
  const debitAccount = await getRepository(DebitAccount).findOne(id, {
    relations: ['currency'],
  });
  if (!debitAccount) throw new Error('no debit account with such id');
  return debitAccountResolver(debitAccount);
};

export const debitAccountsById = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const debitAccounts = await getRepository(DebitAccount).find({
    where: { id: In(ids) },
    relations: ['currency'],
  });

  return debitAccounts.map((account) => debitAccountResolver(account));
};

export const debitAccountResolver = ({
  currency,
  ...debitAccount
}: DebitAccount) => ({
  ...debitAccount,
  currency: () => currencyById(currency.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getDebitAccounts: async () => {
      const accounts = await getRepository(DebitAccount).find({
        relations: ['currency'],
      });

      return accounts.map((account) => debitAccountResolver(account));
    },
    getDebitAccount: (parent, { id }) => debitAccountById(id),
  },
  Mutation: {
    createDebitAccount: async (
      parent,
      { name, bank, allowsNegative, currencyId, initialBalance },
    ) => {
      const currency = await getRepository(Currency).findOne(currencyId);
      if (!currency) throw new Error('no currency with such id');
      const account = new DebitAccount(
        name,
        bank,
        initialBalance,
        allowsNegative,
        currency,
      );

      await validateOrReject(account);
      return debitAccountResolver(
        await getRepository(DebitAccount).save(account),
      );
    },
    updateDebitAccount: async (
      parent,
      { id, name, bank, initialBalance, currencyId },
    ) => {
      const repo = getRepository(DebitAccount);
      const account = await repo.findOne(id, { relations: ['currency'] });
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

      /* Currency */
      if (currencyId && account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

      await validateOrReject(account);
      return debitAccountResolver(await repo.save(account));
    },
    deleteDebitAccount: async (parent, { id }) => {
      const repo = getRepository(DebitAccount);
      const account = await repo.findOne(id);
      if (!account) throw new Error('no account with such id');
      await repo.remove(account);
      return id;
    },
  },
};

export default resolvers;
