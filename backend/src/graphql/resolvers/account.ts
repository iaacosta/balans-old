import { getRepository, Repository } from 'typeorm';

import DebitAccount from '../../models/DebitAccount';
import { Resolvers } from '../../@types/common';
import Currency from '../../models/Currency';
import { currencyById } from './currency';

type Input = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  allowsNegative: boolean;
  currencyId: number;
};

export const debitAccountById = async (
  repo: Repository<DebitAccount>,
  id: number,
) => {
  const debitAccount = await repo.findOne(id, { relations: ['currency'] });
  if (!debitAccount) throw new Error('no currency with this id');
  return debitAccountResolver(debitAccount);
};

export const debitAccountResolver = ({
  currency,
  ...debitAccount
}: DebitAccount) => ({
  ...debitAccount,
  currency: () => currencyById(getRepository(Currency), currency.id),
});

export default {
  Query: {
    getDebitAccounts: async () => {
      const accounts = await getRepository(DebitAccount).find({
        relations: ['currency'],
      });

      return accounts.map(debitAccountResolver);
    },
    getDebitAccount: (parent, { id }) =>
      debitAccountById(getRepository(DebitAccount), id),
  },
  Mutation: {
    createDebitAccount: async (
      parent,
      { name, bank, allowsNegative, currencyId, initialBalance },
    ) => {
      const currency = await getRepository(Currency).findOneOrFail(currencyId);
      const acc = new DebitAccount(
        name,
        bank,
        initialBalance,
        allowsNegative,
        currency,
      );

      return getRepository(DebitAccount).save(acc);
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
      if (initialBalance && account.initialBalance !== initialBalance) {
        account.initialBalance = initialBalance;
      }

      /* Currency */
      if (account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

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
} as { Query: Resolvers<Input>; Mutation: Resolvers<Input> };
